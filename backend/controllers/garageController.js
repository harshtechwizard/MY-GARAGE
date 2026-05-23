const Garage = require("../models/Garage");
const admin = require("../firebaseAdmin");

exports.registerGarage = async (req, res) => {
  try {
    const { name, location, email, services } = req.body;

    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;

    const existingGarage = await Garage.findOne({ uid });
    if (existingGarage) {
      return res.status(400).json({ 
        message: "Garage already exists" 
      });
    }

    const garage = await Garage.create({
      uid,
      name,
      location,
      email,
      services
    });

    res.status(201).json({ 
      message: "Garage registered successfully",
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
    res.status(400).json({ 
      message: "Error registering garage", 
      error: error.message 
    });
  }
};

exports.loginGarage = async (req, res) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;

    const garage = await Garage.findOne({ uid });
    
    if (!garage) {
      return res.status(404).json({ 
        message: "Garage not found in database. Please register first." 
      });
    }

    res.json({ 
      message: "Login successful",
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
    const garages = await Garage.find();
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