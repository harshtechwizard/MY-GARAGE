const express = require("express");
const router = express.Router();
const { createBooking, getGarageBookings, updateBookingStatus } = require("../controllers/bookingController");

router.post("/", createBooking);
router.get("/:garageId", getGarageBookings);
router.put("/status/:id", updateBookingStatus);

module.exports = router;