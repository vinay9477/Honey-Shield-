const express = require("express");
const router = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer");

// ── EMAIL TRANSPORTER ────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendOtpEmail(toEmail, userName, otp) {
  const subject = "🔐 HoneyShield — Your Password Reset Code";
  const html = `
  <!DOCTYPE html><html><head><meta charset="UTF-8"></head>
  <body style="margin:0;padding:0;background:#060a14;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#060a14;padding:32px 16px;">
  <tr><td align="center">
  <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
    <tr><td style="background:linear-gradient(135deg,#0d1b2e,#0a1525);border:1px solid rgba(0,232,255,0.15);border-radius:12px 12px 0 0;padding:28px 32px;text-align:center;border-bottom:2px solid #00e8ff;">
      <div style="font-size:32px;margin-bottom:8px;">🔐</div>
      <div style="font-family:monospace;font-size:11px;letter-spacing:4px;color:#00e8ff;text-transform:uppercase;margin-bottom:6px;">Password Reset</div>
      <div style="font-size:24px;font-weight:800;color:#ffffff;">HoneyShield</div>
    </td></tr>
    <tr><td style="background:#0d1525;border-left:1px solid rgba(0,232,255,0.1);border-right:1px solid rgba(0,232,255,0.1);padding:28px 32px;">
      <p style="color:rgba(220,235,255,0.8);font-size:14px;line-height:1.7;margin:0 0 24px;">
        Hi <strong style="color:#ffffff;">${userName || "Operator"}</strong>,<br><br>
        We received a request to reset your HoneyShield password. Use the code below — it expires in <strong style="color:#f5a623;">10 minutes</strong>.
      </p>
      <div style="background:#080f1e;border:1px solid rgba(0,232,255,0.2);border-radius:10px;padding:24px;text-align:center;margin-bottom:24px;">
        <div style="font-family:monospace;font-size:11px;letter-spacing:3px;color:rgba(0,232,255,0.5);margin-bottom:10px;text-transform:uppercase;">Your Reset Code</div>
        <div style="font-family:monospace;font-size:42px;font-weight:800;color:#00e8ff;letter-spacing:12px;">${otp}</div>
      </div>
      <p style="color:rgba(220,235,255,0.45);font-size:12px;line-height:1.7;margin:0;">
        If you did not request a password reset, ignore this email. Your password will remain unchanged.
      </p>
    </td></tr>
    <tr><td style="background:#080f1e;border:1px solid rgba(0,232,255,0.1);border-top:none;border-radius:0 0 12px 12px;padding:18px 32px;text-align:center;">
      <p style="font-family:monospace;font-size:10px;letter-spacing:2px;color:rgba(255,255,255,0.2);margin:0;">
        // HONEYSHIELD v2.0 — ALL CONNECTIONS MONITORED<br>
        <span style="color:rgba(255,255,255,0.12);">Automated email. Do not reply.</span>
      </p>
    </td></tr>
  </table>
  </td></tr></table>
  </body></html>`;

  await transporter.sendMail({
    from: `"HoneyShield" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject,
    html,
    text: `Your HoneyShield password reset code is: ${otp}\n\nExpires in 10 minutes. If you didn't request this, ignore this email.`,
  });
}

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    if (user.password !== password) return res.status(401).json({ message: "Invalid credentials" });
    res.json({
      message: "Login successful",
      user: { _id: user._id, email: user.email, organization: user.organization, service: user.service || "" }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, organization, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "All fields are required" });
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: "Email already registered" });
    const user = new User({ name, email, organization, password });
    await user.save();
    res.status(201).json({
      message: "Registration successful",
      user: { _id: user._id, email: user.email, organization: user.organization }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// CHANGE PASSWORD
router.post("/change-password", async (req, res) => {
  try {
    const { email, currentPassword, newPassword, userId } = req.body;
    if (!email || !currentPassword || !newPassword) return res.status(400).json({ message: "All fields are required" });
    const user = await User.findOne({ $or: [{ email }, { _id: userId }] });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.password !== currentPassword) return res.status(401).json({ message: "Current password is incorrect" });
    if (newPassword === currentPassword) return res.status(400).json({ message: "New password must be different from current password" });
    user.password = newPassword;
    await user.save();
    res.json({ message: "Password changed successfully", success: true });
  } catch (err) {
    console.error("Password change error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ── FORGOT PASSWORD ──────────────────────────────────────────
const otpStore = new Map();

// Step 1: Request OTP — sends to email
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "No account found with that email" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    otpStore.set(email, { otp, expiresAt, verified: false });

    // Send OTP via email
    try {
      await sendOtpEmail(email, user.name, otp);
      console.log(`[HoneyShield] Reset OTP sent to ${email}`);
      res.json({ message: "Reset code sent to your email" }); // OTP NOT returned in response
    } catch (emailErr) {
      console.error("[HoneyShield] Failed to send OTP email:", emailErr.message);
      // Fallback: return OTP in response if email fails
      res.json({ message: "Reset code sent", otp });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Step 2: Verify OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });
    const record = otpStore.get(email);
    if (!record) return res.status(400).json({ message: "No reset code requested for this email" });
    if (Date.now() > record.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ message: "Reset code has expired — request a new one" });
    }
    if (record.otp !== otp.trim()) return res.status(400).json({ message: "Incorrect reset code" });
    record.verified = true;
    res.json({ message: "OTP verified" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Step 3: Set new password
router.post("/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) return res.status(400).json({ message: "Email and new password are required" });
    if (newPassword.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });
    const record = otpStore.get(email);
    if (!record || !record.verified) return res.status(400).json({ message: "OTP not verified — complete verification first" });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    user.password = newPassword;
    await user.save();
    otpStore.delete(email);
    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;