const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false
  },
  userName: {
    type: String,
    required: [true, "User name is required"],
    trim: true,
    maxlength: [100, "User name cannot exceed 100 characters"]
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    trim: true,
    match: [/^[\d\s\+\-\(\)]+$/, "Please provide a valid phone number"]
  },
  service: {
    type: String,
    required: [true, "Service description is required"],
    trim: true,
    maxlength: [500, "Service description cannot exceed 500 characters"]
  },
  garageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Garage",
    required: [true, "Garage ID is required"]
  },
  status: { 
    type: String, 
    enum: ["pending", "confirmed", "in-progress", "completed", "cancelled"],
    default: "pending" 
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

bookingSchema.index({ garageId: 1, createdAt: -1 });
bookingSchema.index({ userId: 1, createdAt: -1 });

// Update the updatedAt timestamp before saving
bookingSchema.pre("save", function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Booking", bookingSchema);