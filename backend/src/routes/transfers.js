const express = require("express");
const { requireAuth } = require("../middleware/auth");
const ledger = require("../services/ledgerService");

const router = express.Router();
router.use(requireAuth);

router.post("/", async (req, res) => {
  try {
    const { fromAccountId, toAccountId, amountCents, description } = req.body;

    const from = ledger.getAccountById(fromAccountId);
    if (!from || from.user_id !== req.userId) {
      return res.status(403).json({ error: "You don't own the source account" });
    }

    const result = await ledger.transferMoney({
      fromAccountId,
      toAccountId,
      amountCents: Number(amountCents),
      description,
    });

    res.status(201).json({ transfer: result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
