const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const users = require("./data/users");
const articles = require("./data/articles");

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = "your-secret-key-change-in-production";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      req.user = null;
    } else {
      req.user = decoded;
    }
    next();
  });
};

const getTheme = (req, res, next) => {
  req.theme = req.cookies.theme || "light";
  next();
};

const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.redirect("/login?redirect=true");
  }
  next();
};

app.use(authenticateToken);
app.use(getTheme);

app.get("/", (req, res) => {
  res.render("index", {
    title: "Home Page",
    user: req.user,
    theme: req.theme,
  });
});

app.get("/login", (req, res) => {
  if (req.user) {
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

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).render("login", {
      title: "Login",
      error: "Invalid credentials",
      user: req.user,
      theme: req.theme,
    });
  }

  // Generate JWT
  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    JWT_SECRET,
    { expiresIn: "24h" },
  );

  // Set httpOnly cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  });

  res.redirect("/");
});

app.get("/register", (req, res) => {
  if (req.user) {
    return res.redirect("/");
  }
  res.render("register", {
    title: "Register",
    user: req.user,
    theme: req.theme,
  });
});

app.post("/register", (req, res) => {
  const { name, email, password, age } = req.body;

  // Check if user already exists
  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(400).render("register", {
      title: "Register",
      error: "User with this email already exists",
      user: req.user,
      theme: req.theme,
    });
  }

  // Create new user
  const newUser = {
    id: users.length + 1,
    name,
    email,
    password,
    age: parseInt(age),
  };

  users.push(newUser);

  // Generate JWT
  const token = jwt.sign(
    { id: newUser.id, name: newUser.name, email: newUser.email },
    JWT_SECRET,
    { expiresIn: "24h" },
  );

  // Set httpOnly cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  });

  res.redirect("/");
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
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

// Users routes (protected - require authentication)
app.get("/users", requireAuth, (req, res) => {
  res.render("users/index", {
    title: "Users List",
    users: users,
    user: req.user,
    theme: req.theme,
  });
});

app.get("/users/:userId", requireAuth, (req, res) => {
  const userId = parseInt(req.params.userId);
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).render("error", {
      title: "User Not Found",
      message: "User with this ID does not exist",
      user: req.user,
      theme: req.theme,
    });
  }

  res.render("users/details", {
    title: `User: ${user.name}`,
    user: req.user,
    userDetails: user,
    theme: req.theme,
  });
});

app.get("/articles", (req, res) => {
  res.render("articles/index.ejs", {
    title: "Articles List",
    articles: articles,
    user: req.user,
    theme: req.theme,
  });
});

app.get("/articles/:articleId", (req, res) => {
  const articleId = parseInt(req.params.articleId);
  const article = articles.find((a) => a.id === articleId);

  if (!article) {
    return res.render("error.ejs", {
      title: "Article Not Found",
      message: "Article with this ID does not exist",
      user: req.user,
      theme: req.theme,
    });
  }

  res.render("articles/details.ejs", {
    title: article.title,
    article: article,
    user: req.user,
    theme: req.theme,
  });
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
});

module.exports = app;
