const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getProfile } = require("../controllers/userController");
const { protect, restrictTo } = require("../middleware/auth");
const { 
  validateUserRegistration, 
  validateUserLogin 
} = require("../middleware/validation");

// Public routes
router.post("/register", validateUserRegistration, registerUser);
router.post("/login", validateUserLogin, loginUser);

// Protected routes
router.get("/profile", protect, restrictTo('user'), getProfile);

module.exports = router;