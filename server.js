require('dotenv').config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const authRoutes  = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const logRoutes   = require("./routes/log.routes");
const decoyRoutes = require("./routes/decoy.routes");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

connectDB();

app.use("/api/auth",  authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/logs",  logRoutes);
app.use("/api/decoy", decoyRoutes);

app.get("/api/test-email", async (req, res) => {
  try {
    const { sendAttackAlert } = require("./utils/mailer");
    await sendAttackAlert({
      toEmail: process.env.EMAIL_USER,
      userName: "HoneyShield Admin",
      attackType: "SYSTEM_TEST",
      ip: req.ip || "127.0.0.1",
      message: "This is a diagnostic test to verify your SMTP email configuration is working on the live server.",
    });
    res.json({ success: true, message: `Test email successfully sent to ${process.env.EMAIL_USER}` });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Email sending failed", 
      error: error.message,
      hint: "Check if your EMAIL_USER and EMAIL_PASS are correct, or if your App Password was revoked."
    });
  }
});

app.get("/", (req, res) => {
  res.send("HoneyShield API Running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});