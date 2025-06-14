const express = require("express");
const router = express.Router();
const Message = require("../models/message");
const { authMiddleware } = require("../middlewares/auth");

// ✅ Get Private Messages
router.get("/private/:userId", authMiddleware, async (req, res) => {
  const { userId } = req.params;
  const userA = req.user._id;
  try {
    const messages = await Message.find({
      $or: [
        { sender: userA, receiver: userId },
        { sender: userId, receiver: userA },
      ],
    })
      .sort({ timestamp: 1 })
      .populate("sender", "firstName lastName photoUrl")
      .populate("receiver", "firstName lastName photoUrl");

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get Group Messages
router.get("/group/:groupId", authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({ group: req.params.groupId })
      .sort({ timestamp: 1 })
      .populate("sender", "firstName lastName photoUrl");

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
