const express = require("express");
const swaggerUi = require("swagger-ui-express");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const authMiddleware = require("./middleware/authMiddleware"); // Import authentication middleware

const app = express();
app.use(express.json());

// Swagger setup
const swaggerDocument = require("./swagger.json"); // Import the Swagger JSON file
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use("/users", userRoutes);
app.use("/projects", authMiddleware, projectRoutes); // Apply auth middleware to project routes
app.use("/tasks", authMiddleware, taskRoutes); // Apply auth middleware to task routes

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
