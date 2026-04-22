const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const SEVERITY = {
  BRUTE_FORCE:      { level: "CRITICAL", color: "#ff3355", icon: "!!" },
  SQL_INJECTION:    { level: "CRITICAL", color: "#ff3355", icon: "!!" },
  XSS_ATTACK:       { level: "HIGH",     color: "#f97316", icon: "!" },
  DDOS_ATTACK:      { level: "CRITICAL", color: "#ff3355", icon: "!!" },
  CSRF_TEST:        { level: "HIGH",     color: "#f97316", icon: "!" },
  KEYLOGGER:        { level: "HIGH",     color: "#f97316", icon: "!" },
  FILE_UPLOAD:      { level: "MEDIUM",   color: "#f5a623", icon: "*" },
  INVALID_FILE_TYPE:{ level: "MEDIUM",   color: "#f5a623", icon: "*" },
  PATH_TRAVERSAL:   { level: "HIGH",     color: "#f97316", icon: "!" },
  RATE_LIMIT:       { level: "MEDIUM",   color: "#f5a623", icon: "*" },
  HONEYPOT:         { level: "HIGH",     color: "#f97316", icon: "!" },
  BOT_DETECTED:     { level: "MEDIUM",   color: "#f5a623", icon: "*" },
};

async function sendAttackAlert({ toEmail, userName, attackType, ip, message, timestamp }) {
  const sev = SEVERITY[attackType] || { level: "INFO", color: "#00e8ff", icon: "i" };
  const time = timestamp ? new Date(timestamp).toUTCString() : new Date().toUTCString();
  const subject = `[HoneyShield] ${sev.level} - ${attackType.replace(/_/g, " ")} Detected`;

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
  <body style="margin:0;padding:0;background:#060a14;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#060a14;padding:32px 16px;">
  <tr><td align="center">
  <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
    <tr><td style="background:linear-gradient(135deg,#0d1b2e,#0a1525);border:1px solid rgba(0,232,255,0.15);border-radius:12px 12px 0 0;padding:28px 32px;text-align:center;border-bottom:2px solid ${sev.color};">
      <div style="font-family:monospace;font-size:11px;letter-spacing:4px;color:${sev.color};text-transform:uppercase;margin-bottom:6px;">Security Alert</div>
      <div style="font-size:26px;font-weight:800;color:#ffffff;">HoneyShield</div>
      <div style="font-size:11px;color:rgba(255,255,255,0.35);margin-top:4px;font-family:monospace;letter-spacing:2px;">DECEPTION-DRIVEN CYBERSECURITY</div>
    </td></tr>
    <tr><td style="background:#0d1525;border-left:1px solid rgba(0,232,255,0.1);border-right:1px solid rgba(0,232,255,0.1);padding:20px 32px 0;">
      <div style="background:${sev.color}18;border:1px solid ${sev.color}44;border-radius:8px;padding:14px 20px;text-align:center;">
        <span style="font-family:monospace;font-size:11px;letter-spacing:2px;color:${sev.color};font-weight:700;">${sev.level} - ${attackType.replace(/_/g, " ")}</span>
      </div>
    </td></tr>
    <tr><td style="background:#0d1525;border-left:1px solid rgba(0,232,255,0.1);border-right:1px solid rgba(0,232,255,0.1);padding:24px 32px;">
      <p style="color:rgba(220,235,255,0.8);font-size:14px;line-height:1.7;margin:0 0 24px;">
        Hi <strong style="color:#ffffff;">${userName || "Operator"}</strong>,<br><br>
        Your HoneyShield system detected a <strong style="color:${sev.color};">${attackType.replace(/_/g, " ")}</strong> attack. Review the details below immediately.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#080f1e;border:1px solid rgba(0,232,255,0.1);border-radius:8px;overflow:hidden;">
        <tr style="border-bottom:1px solid rgba(0,232,255,0.08);"><td style="padding:12px 18px;font-family:monospace;font-size:10px;letter-spacing:2px;color:rgba(220,235,255,0.4);text-transform:uppercase;width:35%;">Attack Type</td><td style="padding:12px 18px;font-size:13px;color:${sev.color};font-weight:600;">${attackType.replace(/_/g, " ")}</td></tr>
        <tr style="border-bottom:1px solid rgba(0,232,255,0.08);"><td style="padding:12px 18px;font-family:monospace;font-size:10px;letter-spacing:2px;color:rgba(220,235,255,0.4);text-transform:uppercase;">Severity</td><td style="padding:12px 18px;font-size:13px;color:${sev.color};font-weight:600;">${sev.level}</td></tr>
        <tr style="border-bottom:1px solid rgba(0,232,255,0.08);"><td style="padding:12px 18px;font-family:monospace;font-size:10px;letter-spacing:2px;color:rgba(220,235,255,0.4);text-transform:uppercase;">Source IP</td><td style="padding:12px 18px;font-family:monospace;font-size:13px;color:#f5a623;">${ip || "Unknown"}</td></tr>
        <tr style="border-bottom:1px solid rgba(0,232,255,0.08);"><td style="padding:12px 18px;font-family:monospace;font-size:10px;letter-spacing:2px;color:rgba(220,235,255,0.4);text-transform:uppercase;">Timestamp</td><td style="padding:12px 18px;font-family:monospace;font-size:12px;color:rgba(220,235,255,0.7);">${time}</td></tr>
        <tr><td style="padding:12px 18px;font-family:monospace;font-size:10px;letter-spacing:2px;color:rgba(220,235,255,0.4);text-transform:uppercase;vertical-align:top;">Details</td><td style="padding:12px 18px;font-size:13px;color:rgba(220,235,255,0.8);line-height:1.6;">${message || "No additional details."}</td></tr>
      </table>
    </td></tr>
    <tr><td style="background:#080f1e;border:1px solid rgba(0,232,255,0.1);border-top:none;border-radius:0 0 12px 12px;padding:20px 32px;text-align:center;">
      <p style="font-family:monospace;font-size:10px;letter-spacing:2px;color:rgba(255,255,255,0.2);margin:0;">
        HONEYSHIELD v2.0<br>
        <span style="color:rgba(255,255,255,0.12);">Automated security alert. Do not reply.</span>
      </p>
    </td></tr>
  </table>
  </td></tr></table>
  </body></html>`;

  const text = `HoneyShield Alert\nAttack: ${attackType} | Severity: ${sev.level}\nIP: ${ip || "Unknown"} | Time: ${time}\nDetails: ${message || "N/A"}`;

  await transporter.sendMail({
    from: `"HoneyShield" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject,
    html,
    text,
  });

  console.log(`[HoneyShield] Alert sent to ${toEmail} - ${attackType}`);
}

module.exports = { sendAttackAlert };