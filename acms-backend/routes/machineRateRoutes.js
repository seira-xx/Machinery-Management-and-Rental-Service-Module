// Author: Carl Louis M. Naval
// Module: Machinery Management and Rental Service 
// Description: Subsystem of ACMS for PPAC
// routes/machineRateRoutes.js
const express = require('express');
const router = express.Router();
const rateController = require('../controllers/machineRateController');

router.post('/', rateController.createRate);
router.get('/', rateController.getAllRates);
router.put('/:id', rateController.updateRate);
router.delete('/:id', rateController.deleteRate);

module.exports = router;