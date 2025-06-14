const express = require("express");
const router = express.Router();
const Message = require("../models/message");

// GET messages between two users
// URL: /api/messages/:userId1/:userId2
router.get("/:userId1/:userId2", async (req, res) => {
  const { userId1, userId2 } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { sender: userId1, receiver: userId2 },
        { sender: userId2, receiver: userId1 },
      ],
    }).sort({ timestamp: 1 }); // ascending by timestamp

    res.json(messages);
  } catch (err) {
    console.error("Failed to fetch messages:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST new message
// URL: /api/messages
router.post("/", async (req, res) => {
  try {
    const { sender, receiver, content, group } = req.body;

    if (!sender || !content) {
      return res.status(400).json({ error: "Sender and content are required" });
    }

    const newMessage = new Message({
      sender,
      receiver: receiver || null,
      group: group || null,
      content,
      timestamp: new Date(),
    });

    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (err) {
    console.error("Failed to save message:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
