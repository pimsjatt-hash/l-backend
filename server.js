const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

/* ================= CORS (RENDER + LOCAL) ================= */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://neewton.onrender.com" // ✅ frontend URL
    ],
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "name", "code"]
  })
);

/* ✅ THIS HANDLES PREFLIGHT SAFELY */
app.use(cors());

/* ================= MIDDLEWARE ================= */
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ================= DATABASE ================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ❤️"))
  .catch(err => console.error("MongoDB error:", err));

/* ================= ROUTES ================= */
app.use("/api", require("./routes/uploadRoutes"));

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
