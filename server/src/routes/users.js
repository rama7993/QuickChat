const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { authMiddleware } = require("../middlewares/auth");
const { validateUser } = require("../utils/validation");

/**
 * @route   GET /api/users
 * @desc    Get all users
 */
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

/**
 * @route   GET /api/users/me
 * @desc    Get current authenticated user
 */
router.get("/me", authMiddleware, async (req, res) => {
  res.status(200).json(req.user);
});

/**
 * @route   GET /api/users/:id
 * @desc    Get a user by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send("User not found");
    res.status(200).json(user);
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

/**
 * @route   PUT /api/users/:id
 * @desc    Fully update a user by ID
 */
router.put("/:id", async (req, res) => {
  try {
    validateUser(req);
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) return res.status(404).send("User not found");
    res.status(200).send("User updated successfully!");
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

/**
 * @route   PATCH /api/users/:id
 * @desc    Partially update a user by ID
 */
router.patch("/:id", async (req, res) => {
  try {
    validateUser(req);
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) return res.status(404).send("User not found");
    res.status(200).send("User partially updated!");
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

module.exports = router;
