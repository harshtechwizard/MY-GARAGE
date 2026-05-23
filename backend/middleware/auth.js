const admin = require("../firebaseAdmin");
const User = require("../models/User");
const Garage = require("../models/Garage");

// Protect routes - require authentication
exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "You are not logged in. Please log in to access this resource."
      });
    }

    // Verify token using Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    if (!decodedToken) {
      return res.status(401).json({
        message: "Invalid or expired token. Please log in again."
      });
    }

    const uid = decodedToken.uid;

    // Check if user/garage exists in our MongoDB
    let currentEntity = await User.findOne({ uid });
    let userType = 'user';
    
    if (!currentEntity) {
      currentEntity = await Garage.findOne({ uid });
      userType = 'garage';
    }

    if (!currentEntity) {
      return res.status(401).json({
        message: "The account belonging to this token no longer exists in our database."
      });
    }

    // Grant access to protected route
    req.user = currentEntity;
    req.userType = userType;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      message: "Authentication failed. Please log in again."
    });
  }
};

// Restrict to specific user types
exports.restrictTo = (...types) => {
  return (req, res, next) => {
    if (!types.includes(req.userType)) {
      return res.status(403).json({
        message: "You do not have permission to perform this action."
      });
    }
    next();
  };
};

// Optional authentication
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (token) {
      const decodedToken = await admin.auth().verifyIdToken(token);
      
      if (decodedToken) {
        const uid = decodedToken.uid;
        let currentEntity = await User.findOne({ uid });
        let userType = 'user';
        
        if (!currentEntity) {
          currentEntity = await Garage.findOne({ uid });
          userType = 'garage';
        }

        if (currentEntity) {
          req.user = currentEntity;
          req.userType = userType;
        }
      }
    }

    next();
  } catch (error) {
    next();
  }
};
