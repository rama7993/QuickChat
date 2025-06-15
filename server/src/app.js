const http = require("http");
const socketIO = require("socket.io");
const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const chatRouter = require("./routes/messages");
const groupRouter = require("./routes/groups");

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/messages", chatRouter);
app.use("/api/groups", groupRouter);

// HTTP Server
const server = http.createServer(app);
// Socket.IO Server
const io = socketIO(server, {
  cors: { origin: "*" },
});
require("./lib/socket")(io);

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
