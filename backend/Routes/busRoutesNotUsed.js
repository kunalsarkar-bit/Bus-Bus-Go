const express = require('express');
const router = express.Router();
const {
  getAllBuses,
  createBus,
  getBusById,
  updateBus,
  deleteBus
} = require('../Controllers/busControllerNotUsed');

router.get('/', getAllBuses);
router.post('/', createBus);
router.get('/:id', getBusById);
router.put('/:id', updateBus);
router.delete('/:id', deleteBus);

module.exports = router;
