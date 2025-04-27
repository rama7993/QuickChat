const express = require("express");
const connectDB = require("./config/database");

const app = express();
const port = process.env.PORT || 3000;
const usersRouter = require("./routes/user");

//Middlewares
app.use(express.json());

//Routes
app.use("/", usersRouter);

// Connect to database, then start server
connectDB()
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("DB connection error:", err);
  });
