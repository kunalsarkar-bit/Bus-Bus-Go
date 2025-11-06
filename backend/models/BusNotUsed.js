const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
    busNumber: { type: String, required: true, unique: true },  // Ensure this is unique
    busName: { type: String, required: true },
    price: { type: Number, required: true },
    seatsAvailable: [{ type: Number }],
    travelTime: { type: String, required: true },
    arrivalTime: { type: String, required: true },
    departureTime: { type: String, required: true },
    isAC: { type: Boolean, required: true }
  }, { timestamps: true });
  
  module.exports = mongoose.model('Bus', busSchema);
  