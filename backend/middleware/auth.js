const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Garage = require("../models/Garage");

// Generate JWT token
exports.generateToken = (id, type = 'user') => {
  return jwt.sign({ id, type }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });
};

// Verify JWT token
exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Protect routes - require authentication
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "You are not logged in. Please log in to access this resource."
      });
    }

    // Verify token
    const decoded = exports.verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({
        message: "Invalid or expired token. Please log in again."
      });
    }

    // Check if user/garage still exists
    let currentEntity;
    if (decoded.type === 'user') {
      currentEntity = await User.findById(decoded.id);
    } else if (decoded.type === 'garage') {
      currentEntity = await Garage.findById(decoded.id);
    }

    if (!currentEntity) {
      return res.status(401).json({
        message: "The account belonging to this token no longer exists."
      });
    }

    // Grant access to protected route
    req.user = currentEntity;
    req.userType = decoded.type;
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

// Optional authentication - doesn't fail if no token
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (token) {
      const decoded = exports.verifyToken(token);
      
      if (decoded) {
        let currentEntity;
        if (decoded.type === 'user') {
          currentEntity = await User.findById(decoded.id);
        } else if (decoded.type === 'garage') {
          currentEntity = await Garage.findById(decoded.id);
        }

        if (currentEntity) {
          req.user = currentEntity;
          req.userType = decoded.type;
        }
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};
