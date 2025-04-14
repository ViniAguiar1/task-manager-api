const fs = require("fs");
const path = require("path");

const dataFilePath = path.join(__dirname, "../../db/data.json");

// Função para ler os dados do arquivo
const readData = () => {
  try {
    const data = fs.readFileSync(dataFilePath);
    return JSON.parse(data);
  } catch (error) {
    return { users: [], projects: [], tasks: [] };
  }
};

// Função para salvar os dados no arquivo
const saveData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// Criar uma nova task
exports.createTask = (req, res) => {
  const { title, deadline, priority, status, description, projectId, habit } = req.body;

  if (!title || !deadline || !priority || !status || !description || !projectId) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const data = readData();

  const newTask = {
    id: String(data.tasks.length + 1),
    title,
    deadline,
    priority,
    status,
    description,
    createdAt: new Date().toISOString().split("T")[0], // Data de criação (ano-mês-dia)
    completedAt: null,
    projectId,
    userId: req.user.userId, // Use the authenticated user's ID
    habit: habit || false,
    priorityColor: getPriorityColor(priority)
  };

  data.tasks.push(newTask);
  saveData(data);

  res.status(201).json({ message: "Task created successfully", task: newTask });
};

// Listar todas as tasks de um usuário
exports.getTasksByUserId = (req, res) => {
  const { userId } = req.params;
  const data = readData();

  const userTasks = data.tasks.filter(task => task.userId === userId);
  
  res.status(200).json(userTasks);
};

// Obter uma task por ID
exports.getTaskById = (req, res) => {
  const { id } = req.params;
  const data = readData();

  const task = data.tasks.find(task => task.id === id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.status(200).json(task);
};

// Atualizar uma task
exports.updateTask = (req, res) => {
  const { id } = req.params;
  const { title, deadline, priority, status, description, projectId, habit } = req.body;
  const data = readData();
  const taskIndex = data.tasks.findIndex(task => task.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  const updatedTask = {
    ...data.tasks[taskIndex],
    title: title || data.tasks[taskIndex].title,
    deadline: deadline || data.tasks[taskIndex].deadline,
    priority: priority || data.tasks[taskIndex].priority,
    status: status || data.tasks[taskIndex].status,
    description: description || data.tasks[taskIndex].description,
    projectId: projectId || data.tasks[taskIndex].projectId,
    habit: habit !== undefined ? habit : data.tasks[taskIndex].habit,
    priorityColor: getPriorityColor(priority || data.tasks[taskIndex].priority)
  };

  data.tasks[taskIndex] = updatedTask;
  saveData(data);

  res.status(200).json({ message: "Task updated", task: updatedTask });
};

// Excluir uma task
exports.deleteTask = (req, res) => {
  const { id } = req.params;
  const data = readData();
  const taskIndex = data.tasks.findIndex(task => task.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  data.tasks.splice(taskIndex, 1);
  saveData(data);

  res.status(200).json({ message: "Task deleted successfully" });
};

// Função auxiliar para obter a cor da prioridade
const getPriorityColor = (priority) => {
  const priorityColors = {
    baixa: "#4CAF50",  // Verde
    media: "#FFC107",  // Âmbar
    alta: "#F44336"    // Vermelho
  };
  return priorityColors[priority] || "#4CAF50";  // Retorna verde como padrão
};
