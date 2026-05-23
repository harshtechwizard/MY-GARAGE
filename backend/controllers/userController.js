const User = require("../models/User");
const admin = require("../firebaseAdmin");

exports.registerUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    // Get token from header
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify token
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;

    // Check if user already exists
    const existingUser = await User.findOne({ uid });
    if (existingUser) {
      return res.status(400).json({ 
        message: "User already exists" 
      });
    }

    // Create new user
    const user = await User.create({
      uid,
      name,
      email
    });

    res.status(201).json({ 
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('User registration error:', error);
    res.status(400).json({ 
      message: "Error registering user", 
      error: error.message 
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify token
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;

    // Find user
    const user = await User.findOne({ uid });
    
    if (!user) {
      return res.status(404).json({ 
        message: "User not found in database. Please register first." 
      });
    }

    res.json({ 
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('User login error:', error);
    res.status(500).json({ 
      message: "Error during login", 
      error: error.message 
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    // req.user is set by the protect middleware
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        createdAt: req.user.createdAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      message: "Error fetching profile", 
      error: error.message 
    });
  }
};