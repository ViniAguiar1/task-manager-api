const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

const dataFilePath = path.join(__dirname, "../../db/data.json");

// Função para ler os dados do arquivo
const readData = () => {
  try {
    const data = fs.readFileSync(dataFilePath);
    return JSON.parse(data);
  } catch (error) {
    return { users: [] };
  }
};

// Função para salvar os dados no arquivo
const saveData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// Criar um novo usuário
exports.createUser = (req, res) => {
  const { name, email, password, phone, cpf, photo } = req.body;

  if (!name || !email || !password || !phone || !cpf || !photo) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const data = readData();

  // Verifica se o usuário já existe
  const existingUser = data.users.find((user) => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: "User with this email already exists" });
  }

  const hashedPassword = bcrypt.hashSync(password, 8);
  const newUser = {
    id: String(data.users.length + 1),
    name,
    email,
    phone,
    cpf,
    photo,
    password: hashedPassword,
  };

  data.users.push(newUser);
  saveData(data);

  res.status(201).json({ message: "User created successfully", user: newUser });
};

// Login de usuário (gera token JWT)
exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const data = readData();
  const user = data.users.find((user) => user.email === email);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const validPassword = bcrypt.compareSync(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user.id, email: user.email }, "secretKey", { expiresIn: "1h" });

  res.status(200).json({ message: "Login successful", token });
};

// Obter todos os usuários
exports.getAllUsers = (req, res) => {
  const data = readData();
  res.status(200).json(data.users);
};

// Obter um usuário por ID
exports.getUserById = (req, res) => {
  const { id } = req.params;
  const data = readData();
  const user = data.users.find((user) => user.id === id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(user);
};

// Atualizar um usuário por ID
exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { name, email, password, phone, cpf, photo } = req.body;
  const data = readData();
  const userIndex = data.users.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  const updatedUser = {
    ...data.users[userIndex],
    name: name || data.users[userIndex].name,
    email: email || data.users[userIndex].email,
    phone: phone || data.users[userIndex].phone,
    cpf: cpf || data.users[userIndex].cpf,
    photo: photo || data.users[userIndex].photo,
    password: password ? bcrypt.hashSync(password, 8) : data.users[userIndex].password,
  };

  data.users[userIndex] = updatedUser;
  saveData(data);

  res.status(200).json({ message: "User updated successfully", user: updatedUser });
};

// Excluir um usuário por ID
exports.deleteUser = (req, res) => {
  const { id } = req.params;
  const data = readData();
  const userIndex = data.users.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  data.users.splice(userIndex, 1);
  saveData(data);

  res.status(200).json({ message: "User deleted successfully" });
};
