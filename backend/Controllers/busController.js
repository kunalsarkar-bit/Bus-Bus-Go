const Bus = require('../models/Bus');
const fs = require('fs');
const { uploadToCloudinary } = require('../config/cloudinaryConfig');

exports.createBus = async (req, res) => {
  try {
    const {
      busNumber,
      operator,
      from,
      to,
      departureTime,
      arrivalTime,
      price,
      isAC
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Bus image is required.' });
    }

    // Upload image to Cloudinary
    const uploadResult = await uploadToCloudinary(req.file.path, "bus_images");

    // Generate seat layout
    const seatLayout = [];
    for (let row = 1; row <= 10; row++) {
      ['A', 'B', 'C', 'D'].forEach(letter => {
        seatLayout.push({ seatNumber: `${row}${letter}` });
      });
    }

    const newBus = new Bus({
      busNumber,
      operator,
      route: { from, to },
      departureTime,
      arrivalTime,
      isAC,
      image: uploadResult.secure_url,
      seats: seatLayout,
      price
    });

    await newBus.save();

    // Delete local file after upload
    fs.unlinkSync(req.file.path);

    res.status(201).json({ message: 'Bus created successfully', bus: newBus });
  } catch (err) {
    console.error('Error creating bus:', err);
    res.status(500).json({ message: 'Internal server error', error: err });
  }
};

// @route GET /api/buses
exports.getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find()
      .select('busNumber operator route departureTime arrivalTime isAC image price')
      .lean();
    
    // Format the data for the frontend
    const formattedBuses = buses.map(bus => ({
      id: bus._id,
      busNumber: bus.busNumber,
      operator: bus.operator,
      from: bus.route.from,
      to: bus.route.to,
      departureTime: bus.departureTime,
      arrivalTime: bus.arrivalTime,
      isAC: bus.isAC,
      image: bus.image,
      price: bus.price
    }));

    res.json(formattedBuses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @route GET /api/buses/:id
exports.getBusById = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id)
      .select('busNumber operator route departureTime arrivalTime isAC image seats price')
      .lean();
    
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    res.json({
      ...bus,
      id: bus._id,
      from: bus.route.from,
      to: bus.route.to
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};