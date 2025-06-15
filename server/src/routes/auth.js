const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { authMiddleware } = require("../middlewares/auth");
const { validateUser } = require("../utils/validation");
const bcrypt = require("bcrypt");
const saltRounds = 10;

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).send("Invalid password");
    }

    const token = await user.getJWT();

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set secure in production
      sameSite: "strict",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    res.status(200).json({ message: "User logged in successfully", user });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 */
router.post("/logout", (req, res) => {
  try {
    res.cookie("token", null, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(Date.now()),
    });

    res.status(200).send("Logged out successfully");
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 */
router.post("/register", async (req, res) => {
  try {
    const { password, ...otherData } = req.body;

    // Validate user input
    try {
      validateUser(req);
    } catch (validationError) {
      return res.status(400).json({ error: validationError.message });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: otherData.email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Save new user
    const user = new User({ ...otherData, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "An error occurred during registration." });
  }
});

/**
 * @route   POST /api/auth/change-password
 * @desc    Change Password
 */
router.post("/change-password", authMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).send("User not found");

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).send("Old password is incorrect");

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.send("Password updated successfully");
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});


module.exports = router;
