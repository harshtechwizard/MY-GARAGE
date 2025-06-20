const Booking = require("../models/Booking");

exports.createBooking = async (req, res) => {
  const booking = new Booking(req.body);
  await booking.save();
  res.send({ message: "Booking created" });
};

exports.getGarageBookings = async (req, res) => {
  const bookings = await Booking.find({ garageId: req.params.garageId });
  res.send(bookings);
};

exports.updateBookingStatus = async (req, res) => {
  await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status });
  res.send({ message: "Status updated" });
};