require("dotenv").config();
const express = require("express");
const cors = require("cors");

require("./db"); // ensures schema is created on boot

const authRoutes = require("./routes/auth");
const accountsRoutes = require("./routes/accounts");
const transfersRoutes = require("./routes/transfers");
const ledger = require("./services/ledgerService");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", bankingMode: ledger.mode });
});

app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountsRoutes);
app.use("/api/transfers", transfersRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Ledgerline API running on http://localhost:${PORT}  (mode: ${ledger.mode})`);
});
