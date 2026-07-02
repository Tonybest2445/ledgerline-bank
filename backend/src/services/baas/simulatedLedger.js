// Option A: fully simulated banking engine.
// No external calls. Balances and transfers live entirely in our own SQLite ledger.
// This is safe to run immediately and is a legitimate way to prototype/demo a product,
// but it does NOT move real money and accounts are not FDIC insured.

const { randomUUID } = require("crypto");
const db = require("../../db");

async function createCustomer({ userId }) {
  // No external customer object needed in simulated mode.
  return { externalCustomerId: null };
}

async function createAccount({ userId, type, name }) {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO accounts (id, user_id, type, name, balance_cents, external_account_id)
     VALUES (?, ?, ?, ?, 0, NULL)`
  ).run(id, userId, type, name);

  return getAccountById(id);
}

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

// Simulated deposit — e.g. an initial funding deposit when an account is opened.
async function deposit({ accountId, amountCents, description }) {
  const id = randomUUID();
  const tx = db.transaction(() => {
    db.prepare(`UPDATE accounts SET balance_cents = balance_cents + ? WHERE id = ?`).run(
      amountCents,
      accountId
    );
    db.prepare(
      `INSERT INTO transactions (id, account_id, direction, type, amount_cents, description)
       VALUES (?, ?, 'credit', 'deposit', ?, ?)`
    ).run(id, accountId, amountCents, description || "Deposit");
  });
  tx();
  return { id, status: "completed" };
}

// Simulated internal transfer between two accounts in our own ledger.
async function transfer({ fromAccountId, toAccountId, amountCents, description }) {
  if (amountCents <= 0) throw new Error("Amount must be positive");

  const from = getAccountById(fromAccountId);
  if (!from) throw new Error("Source account not found");
  if (from.balance_cents < amountCents) throw new Error("Insufficient funds");

  const to = getAccountById(toAccountId);
  if (!to) throw new Error("Destination account not found");

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
      `INSERT INTO transactions (id, account_id, counterparty_account_id, direction, type, amount_cents, description)
       VALUES (?, ?, ?, 'debit', 'transfer', ?, ?)`
    ).run(debitId, fromAccountId, toAccountId, amountCents, description || "Transfer");
    db.prepare(
      `INSERT INTO transactions (id, account_id, counterparty_account_id, direction, type, amount_cents, description)
       VALUES (?, ?, ?, 'credit', 'transfer', ?, ?)`
    ).run(creditId, toAccountId, fromAccountId, amountCents, description || "Transfer");
  });
  tx();

  return { id: debitId, status: "completed" };
}

module.exports = {
  mode: "simulated",
  createCustomer,
  createAccount,
  getAccountById,
  listAccountsForUser,
  listTransactions,
  deposit,
  transfer,
};
