// Author: Carl Louis M. Naval
// Module: Machinery Management and Rental Service 
// Description: Subsystem of ACMS for PPAC
// routes/machineTypeRoutes.js
const express = require('express');
const router = express.Router();
const typeController = require('../controllers/machineTypeController');

router.post('/', typeController.createMachineType);
router.get('/', typeController.getMachineTypes);
router.put('/:id', typeController.updateMachineType);
router.delete('/:id', typeController.deleteMachineType);

module.exports = router;