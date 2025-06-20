const Garage = require("../models/Garage");

exports.registerGarage = async (req, res) => {
  const garage = new Garage(req.body);
  await garage.save();
  res.send({ message: "Garage registered" });
};

exports.loginGarage = async (req, res) => {
  const garage = await Garage.findOne(req.body);
  if (garage) res.send({ message: "Login successful", garage });
  else res.status(401).send({ message: "Invalid credentials" });
};

exports.getNearbyGarages = async (req, res) => {
  const garages = await Garage.find(); // Filtering logic can be added
  res.send(garages);
};