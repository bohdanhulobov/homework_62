const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
      min: 1,
      max: 120,
    },
    role: {
      type: String,
      default: "User",
      trim: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  },
);

// Create unique index for email
userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model("User", userSchema);
