const Message = require("../models/message");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 Connected:", socket.id);

    socket.on("join room", (roomId) => {
      socket.join(roomId);
      console.log(`➡️ Joined room: ${roomId}`);
    });

    socket.on("leave room", (roomId) => {
      socket.leave(roomId);
      console.log(`⬅️ Left room: ${roomId}`);
    });

    socket.on("chat message", async ({ roomId, message }) => {
      console.log("Received chat message event:", roomId, message);
      try {
        const newMessage = new Message({
          sender: message.senderId,
          receiver: message.receiverId || null,
          group: message.groupId || null,
          content: message.content,
          timestamp: new Date(),
        });

        await newMessage.save();

        io.to(roomId).emit("chat message", {
          ...message,
          _id: newMessage._id,
          timestamp: newMessage.timestamp,
        });

        console.log(`📨 Message saved & broadcasted in ${roomId}`);
      } catch (err) {
        console.error("❌ Message save error:", err.message);
      }
    });

    socket.on("typing", ({ roomId, user }) => {
      socket.to(roomId).emit("typing", { user });
    });

    socket.on("disconnect", () => {
      console.log("🔴 Disconnected:", socket.id);
    });
  });
};
