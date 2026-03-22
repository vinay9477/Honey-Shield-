const express = require("express");
const router = express.Router();
const Log = require("../models/Log");
const User = require("../models/User");
const mongoose = require("mongoose");
const { sendAttackAlert } = require("../utils/mailer");

// Attack types that trigger email alerts
const ALERT_TYPES = [
  "BRUTE_FORCE", "SQL_INJECTION", "XSS_ATTACK", "DDOS_ATTACK",
  "CSRF_TEST", "KEYLOGGER", "FILE_UPLOAD", "INVALID_FILE_TYPE",
  "PATH_TRAVERSAL", "RATE_LIMIT", "HONEYPOT", "BOT_DETECTED"
];

// ADD LOG — triggers email alert if attack type matches
router.post("/", async (req, res) => {
  try {
    const { userId, ip, type, message } = req.body;
    const log = new Log({ userId, ip, type, message });
    await log.save();

    // Send email alert if this is a known attack type
    if (ALERT_TYPES.includes(type) && userId) {
      try {
        const user = await User.findById(userId);
        if (user && user.email) {
          // Fire and forget — don't block the response
          sendAttackAlert({
            toEmail: user.email,
            userName: user.name,
            attackType: type,
            ip,
            message,
            timestamp: log.createdAt,
          }).catch(err => console.error("[HoneyShield] Email error:", err));
        }
      } catch (emailErr) {
        console.error("[HoneyShield] Failed to fetch user for alert:", emailErr);
      }
    }

    res.json({ message: "Log stored" });
  } catch (error) {
    console.error("Error saving log:", error);
    res.status(500).json({ error: "Failed to save log" });
  }
});

// VIEW LOGS — filter by userId query param
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    let query = {};
    if (userId) {
      if (mongoose.Types.ObjectId.isValid(userId)) {
        query = { userId: new mongoose.Types.ObjectId(userId) };
      } else {
        return res.json([]);
      }
    }
    const logs = await Log.find(query).sort({ createdAt: -1 }).limit(500);
    res.json(logs);
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

// VIEW LOGS BY USERID (route param)
router.get("/:userId", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.json([]);
    }
    const logs = await Log.find({
      userId: new mongoose.Types.ObjectId(req.params.userId),
    }).sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    console.error("Error fetching user logs:", error);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

module.exports = router;