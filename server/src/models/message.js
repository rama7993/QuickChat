const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

messageSchema.pre("save", function (next) {
  if (!this.receiver && !this.group) {
    return next(new Error("Either receiver or group must be specified."));
  }
  if (this.receiver && this.group) {
    return next(new Error("Cannot have both receiver and group in message."));
  }
  next();
});

module.exports = mongoose.model("Message", messageSchema);
