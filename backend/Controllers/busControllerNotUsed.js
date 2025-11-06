const Bus = require('../models/BusNotUsed');

// Get all buses
const getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find();
    res.json(buses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new bus
const createBus = async (req, res) => {
  try {
    const newBus = new Bus(req.body);
    await newBus.save();
    res.status(201).json(newBus);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get a bus by ID
const getBusById = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) return res.status(404).json({ message: 'Bus not found' });
    res.json(bus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a bus
const updateBus = async (req, res) => {
  try {
    const updatedBus = await Bus.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedBus);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a bus
const deleteBus = async (req, res) => {
  try {
    await Bus.findByIdAndDelete(req.params.id);
    res.json({ message: 'Bus deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllBuses,
  createBus,
  getBusById,
  updateBus,
  deleteBus
};
