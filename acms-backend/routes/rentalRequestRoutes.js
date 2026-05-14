// Author: Carl Louis M. Naval
// Module: Machinery Management and Rental Service 
// Description: Subsystem of ACMS for PPAC
// routes/rentalRequestRoutes.js
const express = require('express');
const router = express.Router();
const rentalController = require('../controllers/rentalRequestController');

router.post('/', rentalController.createRentalRequest);
router.get('/', rentalController.getAllRentals);
router.get('/:id', rentalController.getRentalById);
router.put('/:id', rentalController.updateRental);
router.delete('/:id', rentalController.deleteRental);

module.exports = router;