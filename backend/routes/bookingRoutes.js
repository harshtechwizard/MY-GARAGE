const express = require("express");
const router = express.Router();
const { 
  createBooking, 
  getGarageBookings, 
  updateBookingStatus,
  getUserBookings,
  deleteBooking
} = require("../controllers/bookingController");
const { protect, restrictTo, optionalAuth } = require("../middleware/auth");
const { 
  validateBookingCreation, 
  validateBookingStatusUpdate,
  validateMongoId,
  validateGarageId
} = require("../middleware/validation");

// Public/authenticated routes
router.post("/", validateBookingCreation, optionalAuth, createBooking);

// Protected routes - user only
router.get("/user/my-bookings", protect, restrictTo('user'), getUserBookings);

// Protected routes - garage only
router.get("/:garageId", validateGarageId, protect, restrictTo('garage'), getGarageBookings);
router.put("/status/:id", validateMongoId, validateBookingStatusUpdate, protect, restrictTo('garage'), updateBookingStatus);

// Protected routes - both user and garage
router.delete("/:id", validateMongoId, protect, deleteBooking);

module.exports = router;