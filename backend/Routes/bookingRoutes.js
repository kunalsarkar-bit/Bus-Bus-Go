const express = require('express');
const router = express.Router();
const bookingController = require('../Controllers/bookingController');

router.post('/book', bookingController.bookSeats);
router.get('/available-seats/:busId', bookingController.getAvailableSeats);

module.exports = router;
