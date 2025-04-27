require("dotenv").config();
const mongoose = require("mongoose");
const URI = process.env.MONGO_URI;

const connectDB = async () => {
  await mongoose.connect(URI);
};

module.exports = connectDB;
