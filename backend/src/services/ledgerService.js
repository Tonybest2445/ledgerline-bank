// Unified service used by routes. Our SQLite DB is always the system of record
// for what the app displays. When BANKING_MODE=unit_sandbox, we additionally call
// Unit's real sandbox API and store the returned external IDs alongside our rows.
// When BANKING_MODE=simulated, everything stays local.

const { randomUUID } = require("crypto");
const db = require("../db");
const simulated = require("./baas/simulatedLedger");
const unit = require("./baas/unitAdapter");

const MODE = process.env.BANKING_MODE === "unit_sandbox" ? "unit_sandbox" : "simulated";

function getAccountById(id) {
  return db.prepare(`SELECT * FROM accounts WHERE id = ?`).get(id);
}

function listAccountsForUser(userId) {
  return db.prepare(`SELECT * FROM accounts WHERE user_id = ? ORDER BY created_at`).all(userId);
}

function listTransactions(accountId) {
  return db
    .prepare(`SELECT * FROM transactions WHERE account_id = ? ORDER BY created_at DESC`)
    .all(accountId);
}

// Called once at signup. In unit_sandbox mode this files a real (sandbox) KYC application.
async function onboardCustomer({ userId, fullName, email }) {
  if (MODE === "unit_sandbox") {
    const { externalCustomerId, status } = await unit.createCustomer({ fullName, email });
    db.prepare(`UPDATE users SET external_customer_id = ? WHERE id = ?`).run(
      externalCustomerId,
      userId
    );
    return { status };
  }
  return { status: "Approved" };
}

async function openAccount({ userId, type, name }) {
  const id = randomUUID();
  let externalAccountId = null;
  let seedBalanceCents = 0;

  if (MODE === "unit_sandbox") {
    const user = db.prepare(`SELECT * FROM users WHERE id = ?`).get(userId);
    if (!user.external_customer_id) {
      throw new Error(
        "This user's Unit application isn't approved yet, so no live account can be opened"
      );
    }
    const acc = await unit.createAccount({
      externalCustomerId: user.external_customer_id,
      type,
      name,
    });
    externalAccountId = acc.externalAccountId;
    seedBalanceCents = acc.balanceCents || 0;
  }

  db.prepare(
    `INSERT INTO accounts (id, user_id, type, name, balance_cents, external_account_id)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(id, userId, type, name, seedBalanceCents, externalAccountId);

  return getAccountById(id);
}

async function transferMoney({ fromAccountId, toAccountId, amountCents, description }) {
  if (amountCents <= 0) throw new Error("Amount must be positive");

  const from = getAccountById(fromAccountId);
  const to = getAccountById(toAccountId);
  if (!from) throw new Error("Source account not found");
  if (!to) throw new Error("Destination account not found");
  if (from.balance_cents < amountCents) throw new Error("Insufficient funds");

  let externalTxId = null;

  if (MODE === "unit_sandbox") {
    if (!from.external_account_id || !to.external_account_id) {
      throw new Error("Both accounts must be live Unit sandbox accounts to transfer in this mode");
    }
    const result = await unit.transfer({
      fromExternalAccountId: from.external_account_id,
      toExternalAccountId: to.external_account_id,
      amountCents,
      description,
    });
    externalTxId = result.id;
  }

  const debitId = randomUUID();
  const creditId = randomUUID();

  const tx = db.transaction(() => {
    db.prepare(`UPDATE accounts SET balance_cents = balance_cents - ? WHERE id = ?`).run(
      amountCents,
      fromAccountId
    );
    db.prepare(`UPDATE accounts SET balance_cents = balance_cents + ? WHERE id = ?`).run(
      amountCents,
      toAccountId
    );
    db.prepare(
      `INSERT INTO transactions (id, account_id, counterparty_account_id, direction, type, amount_cents, description, external_transaction_id)
       VALUES (?, ?, ?, 'debit', 'transfer', ?, ?, ?)`
    ).run(debitId, fromAccountId, toAccountId, amountCents, description || "Transfer", externalTxId);
    db.prepare(
      `INSERT INTO transactions (id, account_id, counterparty_account_id, direction, type, amount_cents, description, external_transaction_id)
       VALUES (?, ?, ?, 'credit', 'transfer', ?, ?, ?)`
    ).run(creditId, toAccountId, fromAccountId, amountCents, description || "Transfer", externalTxId);
  });
  tx();

  return { id: debitId, status: "completed", externalTxId };
}

// Fund an account. In simulated mode this just credits the local ledger.
// In unit_sandbox mode this uses Unit's official sandbox tool to simulate a
// real incoming ACH deposit, then mirrors that credit into our local ledger too.
async function seedDeposit({ accountId, amountCents, description }) {
  const account = getAccountById(accountId);
  if (!account) throw new Error("Account not found");

  if (MODE === "unit_sandbox") {
    if (!account.external_account_id) {
      throw new Error("This account isn't a live Unit sandbox account yet");
    }
    await unit.simulateDeposit({
      externalAccountId: account.external_account_id,
      amountCents,
      description,
    });
  }

  return simulated.deposit({ accountId, amountCents, description });
}

module.exports = {
  mode: MODE,
  onboardCustomer,
  openAccount,
  transferMoney,
  seedDeposit,
  getAccountById,
  listAccountsForUser,
  listTransactions,
};
