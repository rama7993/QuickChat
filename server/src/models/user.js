const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: String,
  lastname: String,
  email: String,
  password: String,
});

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
