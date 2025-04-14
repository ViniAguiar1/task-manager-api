const express = require("express");
const swaggerUi = require("swagger-ui-express");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const authMiddleware = require("./middleware/authMiddleware"); // Import authentication middleware

const app = express();
app.use(express.json());

const swaggerDocument = require("./swagger.json"); // Import the Swagger JSON file

// Swagger setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use("/users", userRoutes);
app.use("/projects", authMiddleware, projectRoutes); // Apply auth middleware to project routes

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
