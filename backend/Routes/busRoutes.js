const express = require('express');
const router = express.Router();

const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinaryConfig');
const upload = require('../config/multerConfig');
const busController = require('../Controllers/busController');

router.post('/add', upload.single('image'), busController.createBus);

module.exports = router;

router.get('/', busController.getAllBuses);

// @route GET /api/buses/:id
router.get('/:id', busController.getBusById);
