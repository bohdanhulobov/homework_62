const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [1, "Age must be at least 1"],
      max: [120, "Age cannot exceed 120"],
    },
    role: {
      type: String,
      default: "User",
      trim: true,
      enum: {
        values: [
          "User",
          "Admin",
          "Developer",
          "Designer",
          "Tester",
          "Project Manager",
          "DevOps",
          "Analyst",
          "Writer",
          "Manager",
          "Consultant",
        ],
        message: "Role must be one of the predefined values",
      },
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  },
);

// Virtual for full user info
userSchema.virtual("fullInfo").get(function () {
  return `${this.name} (${this.email}) - ${this.role}`;
});

// Virtual for age group
userSchema.virtual("ageGroup").get(function () {
  if (this.age < 18) return "Minor";
  if (this.age < 30) return "Young Adult";
  if (this.age < 50) return "Adult";
  return "Senior";
});

// Pre-save middleware
userSchema.pre("save", function (next) {
  if (this.isModified("email")) {
    this.email = this.email.toLowerCase();
  }
  next();
});

// Instance methods
userSchema.methods.getPublicProfile = function () {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    age: this.age,
    createdAt: this.createdAt,
    ageGroup: this.ageGroup,
  };
};

userSchema.index({ email: 1 }, { unique: true }); // Ensure email is unique
userSchema.index({ name: 1 }); // For searching by name
userSchema.index({ role: 1 }); // For filtering by role
userSchema.index({ age: 1 }); // For filtering and sorting by age
userSchema.index({ createdAt: -1 }); // For sorting by creation date (descending)
userSchema.index({ email: 1, role: 1 }); // Compound index for email + role queries

module.exports = mongoose.model("User", userSchema);
