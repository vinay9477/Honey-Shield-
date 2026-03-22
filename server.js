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

app.get("/", (req, res) => {
  res.send("🛡️ HoneyShield API Running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});