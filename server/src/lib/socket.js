const socket = require("socket.io");

const socketInit = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:4200/",
    },
  });

  io.on("connection", (socket) => {
    socket.on("sendMessage", () => {});
    socket.on("disconnect", () => {});
  });
};

module.exports = socketInit;
