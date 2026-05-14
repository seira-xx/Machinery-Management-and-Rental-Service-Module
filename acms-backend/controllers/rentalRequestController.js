// Author: Carl Louis M. Naval
// Module: Machinery Management and Rental Service 
// Description: Subsystem of ACMS for PPAC
// controllers/rentalRequestController.js
const db = require('../config/db');

// CREATE
exports.createRentalRequest = async (req, res) => {
    try {
        const { member_id, machine_id, user_id, rental_purpose, date_rented, rental_status } = req.body;

        // Enum Validation
        const validStatuses = ['Pending', 'Approved', 'Disapproved'];
        if (rental_status && !validStatuses.includes(rental_status)) {
            return res.status(400).json({ message: "Invalid rental_status." });
        }

        const query = `INSERT INTO rental_requests (member_id, machine_id, user_id, rental_purpose, date_rented, rental_status) VALUES (?, ?, ?, ?, ?, ?)`;
        await db.execute(query, [member_id, machine_id, user_id, rental_purpose, date_rented, rental_status || 'Pending']);
        
        res.status(201).json({ message: "Rental request submitted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// READ ALL
exports.getAllRentals = async (req, res) => {
    try {
        const query = `SELECT * FROM rental_requests`;
        const [rows] = await db.execute(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// READ: Get rental by ID
exports.getRentalById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.execute('SELECT * FROM rental_requests WHERE rental_id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ message: "Rental record not found" });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// UPDATE
exports.updateRental = async (req, res) => {
    try {
        const { id } = req.params;
        const { member_id, machine_id, user_id, rental_purpose, date_rented, rental_status } = req.body;

        // 1. Update the Rental Request status
        const updateQuery = `
            UPDATE rental_requests 
            SET member_id = ?, machine_id = ?, user_id = ?, rental_purpose = ?, date_rented = ?, rental_status = ? 
            WHERE rental_id = ?`;
        
        const [result] = await db.execute(updateQuery, [member_id, machine_id, user_id, rental_purpose, date_rented, rental_status, id]);

        if (result.affectedRows === 0) return res.status(404).json({ message: "Rental not found" });

        // 2. TRIGGER PAYMENT CREATION: If the request is Approved, create the payment record
        if (rental_status === 'Approved') {
            // Check if a payment record already exists for this rental to avoid duplicates
            const [existing] = await db.execute('SELECT * FROM rental_payments WHERE rental_id = ?', [id]);
            
            if (existing.length === 0) {
                const paymentQuery = `
                    INSERT INTO rental_payments (rental_id, payment_date, rental_usage, payment_status) 
                    VALUES (?, NULL, NULL, 'Pending')`;
                await db.execute(paymentQuery, [id]);
            }
        }

        res.json({ message: "Rental updated and payment record initialized" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE
exports.deleteRental = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.execute('DELETE FROM rental_requests WHERE rental_id = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Rental record deleted" });
        res.json({ message: "Rental deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};