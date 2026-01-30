const mongoose = require("mongoose");

const memorySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["photo", "video", "shayari"],
    required: true
  },
  text: {
    type: String,
    trim: true
  },
  fileUrl: {
    type: String,
    trim: true
  },
  uploadedBy: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

memorySchema.index({ createdAt: -1 });

module.exports = mongoose.model("Memory", memorySchema);
