// acms-backend/server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Importing routes
const authRoutes = require('./routes/authRoutes');
const memberRoutes = require('./routes/memberRoutes');
const machineTypeRoutes = require('./routes/machineTypeRoutes');
const machineRegistryRoutes = require('./routes/machineRegistryRoutes');
const machineRateRoutes = require('./routes/machineRateRoutes');
const rentalRequestRoutes = require('./routes/rentalRequestRoutes');
const maintenanceTypeRoutes = require('./routes/maintenanceTypeRoutes');
const maintenanceRecordRoutes = require('./routes/maintenanceRecordRoutes');
const rentalPaymentRoutes = require('./routes/rentalPaymentRoutes');


const app = express();

// Middleware
app.use(helmet());
app.use(cors());

app.use(express.json()); // Reminders: Essential for React to send JSON to Node

// Basic Route for testing purposes
app.get('/', (req, res) => {
    res.send('ACMS API is running...');
});

// Routes for Authentication and User and Member Management for testing purposes
// Note: These two routes are not part of Machinery Management and Rental Service,
// but essential for user authentication and member management in the overall ACMS system
app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);


// Routes for Machine Types and Machine Registry
app.use('/api/machine-types', machineTypeRoutes);
app.use('/api/machine-registry', machineRegistryRoutes);

// Routes for Machine Rates and Rental Requests
app.use('/api/machine-rates', machineRateRoutes);
app.use('/api/rental-requests', rentalRequestRoutes);

// Routes for Maintenance Types, Maintenance Records, and Machine Rental Payment
app.use('/api/maintenance-types', maintenanceTypeRoutes);
app.use('/api/maintenance-records', maintenanceRecordRoutes);
app.use('/api/rental-payments', rentalPaymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});