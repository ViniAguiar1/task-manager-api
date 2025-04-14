const express = require("express");
const userController = require("../controllers/userController");
const authenticateToken = require("../middleware/authMiddleware");  // Middleware para autenticação

const router = express.Router();

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: "Login a user"
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful, returns token
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", userController.loginUser);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: "Get all users"
 *     tags: [Users]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/", authenticateToken, userController.getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: "Get a user by ID"
 *     tags: [Users]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
router.get("/:id", authenticateToken, userController.getUserById);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: "Create a new user"
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UserInput"
 *     responses:
 *       201:
 *         description: User successfully created
 */
router.post("/", userController.createUser);

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: "Update a user by ID"
 *     tags: [Users]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UserInput"
 *     responses:
 *       200:
 *         description: User updated
 *       404:
 *         description: User not found
 */
router.patch("/:id", authenticateToken, userController.updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: "Delete a user by ID"
 *     tags: [Users]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: User not found
 */
router.delete("/:id", authenticateToken, userController.deleteUser);

module.exports = router;
