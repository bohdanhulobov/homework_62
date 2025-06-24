const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    published: {
      type: Boolean,
      default: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

articleSchema.index({ title: 1, author: 1, date: -1 }); // For searching articles by title and author, sorted by date
articleSchema.index({ published: 1 }); // For filtering by published status
articleSchema.index({ author: 1 }); // For filtering by author
articleSchema.index({ createdAt: -1 }); // For sorting by creation date
articleSchema.index({ tags: 1 }); // For filtering by tags
articleSchema.index({ views: -1 }); // For sorting by popularity
articleSchema.index({ published: 1, createdAt: -1 }); // Common query: get recent published articles
articleSchema.index({ author: 1, published: 1 }); // Common query: get published articles by author

module.exports = mongoose.model("Article", articleSchema);
