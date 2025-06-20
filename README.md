# Node.js Express Server with EJS, Passport Authentication, Session Management and MongoDB Atlas Integration

## Project Description

This is a modern web server built with Node.js and Express.js that demonstrates complete functionality for working with:

- **MongoDB Atlas** cloud database integration
- **Mongoose** ODM for MongoDB operations
- EJS templating engine
- Passport.js authentication with Local Strategy
- Express session management for persistent authentication
- Cookie-based session storage with httpOnly and secure flags
- Static files and favicon
- Dark and light theme support
- Protected routes with middleware-based access control
- Real-time MongoDB data dashboard

# Node.js Express Server with EJS, Passport Authentication, Session Management and MongoDB Atlas Integration

## Project Description

This is a modern web server built with Node.js and Express.js that demonstrates complete functionality for working with:

- **MongoDB Atlas** cloud database integration
- **Mongoose** ODM for MongoDB operations
- EJS templating engine
- Passport.js authentication with Local Strategy
- Express session management for persistent authentication
- Cookie-based session storage with httpOnly and secure flags
- Static files and favicon
- Dark and light theme support
- Protected routes with middleware-based access control

## Installation and Setup

### System Requirements

- Node.js version 14.0 or higher
- npm or yarn package manager
- MongoDB Atlas account (free tier available)

### Installation Steps

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd homework_62
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory:

   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/your-database-name?retryWrites=true&w=majority
   SESSION_SECRET=your-super-secret-session-key-change-in-production
   PORT=3000
   NODE_ENV=development
   ```

   **MongoDB Atlas Setup:**

   - Create a free account at <https://cloud.mongodb.com>
   - Create a new cluster
   - Go to Database Access and create a database user
   - Go to Network Access and add your IP address (or 0.0.0.0/0 for development)
   - Get your connection string from Connect -> Connect your application

4. **Start the server:**

   ```bash
   # Regular start
   npm start

   # Development mode (with auto-restart)
   npm run dev
   ```

5. **Open your browser:**

   ```text
   http://localhost:3000
   ```

### Database Models

#### User Model

```javascript
{
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required),
  age: Number (required, 1-120),
  role: String (default: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

#### Article Model

```javascript
{
  title: String (required),
  content: String (required),
  author: String (required),
  date: Date (default: now),
  published: Boolean (default: true),
  tags: [String],
  views: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

## Project Structure

```text
homework_62/
├── server.js             # Main server file with MongoDB integration
├── package.json          # Dependencies and scripts
├── README.md             # Project documentation
├── .env                  # Environment variables (create from .env.example)
├── .env.example          # Environment variables template
├── .gitignore            # Git ignore file (includes .env)
├── config/               # Configuration files
│   ├── database.js       # MongoDB connection logic
│   └── initData.js       # Database initialization and seeding
├── models/               # Mongoose models
│   ├── User.js           # User schema and model
│   └── Article.js        # Article schema and model
├── public/               # Static files
│   ├── favicon.ico       # Site icon
│   └── css/
│       └── style.css     # Project styles
└── views/                # EJS templates
    ├── index.ejs         # Home page
    ├── layout.ejs        # Base template
    ├── login.ejs         # Login page
    ├── register.ejs      # Registration page
    ├── protected.ejs     # Protected page
    ├── error.ejs         # Error page
    ├── articles/         # Article templates
    │   ├── index.ejs     # Article list
    │   └── details.ejs   # Article details
    └── users/            # User templates
        ├── index.ejs     # User list
        └── details.ejs   # User details
```

## Technologies

### Backend

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud NoSQL database
- **Mongoose** - MongoDB object modeling for Node.js
- **EJS** - Template engine
- **Passport.js** - Authentication middleware
- **passport-local** - Local authentication strategy
- **express-session** - Session management middleware
- **cookie-parser** - Cookie handling
- **cors** - Cross-Origin Resource Sharing
- **dotenv** - Environment variable management

### Frontend

- **HTML5** - Markup
- **CSS3** - Styling with theme support
- **Bootstrap** - UI components (via CDN)
- **JavaScript** - Client-side logic

## Routes

### Public Routes

- `GET /` - Home page
- `GET /login` - Login page
- `GET /register` - Registration page
- `POST /login` - Process login
- `POST /register` - Process registration
- `GET /logout` - Logout user
- `GET /articles` - List all articles
- `GET /articles/:id` - View article details
- `POST /set-theme` - Set user theme preference

### Protected Routes (require authentication)

- `GET /protected` - Protected page
- `GET /users` - List all users
- `GET /users/:id` - View user details

## Security

### Authentication Features

- Passport Local Strategy with email/password
- Secure session serialization with MongoDB user IDs
- Password validation (in production, use bcrypt for hashing)
- Automatic login after registration
- Session-based authentication with secure cookies

### Environment Security

- Environment variables for sensitive data
- MongoDB connection string protection
- Session secret protection
- Production-ready security settings

## Sample Data

The application automatically seeds the database with sample data on first run.

### Test Users for Login

- **Email**: `alex@example.com`, **Password**: `password123` (Developer)
- **Email**: `maria@example.com`, **Password**: `password123` (Designer)
- **Email**: `sergey@example.com`, **Password**: `password123` (Project Manager)
- **Email**: `anna@example.com`, **Password**: `password123` (Tester)

### Sample Articles

- Node.js Basics
- Templating Engines in Express
- REST API Development
- MongoDB Atlas Integration

## Development

### Run in Development Mode

```bash
npm run dev
```

### Environment Variables

Create a `.env` file with the following structure:

```env
# MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Session secret for security
SESSION_SECRET=your-super-secret-session-key

# Server configuration
PORT=3000
NODE_ENV=development
```

## License

MIT License

## Author

Bohdan Hulobov
