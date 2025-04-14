const fs = require("fs");
const path = require("path");

const dataFilePath = path.join(__dirname, "../../db/data.json");

// Função para ler os dados do arquivo
const readData = () => {
  try {
    const data = fs.readFileSync(dataFilePath);
    return JSON.parse(data);
  } catch (error) {
    return { projects: [] };
  }
};

// Função para salvar os dados no arquivo
const saveData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// Criar um novo projeto
exports.createProject = (req, res) => {
  const { title, type, subtype, date, color } = req.body;

  if (!title || !type || !subtype || !date || !color) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const data = readData();

  const newProject = {
    id: String(data.projects.length + 1),
    userId: req.user.id, // Associate project with the authenticated user
    title,
    type,
    subtype,
    date,
    color,
    tasksCount: 0, // Initial tasks count set to 0
    completedTasks: 0, // Initial completed tasks set to 0
  };

  data.projects.push(newProject);
  saveData(data);

  res.status(201).json({ message: "Project created successfully", project: newProject });
};

// Obter todos os projetos
exports.getAllProjects = (req, res) => {
  const data = readData();
  const userProjects = data.projects.filter((project) => project.userId === req.user.id); // Filter by user ID
  res.status(200).json(userProjects);
};

// Obter um projeto por ID
exports.getProjectById = (req, res) => {
  const { id } = req.params;
  const data = readData();
  const project = data.projects.find((project) => project.id === id && project.userId === req.user.id); // Check user ID

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  res.status(200).json(project);
};

// Atualizar um projeto por ID
exports.updateProject = (req, res) => {
  const { id } = req.params;
  const { title, type, subtype, date, color } = req.body;
  const data = readData();
  const projectIndex = data.projects.findIndex(
    (project) => project.id === id && project.userId === req.user.id // Check user ID
  );

  if (projectIndex === -1) {
    return res.status(404).json({ message: "Project not found" });
  }

  const updatedProject = {
    ...data.projects[projectIndex],
    title: title || data.projects[projectIndex].title,
    type: type || data.projects[projectIndex].type,
    subtype: subtype || data.projects[projectIndex].subtype,
    date: date || data.projects[projectIndex].date,
    color: color || data.projects[projectIndex].color,
  };

  data.projects[projectIndex] = updatedProject;
  saveData(data);

  res.status(200).json({ message: "Project updated successfully", project: updatedProject });
};

// Excluir um projeto por ID
exports.deleteProject = (req, res) => {
  const { id } = req.params;
  const data = readData();
  const projectIndex = data.projects.findIndex(
    (project) => project.id === id && project.userId === req.user.id // Check user ID
  );

  if (projectIndex === -1) {
    return res.status(404).json({ message: "Project not found" });
  }

  data.projects.splice(projectIndex, 1);
  saveData(data);

  res.status(200).json({ message: "Project deleted successfully" });
};
