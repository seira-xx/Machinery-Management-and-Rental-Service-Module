// Author: Carl Louis M. Naval
// Module: Machinery Management and Rental Service 
// Description: Subsystem of ACMS for PPAC
// routes/maintenanceTypeRoutes.js
const express = require('express');
const router = express.Router();
const maintenanceTypeController = require('../controllers/maintenanceTypeController');

router.post('/', maintenanceTypeController.createMaintenanceType); 
router.get('/', maintenanceTypeController.getMaintenanceTypes);   
router.put('/:id', maintenanceTypeController.updateMaintenanceType); 
router.delete('/:id', maintenanceTypeController.deleteMaintenanceType);

module.exports = router;