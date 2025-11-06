const Bus = require('../models/Bus');
const Booking = require('../models/Booking');

exports.bookSeats = async (req, res) => {
  const { userId, busId, seats } = req.body;

  try {
    const bus = await Bus.findById(busId);

    const unavailableSeats = bus.seats.filter(seat =>
      seats.includes(seat.seatNumber) && seat.isBooked
    );

    if (unavailableSeats.length > 0) {
      return res.status(400).json({
        message: 'Some seats are already booked.',
        seats: unavailableSeats.map(s => s.seatNumber)
      });
    }

    // Mark seats as booked
    bus.seats.forEach(seat => {
      if (seats.includes(seat.seatNumber)) {
        seat.isBooked = true;
      }
    });

    await bus.save();

    const totalAmount = bus.price * seats.length;

    const booking = new Booking({
      userId,
      busId,
      seatsBooked: seats,
      totalAmount
    });

    await booking.save();

    res.status(201).json({
      message: 'Seats booked successfully',
      booking
    });

  } catch (error) {
    res.status(500).json({ message: 'Booking failed', error });
  }
};


exports.getAvailableSeats = async (req, res) => {
  const { busId } = req.params;

  try {
    const bus = await Bus.findById(busId);

    const availableSeats = bus.seats.filter(seat => !seat.isBooked);

    res.json(availableSeats);

  } catch (error) {
    res.status(500).json({ message: 'Error fetching seats', error });
  }
};
