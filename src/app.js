const express = require("express");
const swaggerUi = require("swagger-ui-express");
const path = require("path");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(express.json());

// Carregar o arquivo swagger.json diretamente
const swaggerSpec = require(path.join(__dirname, 'swagger.json'));

// Rota para acessar a documentação do Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Usar as rotas de usuários
app.use("/users", userRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
