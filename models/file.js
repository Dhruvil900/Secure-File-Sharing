const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    filename: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number, required: true },
    mimetype: { type: String },
    downloadToken: { type: String, unique: true },
    tokenExpires: { type: Date },
    iv: { type: String }, // Make this optional if you're not using encryption
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", fileSchema);