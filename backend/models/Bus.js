const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  busNumber: String,
  operator: String,
  route: {
    from: String,
    to: String
  },
  departureTime: Date,
  arrivalTime: Date,
  isAC: {
    type: Boolean,
    required: true
  },
  image: {
    type: String, // URL or Cloudinary ID or local path
    required: true
  },
  seats: [
    {
      seatNumber: String, // e.g., "1A"
      isBooked: { type: Boolean, default: false }
    }
  ],
  price: Number
});

module.exports = mongoose.model('Bus', busSchema);
