const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  quantity: Number,
  date: Date,
  blockchainHash: String
});

const medicineSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  pharmacy: String,
  lat: Number,
  lng: Number,
  blockchainHash: String,
  lastUpdated: Date,
  history: [historySchema] // ✅ NEW
});

module.exports = mongoose.model("Medicine", medicineSchema);