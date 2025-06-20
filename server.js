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

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).render("register", {
        title: "Register",
        error: "User with this email already exists",
        user: req.user,
        theme: req.theme,
      });
    }

    // Create new user
    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password, // In real app, hash this password
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
    res.status(500).render("register", {
      title: "Register",
      error: "Registration failed. Please try again.",
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
    article.views = (article.views || 0) + 1;
    await article.save();

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

// Handle 404 errors
app.use((req, res) => {
  res.status(404).render("error", {
    title: "Page Not Found",
    message: "The requested page does not exist",
    user: req.user,
    theme: req.theme,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(
    `MongoDB integration: ${
      process.env.MONGODB_URI ? "Configured" : "Not configured"
    }`,
  );
});

module.exports = app;
