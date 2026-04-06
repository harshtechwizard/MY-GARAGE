const Booking = require("../models/Booking");
const Garage = require("../models/Garage");

exports.createBooking = async (req, res) => {
  try {
    const { userName, phone, service, garageId } = req.body;

    // Verify garage exists
    const garage = await Garage.findById(garageId);
    if (!garage) {
      return res.status(404).json({ 
        message: "Garage not found" 
      });
    }

    // Create booking
    const booking = await Booking.create({
      userId: req.userType === "user" ? req.user?._id : undefined,
      userName,
      phone,
      service,
      garageId,
      status: "pending"
    });

    res.status(201).json({ 
      message: "Booking created successfully", 
      booking 
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(400).json({ 
      message: "Error creating booking", 
      error: error.message 
    });
  }
};

exports.getGarageBookings = async (req, res) => {
  try {
    const { garageId } = req.params;

    // A garage can only view its own bookings
    if (String(req.user?._id) !== String(garageId)) {
      return res.status(403).json({
        message: "You do not have permission to view these bookings."
      });
    }

    // Verify garage exists
    const garage = await Garage.findById(garageId);
    if (!garage) {
      return res.status(404).json({ 
        message: "Garage not found" 
      });
    }

    // Get bookings for this garage
    const bookings = await Booking.find({ garageId })
      .sort({ createdAt: -1 }); // Most recent first

    res.json(bookings);
  } catch (error) {
    console.error('Get garage bookings error:', error);
    res.status(500).json({ 
      message: "Error fetching bookings", 
      error: error.message 
    });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const existing = await Booking.findById(id);
    if (!existing) {
      return res.status(404).json({ 
        message: "Booking not found" 
      });
    }

    // A garage can only update status for its own bookings
    if (String(existing.garageId) !== String(req.user?._id)) {
      return res.status(403).json({
        message: "You do not have permission to update this booking."
      });
    }

    // Update booking
    existing.status = status;
    existing.updatedAt = Date.now();
    const booking = await existing.save();

    res.json({ 
      message: "Booking status updated successfully", 
      booking 
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ 
      message: "Error updating booking status", 
      error: error.message 
    });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user?._id })
      .populate('garageId', 'name location')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({ 
      message: "Error fetching bookings", 
      error: error.message 
    });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ 
        message: "Booking not found" 
      });
    }

    const isGarageOwner = req.userType === "garage" && String(booking.garageId) === String(req.user?._id);
    const isUserOwner = req.userType === "user" && booking.userId && String(booking.userId) === String(req.user?._id);

    if (!isGarageOwner && !isUserOwner) {
      return res.status(403).json({
        message: "You do not have permission to delete this booking."
      });
    }

    await booking.deleteOne();

    res.json({ 
      message: "Booking deleted successfully" 
    });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({ 
      message: "Error deleting booking", 
      error: error.message 
    });
  }
};