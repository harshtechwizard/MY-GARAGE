const Garage = require("../models/Garage");
const { generateToken } = require("../middleware/auth");

exports.registerGarage = async (req, res) => {
  try {
    const { name, location, email, password, services } = req.body;

    // Check if garage already exists
    const existingGarage = await Garage.findOne({ email });
    if (existingGarage) {
      return res.status(400).json({ 
        message: "Garage with this email already exists" 
      });
    }

    // Create new garage (password will be hashed by pre-save hook)
    const garage = await Garage.create({
      name,
      location,
      email,
      password,
      services
    });

    // Generate JWT token
    const token = generateToken(garage._id, 'garage');

    res.status(201).json({ 
      message: "Garage registered successfully",
      token,
      garage: {
        id: garage._id,
        name: garage.name,
        location: garage.location,
        email: garage.email,
        services: garage.services
      }
    });
  } catch (error) {
    console.error('Garage registration error:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: "Garage with this email already exists" 
      });
    }
    
    res.status(400).json({ 
      message: "Error registering garage", 
      error: error.message 
    });
  }
};

exports.loginGarage = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find garage and explicitly select password field
    const garage = await Garage.findOne({ email }).select("+password");
    
    if (!garage) {
      return res.status(401).json({ 
        message: "Invalid email or password" 
      });
    }

    // Check if password is correct
    const isPasswordCorrect = await garage.comparePassword(password);
    
    if (!isPasswordCorrect) {
      return res.status(401).json({ 
        message: "Invalid email or password" 
      });
    }

    // Generate JWT token
    const token = generateToken(garage._id, 'garage');

    res.json({ 
      message: "Login successful",
      token,
      garage: {
        id: garage._id,
        name: garage.name,
        location: garage.location,
        email: garage.email,
        services: garage.services
      }
    });
  } catch (error) {
    console.error('Garage login error:', error);
    res.status(500).json({ 
      message: "Error during login", 
      error: error.message 
    });
  }
};

exports.getNearbyGarages = async (req, res) => {
  try {
    // Get all garages (in production, add geolocation filtering)
    const garages = await Garage.find().select("-password");
    
    res.json(garages);
  } catch (error) {
    console.error('Get nearby garages error:', error);
    res.status(500).json({ 
      message: "Error fetching garages", 
      error: error.message 
    });
  }
};

exports.getGarageProfile = async (req, res) => {
  try {
    // req.user is set by the protect middleware
    res.json({
      garage: {
        id: req.user._id,
        name: req.user.name,
        location: req.user.location,
        email: req.user.email,
        services: req.user.services,
        createdAt: req.user.createdAt
      }
    });
  } catch (error) {
    console.error('Get garage profile error:', error);
    res.status(500).json({ 
      message: "Error fetching profile", 
      error: error.message 
    });
  }
};