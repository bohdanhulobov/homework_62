const User = require("../models/User");
const Article = require("../models/Article");

const initializeData = async () => {
  try {
    // Check if data already exists
    const userCount = await User.countDocuments();
    const articleCount = await Article.countDocuments();

    if (userCount === 0) {
      console.log("Initializing users data...");
      const users = [
        {
          name: "Alexander Petrenko",
          email: "alex@example.com",
          password: "password123",
          age: 28,
          role: "Developer",
        },
        {
          name: "Maria Ivanenko",
          email: "maria@example.com",
          password: "password123",
          age: 25,
          role: "Designer",
        },
        {
          name: "Sergey Kovalenko",
          email: "sergey@example.com",
          password: "password123",
          age: 32,
          role: "Project Manager",
        },
        {
          name: "Anna Sidorenko",
          email: "anna@example.com",
          password: "password123",
          age: 29,
          role: "Tester",
        },
      ];

      await User.insertMany(users);
      console.log("Users data initialized successfully");
    }

    if (articleCount === 0) {
      console.log("Initializing articles data...");
      const articles = [
        {
          title: "Node.js Basics",
          content:
            "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. It allows developers to run JavaScript on the server side, enabling full-stack JavaScript development. Node.js is known for its event-driven, non-blocking I/O model that makes it lightweight and efficient, perfect for data-intensive real-time applications that run across distributed devices.",
          author: "Alexander Petrenko",
          tags: ["nodejs", "javascript", "backend"],
        },
        {
          title: "Templating Engines in Express",
          content:
            "Templating engines allow you to use static template files in your application. At runtime, the template engine replaces variables in a template file with actual values, and transforms the template into an HTML file sent to the client. This approach makes it easier to design an HTML page. Some popular template engines that work with Express are Pug, Mustache, and EJS.",
          author: "Maria Ivanenko",
          tags: ["express", "templating", "ejs", "pug"],
        },
        {
          title: "REST API Development",
          content:
            "REST (Representational State Transfer) is an architectural style for developing web services. RESTful APIs are designed around resources, which are any kind of object, data, or service that can be accessed by the client. A resource has an identifier, which is a URI that uniquely identifies that resource. Clients interact with a service by exchanging representations of resources using HTTP methods.",
          author: "Sergey Kovalenko",
          tags: ["rest", "api", "http", "web-services"],
        },
        {
          title: "MongoDB Atlas Integration",
          content:
            "MongoDB Atlas is a fully-managed cloud database service that handles all the complexity of deploying, managing, and healing your deployments on the cloud service provider of your choice. Atlas provides an easy way to host and manage your data in the cloud with comprehensive security features and built-in operational best practices.",
          author: "Anna Sidorenko",
          tags: ["mongodb", "atlas", "cloud", "database"],
        },
      ];

      await Article.insertMany(articles);
      console.log("Articles data initialized successfully");
    }

    console.log("Database initialization completed");
  } catch (error) {
    console.error("Error initializing data:", error);
  }
};

module.exports = initializeData;
