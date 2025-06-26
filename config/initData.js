const User = require("../models/User");
const Article = require("../models/Article");

const initializeData = async () => {
  try {
    // Check if data already exists
    const userCount = await User.countDocuments();
    const articleCount = await Article.countDocuments();

    if (userCount === 0) {
      console.log("Initializing users data...");

      // Initial core users
      const coreUsers = [
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

      // Generate additional users for cursor demonstration
      const additionalUsers = [];
      const firstNames = [
        "John",
        "Jane",
        "Mike",
        "Sarah",
        "David",
        "Emma",
        "Chris",
        "Lisa",
        "Tom",
        "Amy",
        "Steve",
        "Kate",
        "Paul",
        "Nina",
        "Mark",
        "Eva",
        "Alex",
        "Olga",
        "Dan",
        "Lena",
      ];
      const lastNames = [
        "Smith",
        "Johnson",
        "Brown",
        "Davis",
        "Miller",
        "Wilson",
        "Moore",
        "Taylor",
        "Anderson",
        "Thomas",
        "Jackson",
        "White",
        "Harris",
        "Martin",
        "Thompson",
        "Garcia",
        "Martinez",
        "Robinson",
        "Clark",
        "Rodriguez",
      ];
      const roles = [
        "Developer",
        "Designer",
        "Tester",
        "Project Manager",
        "DevOps",
        "Analyst",
        "Writer",
        "Manager",
        "Consultant",
        "Admin",
      ];

      for (let i = 0; i < 100; i++) {
        const firstName =
          firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName =
          lastNames[Math.floor(Math.random() * lastNames.length)];
        const role = roles[Math.floor(Math.random() * roles.length)];

        additionalUsers.push({
          name: `${firstName} ${lastName}`,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
          password: "password123",
          age: Math.floor(Math.random() * 40) + 20, // Age between 20-60
          role: role,
        });
      }

      await User.insertMany([...coreUsers, ...additionalUsers]);
      console.log(
        `Users data initialized successfully: ${
          coreUsers.length + additionalUsers.length
        } users created`,
      );
    }

    if (articleCount === 0) {
      console.log("Initializing articles data...");

      // Core articles
      const coreArticles = [
        {
          title: "Node.js Basics",
          content:
            "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. It allows developers to run JavaScript on the server side, enabling full-stack JavaScript development. Node.js is known for its event-driven, non-blocking I/O model that makes it lightweight and efficient, perfect for data-intensive real-time applications that run across distributed devices.",
          author: "Alexander Petrenko",
          tags: ["nodejs", "javascript", "backend"],
          views: Math.floor(Math.random() * 50),
        },
        {
          title: "Templating Engines in Express",
          content:
            "Templating engines allow you to use static template files in your application. At runtime, the template engine replaces variables in a template file with actual values, and transforms the template into an HTML file sent to the client. This approach makes it easier to design an HTML page. Some popular template engines that work with Express are Pug, Mustache, and EJS.",
          author: "Maria Ivanenko",
          tags: ["express", "templating", "ejs", "pug"],
          views: Math.floor(Math.random() * 50),
        },
        {
          title: "REST API Development",
          content:
            "REST (Representational State Transfer) is an architectural style for developing web services. RESTful APIs are designed around resources, which are any kind of object, data, or service that can be accessed by the client. A resource has an identifier, which is a URI that uniquely identifies that resource. Clients interact with a service by exchanging representations of resources using HTTP methods.",
          author: "Sergey Kovalenko",
          tags: ["rest", "api", "http", "web-services"],
          views: Math.floor(Math.random() * 50),
        },
        {
          title: "MongoDB Atlas Integration",
          content:
            "MongoDB Atlas is a fully-managed cloud database service that handles all the complexity of deploying, managing, and healing your deployments on the cloud service provider of your choice. Atlas provides an easy way to host and manage your data in the cloud with comprehensive security features and built-in operational best practices.",
          author: "Anna Sidorenko",
          tags: ["mongodb", "atlas", "cloud", "database"],
          views: Math.floor(Math.random() * 50),
        },
      ];

      // Generate additional articles for aggregation demonstration
      const additionalArticles = [];
      const articleTopics = [
        "React Components",
        "Vue.js Basics",
        "Angular Services",
        "TypeScript Tips",
        "GraphQL APIs",
        "Docker Containers",
        "Kubernetes Deployment",
        "AWS Services",
        "Firebase Integration",
        "PostgreSQL Optimization",
        "Redis Caching",
        "Elasticsearch Setup",
        "Git Workflows",
        "CI/CD Pipelines",
        "Testing Strategies",
        "Security Best Practices",
        "Performance Optimization",
        "Mobile Development",
        "Machine Learning",
        "Data Science",
        "Blockchain Technology",
        "IoT Development",
        "Cloud Computing",
        "Microservices",
        "API Design",
        "Database Design",
        "Web Accessibility",
        "SEO Optimization",
        "Progressive Web Apps",
        "Serverless Functions",
        "Python Django",
        "Ruby on Rails",
        "PHP Laravel",
        "Java Spring",
        "C# .NET",
        "Frontend Frameworks",
        "Backend Development",
        "Full Stack Development",
        "DevOps Practices",
        "Agile Methodologies",
      ];

      const authors = [
        "Alexander Petrenko",
        "Maria Ivanenko",
        "Sergey Kovalenko",
        "Anna Sidorenko",
        "John Smith",
        "Jane Doe",
        "Mike Johnson",
        "Sarah Brown",
        "David Wilson",
        "Emma Davis",
        "Chris Miller",
        "Lisa Taylor",
        "Tom Anderson",
        "Amy White",
        "Steve Garcia",
      ];
      const tagOptions = [
        "javascript",
        "nodejs",
        "react",
        "vue",
        "angular",
        "typescript",
        "python",
        "java",
        "php",
        "ruby",
        "docker",
        "kubernetes",
        "aws",
        "mongodb",
        "postgresql",
        "redis",
        "api",
        "frontend",
        "backend",
        "fullstack",
        "devops",
        "testing",
        "security",
        "performance",
      ];

      for (let i = 0; i < 50; i++) {
        const topic =
          articleTopics[Math.floor(Math.random() * articleTopics.length)];
        const author = authors[Math.floor(Math.random() * authors.length)];
        const published = Math.random() > 0.1; // 90% published
        const numTags = Math.floor(Math.random() * 4) + 1; // 1-4 tags
        const shuffledTags = [...tagOptions].sort(() => 0.5 - Math.random());
        const selectedTags = shuffledTags.slice(0, numTags);

        additionalArticles.push({
          title: `${topic} - Advanced Guide`,
          content: `This comprehensive guide covers ${topic.toLowerCase()} in detail. Learn best practices, common patterns, and advanced techniques. This article provides practical examples and real-world scenarios to help you master ${topic.toLowerCase()} development. Whether you're a beginner or experienced developer, this guide will enhance your understanding and skills.`,
          author: author,
          tags: selectedTags,
          published: published,
          views: Math.floor(Math.random() * 100), // Random views 0-99
        });
      }

      await Article.insertMany([...coreArticles, ...additionalArticles]);
      console.log(
        `Articles data initialized successfully: ${
          coreArticles.length + additionalArticles.length
        } articles created`,
      );
    }

    console.log("Database initialization completed");
  } catch (error) {
    console.error("Error initializing data:", error);
  }
};

module.exports = initializeData;
