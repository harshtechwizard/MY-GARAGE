const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userName: String,
  phone: String,
  service: String,
  garageId: String,
  status: { type: String, default: "Pending" }
});

module.exports = mongoose.model("Booking", bookingSchema);