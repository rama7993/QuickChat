const express = require("express");
const router = express.Router();

const User = require("../models/user");
router.post("/signup", async (req, res) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    console.log("User saved:", savedUser);
    res.status(201).send("User added!");
  } catch (error) {
    console.error(error);
    res.status(400).send("Error: " + error.message);
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

module.exports = router;
