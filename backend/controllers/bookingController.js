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

    // Find and update booking
    const booking = await Booking.findByIdAndUpdate(
      id, 
      { status, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({ 
        message: "Booking not found" 
      });
    }

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
    // This would require user authentication
    // For now, return all bookings (in production, filter by user)
    const bookings = await Booking.find()
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

    const booking = await Booking.findByIdAndDelete(id);

    if (!booking) {
      return res.status(404).json({ 
        message: "Booking not found" 
      });
    }

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