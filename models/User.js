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

userSchema.index({ email: 1 }, { unique: true }); // Ensure email is unique
userSchema.index({ name: 1 }); // For searching by name
userSchema.index({ role: 1 }); // For filtering by role
userSchema.index({ age: 1 }); // For filtering and sorting by age
userSchema.index({ createdAt: -1 }); // For sorting by creation date (descending)
userSchema.index({ email: 1, role: 1 }); // Compound index for email + role queries

module.exports = mongoose.model("User", userSchema);
