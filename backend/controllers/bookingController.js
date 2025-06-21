const Booking = require("../models/Booking");

exports.createBooking = async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(400).json({ message: "Error creating booking", error: error.message });
  }
};

exports.getGarageBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ garageId: req.params.garageId });
    res.json(bookings);
  } catch (error) {
    console.error('Get garage bookings error:', error);
    res.status(500).json({ message: "Error fetching bookings", error: error.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status },
      { new: true }
    );
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json({ message: "Status updated successfully", booking });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ message: "Error updating booking status", error: error.message });
  }
};