require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// MongoDB connection and models
const connectDB = require("./config/database");
const initializeData = require("./config/initData");
const User = require("./models/User");
const Article = require("./models/Article");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB Atlas
connectDB().then(() => {
  // Initialize data after successful connection
  initializeData();
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }),
);

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

// Passport Local Strategy - Updated for MongoDB
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user || user.password !== password) {
          return done(null, false, { message: "Invalid credentials" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session - Updated for MongoDB
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Set EJS as template engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Static files middleware
app.use(express.static(path.join(__dirname, "public")));

// Middleware to get theme from cookies
const getTheme = (req, res, next) => {
  req.theme = req.cookies.theme || "light";
  next();
};

// Middleware to protect routes (require authentication)
const requireAuth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login?redirect=true");
  }
  next();
};

// Apply middleware to all routes
app.use(getTheme);

// Routes
app.get("/", (req, res) => {
  res.render("index", {
    title: "Home Page",
    user: req.user,
    theme: req.theme,
  });
});

// Authentication routes
app.get("/login", (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }

  // Check if user was redirected from a protected route
  const message = req.query.redirect
    ? "Please log in to access this page"
    : null;

  res.render("login", {
    title: "Login",
    user: req.user,
    theme: req.theme,
    message: message,
  });
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: false,
  }),
);

app.get("/register", (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  res.render("register", {
    title: "Register",
    user: req.user,
    theme: req.theme,
  });
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, password, age } = req.body;

    // Create new user
    const newUser = new User({
      name,
      email,
      password,
      age: parseInt(age),
      role: "User",
    });

    await newUser.save();

    // Automatically log in the new user
    req.login(newUser, (err) => {
      if (err) {
        return res.status(500).render("register", {
          title: "Register",
          error: "Registration successful but login failed",
          user: req.user,
          theme: req.theme,
        });
      }
      res.redirect("/");
    });
  } catch (error) {
    console.error("Registration error:", error);

    let errorMessage = "Registration failed. Please try again.";

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      errorMessage = errors.join(", ");
    } else if (error.code === 11000) {
      errorMessage = "User with this email already exists";
    }

    res.status(400).render("register", {
      title: "Register",
      error: errorMessage,
      user: req.user,
      theme: req.theme,
    });
  }
});

app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// Theme setting route
app.post("/set-theme", (req, res) => {
  const { theme } = req.body;

  if (theme === "light" || theme === "dark") {
    res.cookie("theme", theme, {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
  }

  res.redirect(req.get("Referer") || "/");
});

// Protected route as required by the task
app.get("/protected", requireAuth, (req, res) => {
  res.render("protected", {
    title: "Protected Page",
    user: req.user,
    theme: req.theme,
  });
});

// Users routes (protected - require authentication) - Updated for MongoDB
app.get("/users", requireAuth, async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.render("users/index", {
      title: "Users List",
      users: users,
      user: req.user,
      theme: req.theme,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).render("error", {
      title: "Error",
      message: "Failed to load users",
      user: req.user,
      theme: req.theme,
    });
  }
});

app.get("/users/:userId", requireAuth, async (req, res) => {
  try {
    const userDetails = await User.findById(req.params.userId);

    if (!userDetails) {
      return res.status(404).render("error", {
        title: "User Not Found",
        message: "User with this ID does not exist",
        user: req.user,
        theme: req.theme,
      });
    }

    res.render("users/details", {
      title: `User: ${userDetails.name}`,
      user: req.user,
      userDetails: userDetails,
      theme: req.theme,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).render("error", {
      title: "Error",
      message: "Failed to load user details",
      user: req.user,
      theme: req.theme,
    });
  }
});

// Articles routes (public) - Updated for MongoDB
app.get("/articles", async (req, res) => {
  try {
    const articles = await Article.find({ published: true }).sort({
      createdAt: -1,
    });
    res.render("articles/index.ejs", {
      title: "Articles List",
      articles: articles,
      user: req.user,
      theme: req.theme,
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).render("error", {
      title: "Error",
      message: "Failed to load articles",
      user: req.user,
      theme: req.theme,
    });
  }
});

app.get("/articles/:articleId", async (req, res) => {
  try {
    const article = await Article.findById(req.params.articleId);

    if (!article) {
      return res.render("error.ejs", {
        title: "Article Not Found",
        message: "Article with this ID does not exist",
        user: req.user,
        theme: req.theme,
      });
    }

    // Increment view count
    await article.incrementViews();

    res.render("articles/details.ejs", {
      title: article.title,
      article: article,
      user: req.user,
      theme: req.theme,
    });
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).render("error", {
      title: "Error",
      message: "Failed to load article",
      user: req.user,
      theme: req.theme,
    });
  }
});

// Middleware for API routes - return JSON responses
const apiMiddleware = (req, res, next) => {
  res.header("Content-Type", "application/json");
  next();
};

// CREATE Operations
// POST /api/users - Create single user
app.post("/api/users", apiMiddleware, async (req, res) => {
  try {
    const { name, email, password, age, role } = req.body;

    const newUser = new User({
      name,
      email,
      password,
      age: parseInt(age),
      role: role || "User",
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: savedUser.getPublicProfile(),
    });
  } catch (error) {
    console.error("Error creating user:", error);

    if (error.name === "ValidationError") {
      const validationErrors = {};
      Object.keys(error.errors).forEach((key) => {
        validationErrors[key] = error.errors[key].message;
      });

      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: validationErrors,
      });
    } else if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: "User with this email already exists",
      });
    }

    res.status(500).json({
      success: false,
      error: "Failed to create user",
      details: error.message,
    });
  }
});

// POST /api/users/many - Create multiple users
app.post("/api/users/many", apiMiddleware, async (req, res) => {
  try {
    const { users } = req.body;

    if (!Array.isArray(users) || users.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Request body must contain an array of users",
      });
    }

    const savedUsers = await User.insertMany(users, {
      ordered: false,
      runValidators: true,
    });

    res.status(201).json({
      success: true,
      message: `${savedUsers.length} users created successfully`,
      data: savedUsers.map((user) => user.getPublicProfile()),
    });
  } catch (error) {
    console.error("Error creating multiple users:", error);

    if (error.writeErrors) {
      const validationErrors = error.writeErrors.map((err) => ({
        index: err.index,
        error: err.errmsg,
      }));

      return res.status(400).json({
        success: false,
        error: "Some users failed validation",
        details: validationErrors,
        insertedCount: error.result?.insertedCount || 0,
      });
    }

    res.status(500).json({
      success: false,
      error: "Failed to create users",
      details: error.message,
    });
  }
});

// READ Operations with Projection
// GET /api/users - Get all users with optional projection
app.get("/api/users", apiMiddleware, async (req, res) => {
  try {
    const { fields, limit, skip, sort } = req.query;

    let query = User.find({});

    // Apply projection if specified
    if (fields) {
      const projection = fields.split(",").join(" ");
      query = query.select(projection);
    }

    // Apply pagination
    if (limit) query = query.limit(parseInt(limit));
    if (skip) query = query.skip(parseInt(skip));

    // Apply sorting
    if (sort) {
      const sortObj = {};
      sort.split(",").forEach((field) => {
        if (field.startsWith("-")) {
          sortObj[field.substring(1)] = -1;
        } else {
          sortObj[field] = 1;
        }
      });
      query = query.sort(sortObj);
    }

    const users = await query.exec();
    const total = await User.countDocuments();

    res.json({
      success: true,
      count: users.length,
      total: total,
      data: users.map((user) => user.getPublicProfile()),
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch users",
      details: error.message,
    });
  }
});

// GET /api/users/cursor - Stream users using Mongoose cursor with public profiles
app.get("/api/users/cursor", apiMiddleware, async (req, res) => {
  try {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    const cursor = User.find({}).cursor();
    let first = true;
    res.write("[");
    for await (const user of cursor) {
      if (!first) res.write(",");
      res.write(JSON.stringify(user.getPublicProfile()));
      first = false;
    }
    res.write("]");
    res.end();
  } catch (error) {
    console.error("Error streaming users with cursor:", error);
    res.status(500).json({
      success: false,
      error: "Failed to stream users",
      details: error.message,
    });
  }
});

// GET /api/users/:id - Get single user by ID
app.get("/api/users/:id", apiMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user",
      details: error.message,
    });
  }
});

// UPDATE Operations
// PUT /api/users/:id - Update single user (updateOne)
app.put("/api/users/:id", apiMiddleware, async (req, res) => {
  try {
    const { name, email, age, role } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email.toLowerCase();
    if (age) updateData.age = parseInt(age);
    if (role) updateData.role = role;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update user",
      details: error.message,
    });
  }
});

// PATCH /api/users - Update multiple users (updateMany)
app.patch("/api/users", apiMiddleware, async (req, res) => {
  try {
    const { filter, update } = req.body;

    if (!filter || !update) {
      return res.status(400).json({
        success: false,
        error: "Both filter and update objects are required",
      });
    }

    const result = await User.updateMany(filter, update);

    res.json({
      success: true,
      message: `${result.modifiedCount} users updated successfully`,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error updating multiple users:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update users",
      details: error.message,
    });
  }
});

// PUT /api/users/:id/replace - Replace entire user document (replaceOne)
app.put("/api/users/:id/replace", apiMiddleware, async (req, res) => {
  try {
    const { name, email, password, age, role } = req.body;

    // Validate required fields for replacement
    if (!name || !email || !password || !age) {
      return res.status(400).json({
        success: false,
        error:
          "All required fields must be provided for replacement: name, email, password, age",
      });
    }

    const replacementData = {
      name,
      email: email.toLowerCase(),
      password,
      age: parseInt(age),
      role: role || "User",
    };

    const replacedUser = await User.findByIdAndUpdate(
      req.params.id,
      replacementData,
      { new: true, overwrite: true, runValidators: true },
    );

    if (!replacedUser) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User replaced successfully",
      data: replacedUser,
    });
  } catch (error) {
    console.error("Error replacing user:", error);
    res.status(500).json({
      success: false,
      error: "Failed to replace user",
      details: error.message,
    });
  }
});

// DELETE Operations
// DELETE /api/users/:id - Delete single user (deleteOne)
app.delete("/api/users/:id", apiMiddleware, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User deleted successfully",
      data: deletedUser,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete user",
      details: error.message,
    });
  }
});

// DELETE /api/users - Delete multiple users (deleteMany)
app.delete("/api/users", apiMiddleware, async (req, res) => {
  try {
    const { filter } = req.body;

    if (!filter) {
      return res.status(400).json({
        success: false,
        error: "Filter object is required for bulk deletion",
      });
    }

    const result = await User.deleteMany(filter);

    res.json({
      success: true,
      message: `${result.deletedCount} users deleted successfully`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting multiple users:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete users",
      details: error.message,
    });
  }
});

// CREATE Operations
// POST /api/articles - Create single article
app.post("/api/articles", apiMiddleware, async (req, res) => {
  try {
    const { title, content, author, tags, published, category, featured } =
      req.body;

    const newArticle = new Article({
      title,
      content,
      author,
      tags: tags || [],
      published: published !== undefined ? published : true,
      category: category || "General",
      featured: featured || false,
    });

    const savedArticle = await newArticle.save();

    res.status(201).json({
      success: true,
      message: "Article created successfully",
      data: savedArticle.getPublicData(),
    });
  } catch (error) {
    console.error("Error creating article:", error);

    if (error.name === "ValidationError") {
      const validationErrors = {};
      Object.keys(error.errors).forEach((key) => {
        validationErrors[key] = error.errors[key].message;
      });

      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: validationErrors,
      });
    }

    res.status(500).json({
      success: false,
      error: "Failed to create article",
      details: error.message,
    });
  }
});

// POST /api/articles/many - Create multiple articles
app.post("/api/articles/many", apiMiddleware, async (req, res) => {
  try {
    const { articles } = req.body;

    if (!Array.isArray(articles) || articles.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Request body must contain an array of articles",
      });
    }

    const savedArticles = await Article.insertMany(articles, {
      ordered: false,
      runValidators: true,
    });

    res.status(201).json({
      success: true,
      message: `${savedArticles.length} articles created successfully`,
      data: savedArticles.map((article) => article.getPublicData()),
    });
  } catch (error) {
    console.error("Error creating multiple articles:", error);

    if (error.writeErrors) {
      const validationErrors = error.writeErrors.map((err) => ({
        index: err.index,
        error: err.errmsg,
      }));

      return res.status(400).json({
        success: false,
        error: "Some articles failed validation",
        details: validationErrors,
        insertedCount: error.result?.insertedCount || 0,
      });
    }

    res.status(500).json({
      success: false,
      error: "Failed to create articles",
      details: error.message,
    });
  }
});

// READ Operations with Projection
// GET /api/articles - Get all articles with optional projection and filtering
app.get("/api/articles", apiMiddleware, async (req, res) => {
  try {
    const { fields, limit, skip, sort, author, published, tags } = req.query;

    // Build filter object
    const filter = {};
    if (author) filter.author = new RegExp(author, "i");
    if (published !== undefined) filter.published = published === "true";
    if (tags) filter.tags = { $in: tags.split(",") };

    let query = Article.find(filter);

    // Apply projection if specified
    if (fields) {
      const projection = fields.split(",").join(" ");
      query = query.select(projection);
    }

    // Apply pagination
    if (limit) query = query.limit(parseInt(limit));
    if (skip) query = query.skip(parseInt(skip));

    // Apply sorting
    if (sort) {
      const sortObj = {};
      sort.split(",").forEach((field) => {
        if (field.startsWith("-")) {
          sortObj[field.substring(1)] = -1;
        } else {
          sortObj[field] = 1;
        }
      });
      query = query.sort(sortObj);
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const articles = await query.exec();
    const total = await Article.countDocuments(filter);

    res.json({
      success: true,
      count: articles.length,
      total: total,
      data: articles.map((article) => article.getPublicData()),
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch articles",
      details: error.message,
    });
  }
});

// GET /api/articles/stats - Aggregation: statistics for articles
app.get("/api/articles/stats", apiMiddleware, async (req, res) => {
  try {
    const stats = await Article.aggregate([
      {
        $group: {
          _id: null,
          totalArticles: { $sum: 1 },
          avgViews: { $avg: "$views" },
          totalViews: { $sum: "$views" },
          uniqueAuthors: { $addToSet: "$author" },
          publishedCount: { $sum: { $cond: ["$published", 1, 0] } },
        },
      },
      {
        $project: {
          _id: 0,
          totalArticles: 1,
          avgViews: 1,
          totalViews: 1,
          uniqueAuthorsCount: { $size: "$uniqueAuthors" },
          publishedCount: 1,
        },
      },
    ]);
    res.json({
      success: true,
      stats: stats[0] || {},
    });
  } catch (error) {
    console.error("Error aggregating article stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to aggregate article stats",
      details: error.message,
    });
  }
});

// GET /api/articles/:id - Get single article by ID
app.get("/api/articles/:id", apiMiddleware, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        error: "Article not found",
      });
    }

    // Increment view count
    await article.incrementViews();

    res.json({
      success: true,
      data: article.getPublicData(),
    });
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch article",
      details: error.message,
    });
  }
});

// UPDATE Operations
// PUT /api/articles/:id - Update single article (updateOne)
app.put("/api/articles/:id", apiMiddleware, async (req, res) => {
  try {
    const { title, content, author, tags, published } = req.body;
    const updateData = {};

    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (author) updateData.author = author;
    if (tags) updateData.tags = tags;
    if (published !== undefined) updateData.published = published;

    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true },
    );

    if (!updatedArticle) {
      return res.status(404).json({
        success: false,
        error: "Article not found",
      });
    }

    res.json({
      success: true,
      message: "Article updated successfully",
      data: updatedArticle,
    });
  } catch (error) {
    console.error("Error updating article:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update article",
      details: error.message,
    });
  }
});

// PATCH /api/articles - Update multiple articles (updateMany)
app.patch("/api/articles", apiMiddleware, async (req, res) => {
  try {
    const { filter, update } = req.body;

    if (!filter || !update) {
      return res.status(400).json({
        success: false,
        error: "Both filter and update objects are required",
      });
    }

    const result = await Article.updateMany(filter, update);

    res.json({
      success: true,
      message: `${result.modifiedCount} articles updated successfully`,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error updating multiple articles:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update articles",
      details: error.message,
    });
  }
});

// PUT /api/articles/:id/replace - Replace entire article document (replaceOne)
app.put("/api/articles/:id/replace", apiMiddleware, async (req, res) => {
  try {
    const { title, content, author, tags, published } = req.body;

    if (!title || !content || !author) {
      return res.status(400).json({
        success: false,
        error:
          "All required fields must be provided for replacement: title, content, author",
      });
    }

    const replacementData = {
      title,
      content,
      author,
      tags: tags || [],
      published: published !== undefined ? published : true,
      views: 0,
    };

    const replacedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      replacementData,
      { new: true, overwrite: true, runValidators: true },
    );

    if (!replacedArticle) {
      return res.status(404).json({
        success: false,
        error: "Article not found",
      });
    }

    res.json({
      success: true,
      message: "Article replaced successfully",
      data: replacedArticle,
    });
  } catch (error) {
    console.error("Error replacing article:", error);
    res.status(500).json({
      success: false,
      error: "Failed to replace article",
      details: error.message,
    });
  }
});

// DELETE Operations
// DELETE /api/articles/:id - Delete single article (deleteOne)
app.delete("/api/articles/:id", apiMiddleware, async (req, res) => {
  try {
    const deletedArticle = await Article.findByIdAndDelete(req.params.id);

    if (!deletedArticle) {
      return res.status(404).json({
        success: false,
        error: "Article not found",
      });
    }

    res.json({
      success: true,
      message: "Article deleted successfully",
      data: deletedArticle,
    });
  } catch (error) {
    console.error("Error deleting article:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete article",
      details: error.message,
    });
  }
});

// DELETE /api/articles - Delete multiple articles (deleteMany)
app.delete("/api/articles", apiMiddleware, async (req, res) => {
  try {
    const { filter } = req.body;

    if (!filter) {
      return res.status(400).json({
        success: false,
        error: "Filter object is required for bulk deletion",
      });
    }

    const result = await Article.deleteMany(filter);

    res.json({
      success: true,
      message: `${result.deletedCount} articles deleted successfully`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting multiple articles:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete articles",
      details: error.message,
    });
  }
});

// 404 Handler - must be after all routes
app.use((req, res) => {
  res.status(404).render("error", {
    title: "Page Not Found",
    message: "The requested page could not be found",
    user: req.user,
    theme: req.theme || "light",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).render("error", {
    title: "Server Error",
    message: "An internal server error occurred",
    user: req.user,
    theme: req.theme || "light",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
