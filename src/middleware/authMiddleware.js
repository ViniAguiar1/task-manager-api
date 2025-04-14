const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Access denied, token missing." });
  }

  const token = authHeader.split(" ")[1]; // Extract the token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Access denied, token missing." });
  }

  try {
    const decoded = jwt.verify(token, "secretKey"); // Replace "secretKey" with your actual secret key
    req.user = decoded; // Attach the decoded user info to the request object
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token." });
  }
};

module.exports = authenticateToken;
