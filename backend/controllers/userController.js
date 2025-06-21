const User = require("../models/User");

exports.registerUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error('User registration error:', error);
    res.status(400).json({ message: "Error registering user", error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const user = await User.findOne(req.body);
    if (user) {
      res.json({ message: "Login successful", user });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error('User login error:', error);
    res.status(500).json({ message: "Error during login", error: error.message });
  }
};