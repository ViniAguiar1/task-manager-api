const express = require("express");
const projectController = require("../controllers/projectController");
const authMiddleware = require("../middleware/authMiddleware"); // Assume this middleware validates the user and sets req.user

const router = express.Router();

router.use(authMiddleware); // Apply authentication middleware to all routes

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: API for managing projects
 */

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: "Get all projects"
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: List of projects
 */
router.get("/", projectController.getAllProjects);

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: "Create a new project"
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ProjectInput"
 *     responses:
 *       201:
 *         description: Project successfully created
 */
router.post("/", projectController.createProject);

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: "Get a project by ID"
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project found
 *       404:
 *         description: Project not found
 */
router.get("/:id", projectController.getProjectById);

/**
 * @swagger
 * /projects/{id}:
 *   patch:
 *     summary: "Update a project by ID"
 *     tags: [Projects]
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
 *             $ref: "#/components/schemas/ProjectInput"
 *     responses:
 *       200:
 *         description: Project updated
 *       404:
 *         description: Project not found
 */
router.patch("/:id", projectController.updateProject);

/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: "Delete a project by ID"
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project deleted
 *       404:
 *         description: Project not found
 */
router.delete("/:id", projectController.deleteProject);

module.exports = router;
