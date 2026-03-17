const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const garageSchema = new mongoose.Schema({
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
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false // Don't return password by default
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

// Hash password before saving
garageSchema.pre("save", async function(next) {
  // Only hash if password is modified
  if (!this.isModified("password")) return next();
  
  // Hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to compare passwords
garageSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
garageSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("Garage", garageSchema);