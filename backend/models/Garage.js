const mongoose = require("mongoose");

const garageSchema = new mongoose.Schema({
  name: String,
  location: String,
  email: String,
  password: String,
  services: [String]
});

module.exports = mongoose.model("Garage", garageSchema);