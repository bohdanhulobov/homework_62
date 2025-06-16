# Node.js Express Server with EJS, Passport Authentication and Session Management

## Project Description

This is a modern web server built with Node.js and Express.js that demonstrates complete functionality for working with:

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

3. **Start the server:**

   ```bash
   # Regular start
   npm start

   # Development mode (with auto-restart)
   npm run dev
   ```

4. **Open your browser:**
   ```
   http://localhost:3000
   ```

## Project Structure

```
homework_62/
├── server.js             # Main server file
├── package.json          # Dependencies and scripts
├── README.md             # Project documentation
├── data/                 # Demo data
│   ├── users.js          # User list
│   └── articles.js       # Article list
├── public/               # Static files
│   ├── favicon.ico       # Site icon
│   └── css/
│       └── style.css     # Project styles
└── views/                # EJS templates
    ├── index.ejs         # Home page
    ├── layout.ejs        # Base template
    ├── login.ejs         # Login page
    ├── register.ejs      # Registration page
    ├── error.ejs         # Error page
    ├── articles/         # Article templates
    │   ├── index.ejs     # Article list
    │   └── details.ejs   # Article details
    └── users/            # User templates
        ├── index.ejs     # User list
        └── details.ejs   # User details
```

### Middleware

#### `authenticateToken`

- Verifies JWT token from cookies
- Adds user information to `req.user`
- Works for all routes

#### `getTheme`

- Extracts theme preference from cookies
- Sets default value ('light')
- Adds theme to `req.theme`

## Technologies

### Backend

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web framework
- **EJS** - Template engine
- **Passport.js** - Authentication middleware
- **passport-local** - Local authentication strategy
- **express-session** - Session management middleware
- **cookie-parser** - Cookie handling
- **cors** - Cross-Origin Resource Sharing

### Frontend

- **HTML5** - Markup
- **CSS3** - Styling with theme support
- **JavaScript** - Client-side logic

## Security

### Passport Authentication

- Local strategy using email and password
- Secure session serialization and deserialization
- Automatic login after registration
- Proper logout functionality

## Test Data

### Users for login:

- **Email:** alex@example.com, **Password:** password123
- **Email:** maria@example.com, **Password:** password123
- **Email:** sergey@example.com, **Password:** password123
- **Email:** anna@example.com, **Password:** password123

## Development

### Run in development mode:

```bash
npm run dev
```

### Environment variables structure:

```env
PORT=3000                    # Server port (default 3000)
NODE_ENV=development         # Environment (development/production)
JWT_SECRET=your-secret-key   # Secret key for JWT
```

## License

MIT License

## Author

Bohdan Hulobov
