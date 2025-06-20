const express = require('express');
const router = express.Router();
const Garage = require('../models/Garage');

// Register a new garage
router.post('/register', async (req, res) => {
  try {
    const garage = new Garage(req.body);
    await garage.save();
    res.status(201).json(garage);
  } catch (error) {
    res.status(400).json({ message: 'Error registering garage', error });
  }
});

// Get all garages (simulate "nearby")
router.get('/nearby', async (req, res) => {
  try {
    const garages = await Garage.find();
    res.status(200).json(garages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching garages', error });
  }
});

module.exports = router;
