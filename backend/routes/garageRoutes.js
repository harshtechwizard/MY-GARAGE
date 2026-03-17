const express = require('express');
const router = express.Router();
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

// Public routes
router.post('/register', validateGarageRegistration, registerGarage);
router.post('/login', validateGarageLogin, loginGarage);
router.get('/nearby', getNearbyGarages);

// Protected routes
router.get('/profile', protect, restrictTo('garage'), getGarageProfile);

module.exports = router;
