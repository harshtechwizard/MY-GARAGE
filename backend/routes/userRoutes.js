const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { registerUser, loginUser, getProfile } = require("../controllers/userController");
const { protect, restrictTo } = require("../middleware/auth");
const { 
  validateUserRegistration, 
  validateUserLogin 
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
router.post("/register", authLimiter, validateUserRegistration, registerUser);
router.post("/login", authLimiter, loginUser);

// Protected routes
router.get("/profile", protect, restrictTo('user'), getProfile);

module.exports = router;