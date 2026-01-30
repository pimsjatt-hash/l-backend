const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Memory = require("../models/Memory");
const auth = require("../middleware/auth");

const router = express.Router();

/* ================= ENSURE UPLOAD DIRS ================= */
const photoDir = path.join(__dirname, "..", "uploads/photos");
const videoDir = path.join(__dirname, "..", "uploads/videos");

fs.mkdirSync(photoDir, { recursive: true });
fs.mkdirSync(videoDir, { recursive: true });

/* ================= MULTER STORAGE ================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith("video")) {
      cb(null, videoDir);
    } else {
      cb(null, photoDir);
    }
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "-" + Math.random() + path.extname(file.originalname)
    );
  }
});

const upload = multer({ storage });

/* ================= UPLOAD ================= */
router.post("/upload", auth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const isVideo = req.file.mimetype.startsWith("video");

    const memory = await Memory.create({
      type: isVideo ? "video" : "photo",
      fileUrl: `uploads/${isVideo ? "videos" : "photos"}/${req.file.filename}`,
      uploadedBy: req.user
    });

    res.json({ success: true, memory });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= SHAYARI ================= */
router.post("/shayari", auth, async (req, res) => {
  try {
    const memory = await Memory.create({
      type: "shayari",
      text: req.body.text,
      uploadedBy: req.user
    });

    res.json({ success: true, memory });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= GET ALL ================= */
router.get("/all", auth, async (req, res) => {
  const memories = await Memory.find().sort({ createdAt: -1 });
  res.json(memories);
});

/* ================= DELETE ================= */
router.delete("/delete/:id", auth, async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);
    if (!memory) {
      return res.status(404).json({ message: "Not found" });
    }

    // delete file if photo or video
    if (memory.type !== "shayari" && memory.fileUrl) {
      const filePath = path.join(__dirname, "..", memory.fileUrl);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await memory.deleteOne();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
