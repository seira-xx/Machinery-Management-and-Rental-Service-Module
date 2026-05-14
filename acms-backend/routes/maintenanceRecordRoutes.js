// Author: Carl Louis M. Naval
// Module: Machinery Management and Rental Service 
// Description: Subsystem of ACMS for PPAC
// routes/maintenanceRecordRoutes.js
const express = require('express');
const router = express.Router();
const recordController = require('../controllers/maintenanceRecordController');

router.post('/', recordController.createMaintenanceRecord);
router.get('/', recordController.getAllMaintenanceRecords);
router.put('/:id', recordController.updateMaintenanceRecord);
router.delete('/:id', recordController.deleteMaintenanceRecord);

module.exports = router;