const mongoose = require("mongoose");

const garageSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: [true, "Firebase UID is required"],
    unique: true
  },
  name: {
    type: String,
    required: [true, "Garage name is required"],
    trim: true,
    maxlength: [100, "Garage name cannot exceed 100 characters"]
  },
  location: {
    type: String,
    required: [true, "Location is required"],
    trim: true,
    maxlength: [200, "Location cannot exceed 200 characters"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"]
  },
  services: {
    type: [String],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: "At least one service must be provided"
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Garage", garageSchema);