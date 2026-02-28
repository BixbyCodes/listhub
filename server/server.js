const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const listingRoutes = require("./routes/listings");
const rateLimit = require("express-rate-limit");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use((_req, res) => res.status(404).json({ message: "Route not found" }));
app.use((err, _req, res, _next) => res.status(err.status || 500).json({ message: err.message || "Server error" }));

const PORT = process.env.PORT || 5001;
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/listhub")
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => { console.error("❌ MongoDB error:", err.message); process.exit(1); });
