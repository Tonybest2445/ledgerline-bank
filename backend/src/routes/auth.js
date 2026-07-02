const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomUUID } = require("crypto");
const db = require("../db");
const ledger = require("../services/ledgerService");

const router = express.Router();

function issueToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

router.post("/signup", async (req, res) => {
  try {
    const { email, password, fullName } = req.body;
    if (!email || !password || !fullName) {
      return res.status(400).json({ error: "email, password, and fullName are required" });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    const existing = db.prepare(`SELECT id FROM users WHERE email = ?`).get(email.toLowerCase());
    if (existing) {
      return res.status(409).json({ error: "An account with that email already exists" });
    }

    const id = randomUUID();
    const passwordHash = await bcrypt.hash(password, 10);

    db.prepare(
      `INSERT INTO users (id, email, password_hash, full_name) VALUES (?, ?, ?, ?)`
    ).run(id, email.toLowerCase(), passwordHash, fullName);

    const onboarding = await ledger.onboardCustomer({ userId: id, fullName, email });

    res.status(201).json({
      token: issueToken(id),
      user: { id, email: email.toLowerCase(), fullName },
      onboardingStatus: onboarding.status,
      bankingMode: ledger.mode,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const user = db.prepare(`SELECT * FROM users WHERE email = ?`).get(email.toLowerCase());
    if (!user) return res.status(401).json({ error: "Invalid email or password" });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: "Invalid email or password" });

    res.json({
      token: issueToken(user.id),
      user: { id: user.id, email: user.email, fullName: user.full_name },
      bankingMode: ledger.mode,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
