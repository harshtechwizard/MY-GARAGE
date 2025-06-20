const User = require("../models/User");

exports.registerUser = async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.send({ message: "User registered" });
};

exports.loginUser = async (req, res) => {
  const user = await User.findOne(req.body);
  if (user) res.send({ message: "Login successful", user });
  else res.status(401).send({ message: "Invalid credentials" });
};