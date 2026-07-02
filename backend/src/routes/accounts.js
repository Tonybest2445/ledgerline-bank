const express = require("express");
const { requireAuth } = require("../middleware/auth");
const ledger = require("../services/ledgerService");

const router = express.Router();
router.use(requireAuth);

const VALID_TYPES = ["checking", "savings", "business_checking", "business_savings"];

router.get("/", (req, res) => {
  const accounts = ledger.listAccountsForUser(req.userId);
  res.json({ accounts, bankingMode: ledger.mode });
});

router.post("/", async (req, res) => {
  try {
    const { type, name } = req.body;
    if (!VALID_TYPES.includes(type)) {
      return res.status(400).json({ error: `type must be one of ${VALID_TYPES.join(", ")}` });
    }
    const account = await ledger.openAccount({
      userId: req.userId,
      type,
      name: name || type,
    });
    res.status(201).json({ account });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/:id/transactions", (req, res) => {
  const account = ledger.getAccountById(req.params.id);
  if (!account || account.user_id !== req.userId) {
    return res.status(404).json({ error: "Account not found" });
  }
  res.json({ transactions: ledger.listTransactions(req.params.id) });
});

// Simulated-mode only: fund a new account so there's something to demo with.
router.post("/:id/seed-deposit", async (req, res) => {
  try {
    const account = ledger.getAccountById(req.params.id);
    if (!account || account.user_id !== req.userId) {
      return res.status(404).json({ error: "Account not found" });
    }
    const { amountCents } = req.body;
    const result = await ledger.seedDeposit({
      accountId: req.params.id,
      amountCents: Number(amountCents),
      description: "Initial funding deposit",
    });
    res.json({ result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
