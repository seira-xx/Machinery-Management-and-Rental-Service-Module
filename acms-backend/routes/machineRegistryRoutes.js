// Author: Carl Louis M. Naval
// Module: Machinery Management and Rental Service 
// Description: Subsystem of ACMS for PPAC
// routes/machineRegistryRoutes.js
const express = require('express');
const router = express.Router();
const registryController = require('../controllers/machineRegistryController');

router.get('/summary', registryController.getMachineDashboardSummary);

router.put('/status/:id', registryController.updateMachineStatusOnly);

router.post('/', registryController.addMachineToRegistry);
router.get('/', registryController.getAllRegisteredMachines);
router.put('/:id', registryController.updateMachineInRegistry);
router.delete('/:id', registryController.deleteMachineFromRegistry);


module.exports = router;