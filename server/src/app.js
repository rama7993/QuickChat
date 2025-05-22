const http = require("http");
const socketIO = require("socket.io");
const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);

// HTTP Server
const server = http.createServer(app);

// Socket.IO Server
const io = socketIO(server, {
  cors: {
    origin: "*",
  },
});

// Socket Logic
io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("chat message", async (msg) => {
    console.log("Received from client:", msg);
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// DB connection + server start
connectDB()
  .then(() => {
    console.log("Connected to MongoDB");
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });
