const { body, param, validationResult } = require("express-validator");

// Middleware to check validation results
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error("Validation failed for request:", req.originalUrl, "Body:", req.body, "Errors:", errors.array());
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// User registration validation
exports.validateUserRegistration = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/).withMessage("Name can only contain letters and spaces"),
  
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email")
    .normalizeEmail(),
  
  exports.validate
];

// User login validation
exports.validateUserLogin = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email")
    .normalizeEmail(),
  
  exports.validate
];

// Garage registration validation
exports.validateGarageRegistration = [
  body("name")
    .trim()
    .notEmpty().withMessage("Garage name is required")
    .isLength({ min: 2, max: 100 }).withMessage("Garage name must be between 2 and 100 characters"),
  
  body("location")
    .trim()
    .notEmpty().withMessage("Location is required")
    .isLength({ min: 2, max: 200 }).withMessage("Location must be between 2 and 200 characters"),
  
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email")
    .normalizeEmail(),
  
  body("services")
    .isArray({ min: 1 }).withMessage("At least one service must be provided")
    .custom((services) => {
      if (services.some(s => typeof s !== 'string' || s.trim().length === 0)) {
        throw new Error("All services must be non-empty strings");
      }
      return true;
    }),
  
  exports.validate
];

// Garage login validation
exports.validateGarageLogin = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email")
    .normalizeEmail(),
  
  exports.validate
];

// Booking creation validation
exports.validateBookingCreation = [
  body("userName")
    .trim()
    .notEmpty().withMessage("User name is required")
    .isLength({ min: 2, max: 100 }).withMessage("User name must be between 2 and 100 characters")
    .matches(/^[a-zA-Z\s]+$/).withMessage("User name can only contain letters and spaces"),
  
  body("phone")
    .trim()
    .notEmpty().withMessage("Phone number is required")
    .matches(/^[\d\s\+\-\(\)]+$/).withMessage("Please provide a valid phone number"),
  
  body("service")
    .trim()
    .notEmpty().withMessage("Service description is required")
    .isLength({ min: 5, max: 500 }).withMessage("Service description must be between 5 and 500 characters"),
  
  body("garageId")
    .notEmpty().withMessage("Garage ID is required")
    .isMongoId().withMessage("Invalid garage ID format"),
  
  exports.validate
];

// Booking status update validation
exports.validateBookingStatusUpdate = [
  body("status")
    .notEmpty().withMessage("Status is required")
    .isIn(["pending", "confirmed", "in-progress", "completed", "cancelled"])
    .withMessage("Invalid status value"),
  
  exports.validate
];

// MongoDB ID validation
exports.validateMongoId = [
  param("id")
    .isMongoId().withMessage("Invalid ID format"),
  
  exports.validate
];

exports.validateGarageId = [
  param("garageId")
    .isMongoId().withMessage("Invalid garage ID format"),
  
  exports.validate
];
