const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Load environment variables
require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET;

const authMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).send("Access denied. No token provided.");
    }

    // Verify token
    const decoded = jwt.verify(token, SECRET_KEY);
    const { id: userId } = decoded;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found.");
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(400).send("Invalid token or user not authenticated.");
  }
};

module.exports = { authMiddleware };
