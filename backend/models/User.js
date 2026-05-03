const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  phone: String,
  medicine: String
});

module.exports = mongoose.model("User", userSchema);