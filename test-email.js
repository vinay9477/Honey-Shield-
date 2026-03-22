require('dotenv').config();
const nodemailer = require('nodemailer');

console.log("=== HoneyShield Email Debug ===");
console.log("EMAIL_USER:", process.env.EMAIL_USER || "❌ NOT SET");
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? `✅ Set (${process.env.EMAIL_PASS.length} chars)` : "❌ NOT SET");
console.log("EMAIL_SERVICE:", process.env.EMAIL_SERVICE || "gmail (default)");
console.log("");

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("❌ EMAIL_USER or EMAIL_PASS missing in .env file!");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

console.log("Verifying Gmail connection...");
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Connection FAILED:");
    console.error("Code:", error.code);
    console.error("Message:", error.message);
    if (error.code === 'EAUTH') {
      console.log("\n💡 Fix: Wrong Gmail/App Password.");
      console.log("   1. Go to myaccount.google.com → Security");
      console.log("   2. Search 'App passwords'");
      console.log("   3. Generate new one for HoneyShield");
      console.log("   4. Paste in .env without spaces");
    }
    if (error.code === 'ECONNECTION') {
      console.log("\n💡 Fix: Network/firewall blocking Gmail.");
    }
  } else {
    console.log("✅ Gmail connected! Sending test OTP email...");
    transporter.sendMail({
      from: `"HoneyShield" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "🔐 HoneyShield — Test OTP: 123456",
      html: `<div style="background:#060a14;padding:30px;font-family:monospace;color:#00e8ff;border-radius:10px;text-align:center;">
        <h2 style="color:#fff;">HoneyShield Test</h2>
        <p style="color:rgba(255,255,255,0.6);">Your test OTP is:</p>
        <div style="font-size:40px;font-weight:800;letter-spacing:12px;color:#00e8ff;">123456</div>
        <p style="color:rgba(255,255,255,0.4);font-size:12px;">Email is working correctly ✅</p>
      </div>`,
      text: "HoneyShield test OTP: 123456",
    }, (err, info) => {
      if (err) {
        console.error("❌ Send failed:", err.message);
      } else {
        console.log("✅ Test email sent! Check your inbox (and spam folder).");
        console.log("Message ID:", info.messageId);
      }
    });
  }
});