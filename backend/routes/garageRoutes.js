const express = require('express');
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { 
  registerGarage, 
  loginGarage, 
  getNearbyGarages,
  getGarageProfile 
} = require('../controllers/garageController');
const { protect, restrictTo } = require("../middleware/auth");
const { 
  validateGarageRegistration, 
  validateGarageLogin 
} = require("../middleware/validation");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many auth attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true
});

// Public routes
router.post('/register', authLimiter, validateGarageRegistration, registerGarage);
router.post('/login', authLimiter, loginGarage);
router.get('/nearby', getNearbyGarages);

// Protected routes
router.get('/profile', protect, restrictTo('garage'), getGarageProfile);

module.exports = router;
