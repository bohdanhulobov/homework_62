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

The application automatically seeds the database with comprehensive sample data on first run to demonstrate cursor and aggregation functionality effectively.

### Test Users for Login

- **Email**: `alex@example.com`, **Password**: `password123` (Developer)
- **Email**: `maria@example.com`, **Password**: `password123` (Designer)
- **Email**: `sergey@example.com`, **Password**: `password123` (Project Manager)
- **Email**: `anna@example.com`, **Password**: `password123` (Tester)

### Seed Data Scale

- **Users**: 104 users total (4 core users + 100 generated users)

  - Diverse roles: Developer, Designer, Tester, Project Manager, DevOps, Analyst, etc.
  - Random ages between 20-60
  - Unique email addresses for testing

- **Articles**: 54 articles total (4 core articles + 50 generated articles)
  - Various authors from the user pool
  - Random view counts (0-99 views)
  - 90% published, 10% draft status
  - Diverse topics: React, Vue, Angular, Node.js, MongoDB, Docker, etc.
  - Multiple tags per article (1-4 tags)

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

## MongoDB Atlas CRUD API

### Common Query Parameters

All GET endpoints support the following query parameters:

| Parameter | Description                                            | Format | Example                |
| --------- | ------------------------------------------------------ | ------ | ---------------------- |
| fields    | Comma-separated list of fields to include (projection) | String | `fields=name,email`    |
| limit     | Maximum number of documents to return                  | Number | `limit=10`             |
| skip      | Number of documents to skip (for pagination)           | Number | `skip=20`              |
| sort      | Field(s) to sort by (prefix with - for descending)     | String | `sort=-createdAt,name` |

### User API Endpoints

#### Create Operations

- **POST** `/api/users` - Create single user (insertOne)

  ```json
  // Request Body
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "age": 30,
    "role": "Admin"
  }
  ```

- **POST** `/api/users/many` - Create multiple users (insertMany)
  ```json
  // Request Body
  {
    "users": [
      {
        "name": "John Doe",
        "email": "john@example.com",
        "password": "password123",
        "age": 30,
        "role": "Admin"
      },
      {
        "name": "Jane Smith",
        "email": "jane@example.com",
        "password": "password123",
        "age": 25,
        "role": "User"
      }
    ]
  }
  ```

#### Read Operations

- **GET** `/api/users` - Get all users with optional query parameters

  ```
  /api/users?fields=name,email&limit=5&skip=10&sort=-createdAt
  ```

- **GET** `/api/users/:id` - Get single user by ID
  ```
  /api/users/60d21b4667d0d8992e610c85
  ```

#### Update Operations

- **PUT** `/api/users/:id` - Update single user (updateOne)

  ```json
  // Request Body
  {
    "name": "Updated Name",
    "email": "newemail@example.com",
    "age": 31
  }
  ```

- **PATCH** `/api/users` - Update multiple users (updateMany)

  ```json
  // Request Body
  {
    "filter": { "role": "User" },
    "update": { "$set": { "role": "Member" } }
  }
  ```

- **PUT** `/api/users/:id/replace` - Replace entire user document (replaceOne)
  ```json
  // Request Body (all fields required)
  {
    "name": "Complete New Name",
    "email": "completely@new.com",
    "password": "newpassword123",
    "age": 40,
    "role": "SuperAdmin"
  }
  ```

#### Delete Operations

- **DELETE** `/api/users/:id` - Delete single user (deleteOne)

  ```
  /api/users/60d21b4667d0d8992e610c85
  ```

- **DELETE** `/api/users` - Delete multiple users (deleteMany)
  ```json
  // Request Body
  {
    "filter": { "role": "Deactivated" }
  }
  ```

### Article API Endpoints

#### Create Operations

- **POST** `/api/articles` - Create single article (insertOne)

  ```json
  // Request Body
  {
    "title": "MongoDB Atlas Integration",
    "content": "This article explains how to integrate with MongoDB Atlas...",
    "author": "John Doe",
    "tags": ["mongodb", "atlas", "database"],
    "published": true
  }
  ```

- **POST** `/api/articles/many` - Create multiple articles (insertMany)
  ```json
  // Request Body
  {
    "articles": [
      {
        "title": "MongoDB Atlas Integration",
        "content": "This article explains how to integrate with MongoDB Atlas...",
        "author": "John Doe",
        "tags": ["mongodb", "atlas", "database"],
        "published": true
      },
      {
        "title": "Express.js REST API",
        "content": "Building a REST API with Express.js is straightforward...",
        "author": "Jane Smith",
        "tags": ["express", "api", "rest"],
        "published": true
      }
    ]
  }
  ```

#### Read Operations

- **GET** `/api/articles` - Get all articles with optional query parameters

  ```
  /api/articles?fields=title,author&limit=5&skip=10&sort=-createdAt&author=John&published=true&tags=mongodb
  ```

- **GET** `/api/articles/:id` - Get single article by ID (increments view count)
  ```
  /api/articles/60d21b4667d0d8992e610c85
  ```

#### Update Operations

- **PUT** `/api/articles/:id` - Update single article (updateOne)

  ```json
  // Request Body
  {
    "title": "Updated Title",
    "content": "Updated content...",
    "tags": ["updated", "tags"]
  }
  ```

- **PATCH** `/api/articles` - Update multiple articles (updateMany)

  ```json
  // Request Body
  {
    "filter": { "author": "John Doe" },
    "update": { "$set": { "author": "John Doe Jr." } }
  }
  ```

- **PUT** `/api/articles/:id/replace` - Replace entire article document (replaceOne)
  ```json
  // Request Body (all fields required)
  {
    "title": "Completely New Title",
    "content": "Completely new content...",
    "author": "New Author",
    "tags": ["new", "tags"],
    "published": true
  }
  ```

#### Delete Operations

- **DELETE** `/api/articles/:id` - Delete single article (deleteOne)

  ```
  /api/articles/60d21b4667d0d8992e610c85
  ```

- **DELETE** `/api/articles` - Delete multiple articles (deleteMany)
  ```json
  // Request Body
  {
    "filter": { "published": false }
  }
  ```

### Response Format

All API endpoints return responses in a consistent format:

#### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },  // The data returned (may be an object or array)
  "count": 10,      // For list operations, the count of returned items
  "total": 100      // For list operations, the total count of items
}
```

#### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "details": "Detailed error information"
}
```

### MongoDB Indexes

For optimized query performance, the following indexes have been created:

#### User Model Indexes

- `email`: Unique index
- `name`: Regular index
- `role`: Regular index
- `age`: Regular index
- `createdAt`: Regular index (descending)
- `email,role`: Compound index

#### Article Model Indexes

- `title,author,date`: Compound index
- `published`: Regular index
- `author`: Regular index
- `createdAt`: Regular index (descending)
- `tags`: Regular index
- `views`: Regular index (descending)
- `published,createdAt`: Compound index
- `author,published`: Compound index

## Advanced Data Operations: Cursors & Aggregation

### 1. User Streaming with Cursor

**GET /api/users/cursor**

- Returns all users as a JSON array using MongoDB cursor (efficient for large datasets, doesn't hold all documents in memory).
- Response is streamed in chunks, allowing processing of large collections without overloading the server.
- Ideal for handling thousands of users without memory overflow.

**Example request:**

```bash
curl -X GET http://localhost:3000/api/users/cursor
```

**Expected response:**

```json
[
  { "_id": "...", "name": "Alex", "email": "alex@example.com", ... },
  { "_id": "...", "name": "Maria", "email": "maria@example.com", ... },
  ...
]
```

### 2. Articles Aggregation Statistics

**GET /api/articles/stats**

- Returns comprehensive statistics for the articles collection using MongoDB aggregation pipeline:
  - `totalArticles`: total number of articles
  - `avgViews`: average number of views per article
  - `totalViews`: sum of all article views
  - `uniqueAuthorsCount`: number of unique authors
  - `publishedCount`: number of published articles

**Example request:**

```bash
curl -X GET http://localhost:3000/api/articles/stats
```

**Expected response:**

```json
{
  "success": true,
  "stats": {
    "totalArticles": 50,
    "avgViews": 12.4,
    "totalViews": 620,
    "uniqueAuthorsCount": 15,
    "publishedCount": 45
  }
}
```
