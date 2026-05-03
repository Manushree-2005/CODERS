const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  pharmacyName: String,
  medicine: String,
  quantity: Number,
  status: String,
  txHash: String,
  time: String
});

module.exports = mongoose.model("Stock", stockSchema);