const mongoose = require("mongoose");

const pharmacySchema = new mongoose.Schema({
  name: String,
  city: String,
  lat: Number,
  lng: Number
});

module.exports = mongoose.model("Pharmacy", pharmacySchema);