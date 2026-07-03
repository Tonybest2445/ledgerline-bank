// Option B: Banking-as-a-Service adapter for Unit.co's SANDBOX environment.
//
// This calls Unit's real API in test mode — no real money moves, but the
// request/response shapes, KYC flow, and account/payment objects are real.
// Docs: https://docs.unit.co
//
// IMPORTANT: Unit's API evolves. Before going anywhere near production, re-check
// the current docs for required KYC fields, webhook handling, and go-live requirements
// (Unit requires a compliance review before you can move real money, even after
// sandbox integration is complete).
//
// Required env vars: UNIT_API_TOKEN, UNIT_API_BASE_URL (defaults to sandbox URL)

const BASE_URL = process.env.UNIT_API_BASE_URL || "https://api.s.unit.sh";
const TOKEN = process.env.UNIT_API_TOKEN;

async function unitRequest(path, { method = "GET", body } = {}) {
  if (!TOKEN) {
    throw new Error(
      "UNIT_API_TOKEN is not set. Sign up for a free sandbox at https://unit.co and add your token to .env"
    );
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/vnd.api+json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = json?.errors?.[0]?.title || `Unit API error (${res.status})`;
    console.log(`[Unit] Request to ${path} failed (${res.status}):`, JSON.stringify(json));
    const err = new Error(message);
    err.details = json;
    throw err;
  }

  return json;
}

// Creates a Unit "individual application". If auto-approved by sandbox underwriting
// rules, Unit will create the customer + a first deposit account automatically.
// Real KYC requires full legal name, DOB, SSN, and address — this is the minimum
// sandbox test shape. See: https://docs.unit.co/applications#create-individual-application
async function createCustomer({ fullName, email, ssn = "072052765", dob = "2001-08-10" }) {
  const [firstName, ...rest] = fullName.trim().split(" ");
  const lastName = rest.join(" ") || firstName;

  const payload = {
    data: {
      type: "individualApplication",
      attributes: {
        ssn, // sandbox test SSNs are documented in Unit's testing guide
        fullName: { first: firstName, last: lastName },
        dateOfBirth: dob,
        address: {
          street: "5230 Newell Rd",
          city: "Palo Alto",
          state: "CA",
          postalCode: "94303",
          country: "US",
        },
        email,
        phone: { countryCode: "1", number: "2025550123" },
        ip: "127.0.0.1",
      },
    },
  };

  console.log(`[Unit] Creating application for ${email} against ${BASE_URL}`);
  const result = await unitRequest("/applications", { method: "POST", body: payload });
  const applicationId = result.data.id;
  let status = result.data.attributes.status;
  let customerId = result.data.relationships?.customer?.data?.id || null;

  console.log(`[Unit] Application ${applicationId} created with status: ${status}`);

  if (status !== "Approved" && status !== "Denied") {
    await unitRequest(`/sandbox/applications/${applicationId}/approve`, {
      method: "POST",
      body: { data: { type: "applicationApprove", attributes: { reason: "sandbox" } } },
    });

    const refreshed = await unitRequest(`/applications/${applicationId}`);
    status = refreshed.data.attributes.status;
    customerId = refreshed.data.relationships?.customer?.data?.id || null;
    console.log(`[Unit] After force-approve, status: ${status}, customerId: ${customerId}`);
  }

  if (status === "Denied") {
    console.log(`[Unit] Application denied. Full response:`, JSON.stringify(result.data));
    throw new Error(
      "Unit denied this sandbox application — check dashboard.unit.co → Applications for the reason"
    );
  }

  return { applicationId, status, externalCustomerId: customerId };
}

// Opens an additional deposit account for an already-approved customer.
// https://docs.unit.co/deposit-accounts#create-deposit-account
async function createAccount({ externalCustomerId, type = "checking", name }) {
  if (!externalCustomerId) {
    throw new Error(
      "No Unit customer on file yet — the application must be Approved before opening accounts"
    );
  }

  const payload = {
    data: {
      type: "depositAccount",
      attributes: { depositProduct: type === "savings" ? "savings" : "checking", tags: { name } },
      relationships: {
        customer: { data: { type: "customer", id: externalCustomerId } },
      },
    },
  };

  const result = await unitRequest("/accounts", { method: "POST", body: payload });
  const acc = result.data;

  return {
    externalAccountId: acc.id,
    balanceCents: acc.attributes.balance,
    routingNumber: acc.attributes.routingNumber,
    accountNumber: acc.attributes.accountNumber,
  };
}

// Book payment = instant internal transfer between two Unit accounts (both must be Unit accounts).
// For sending money outside Unit entirely, use an achPayment instead:
// https://docs.unit.co/payments#create-ach-payment
async function transfer({ fromExternalAccountId, toExternalAccountId, amountCents, description }) {
  const payload = {
    data: {
      type: "bookPayment",
      attributes: { amount: amountCents, description: description || "Transfer" },
      relationships: {
        account: { data: { type: "depositAccount", id: fromExternalAccountId } },
        counterpartyAccount: { data: { type: "depositAccount", id: toExternalAccountId } },
      },
    },
  };

  const result = await unitRequest("/payments", { method: "POST", body: payload });
  return { id: result.data.id, status: result.data.attributes.status };
}

async function getAccount(externalAccountId) {
  const result = await unitRequest(`/accounts/${externalAccountId}`);
  return result.data;
}

module.exports = {
  mode: "unit_sandbox",
  createCustomer,
  createAccount,
  transfer,
  getAccount,
};￼Enter
