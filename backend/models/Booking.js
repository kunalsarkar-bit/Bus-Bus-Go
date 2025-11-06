const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  busId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus'
  },
  seatsBooked: [String], // ["1A", "1B"]
  totalAmount: Number,
  bookingTime: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
