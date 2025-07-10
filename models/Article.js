const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Article title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters long"],
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    content: {
      type: String,
      required: [true, "Article content is required"],
      minlength: [10, "Content must be at least 10 characters long"],
    },
    author: {
      type: String,
      required: [true, "Author name is required"],
      trim: true,
      minlength: [2, "Author name must be at least 2 characters long"],
      maxlength: [50, "Author name cannot exceed 50 characters"],
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
        maxlength: [30, "Tag cannot exceed 30 characters"],
      },
    ],
    views: {
      type: Number,
      default: 0,
      min: [0, "Views cannot be negative"],
    },
    category: {
      type: String,
      trim: true,
      enum: {
        values: [
          "Technology",
          "Science",
          "Programming",
          "Design",
          "Business",
          "General",
        ],
        message: "Category must be one of the predefined values",
      },
      default: "General",
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Virtual for article summary
articleSchema.virtual("summary").get(function () {
  if (this.content.length <= 100) return this.content;
  return this.content.substring(0, 100) + "...";
});

// Virtual for reading time estimation (words per minute = 200)
articleSchema.virtual("readingTime").get(function () {
  const wordCount = this.content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / 200);
  return `${minutes} min read`;
});

// Virtual for formatted date
articleSchema.virtual("formattedDate").get(function () {
  return this.date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

// Pre-save middleware
articleSchema.pre("save", function (next) {
  // Ensure tags are unique and trimmed
  if (this.tags && this.tags.length > 0) {
    this.tags = [
      ...new Set(
        this.tags.map((tag) => tag.trim()).filter((tag) => tag.length > 0),
      ),
    ];
  }
  next();
});

// Instance methods
articleSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

articleSchema.methods.getPublicData = function () {
  return {
    _id: this._id,
    title: this.title,
    content: this.content,
    author: this.author,
    date: this.date,
    published: this.published,
    tags: this.tags,
    views: this.views,
    category: this.category,
    featured: this.featured,
    summary: this.summary,
    readingTime: this.readingTime,
    formattedDate: this.formattedDate,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

articleSchema.statics.search = function (searchTerm) {
  return this.find({
    $or: [
      { title: new RegExp(searchTerm, "i") },
      { content: new RegExp(searchTerm, "i") },
      { author: new RegExp(searchTerm, "i") },
      { tags: { $in: [new RegExp(searchTerm, "i")] } },
    ],
    published: true,
  });
};

// Indexes for performance
articleSchema.index({ title: 1, author: 1, date: -1 }); // For searching articles by title and author, sorted by date
articleSchema.index({ published: 1 }); // For filtering by published status
articleSchema.index({ author: 1 }); // For filtering by author
articleSchema.index({ createdAt: -1 }); // For sorting by creation date
articleSchema.index({ tags: 1 }); // For filtering by tags
articleSchema.index({ views: -1 }); // For sorting by popularity
articleSchema.index({ published: 1, createdAt: -1 }); // Common query: get recent published articles
articleSchema.index({ author: 1, published: 1 }); // Common query: get published articles by author
articleSchema.index({ category: 1 }); // For filtering by category
articleSchema.index({ featured: 1, published: 1 }); // For finding featured articles
articleSchema.index({ title: "text", content: "text" }); // Text search index

module.exports = mongoose.model("Article", articleSchema);
