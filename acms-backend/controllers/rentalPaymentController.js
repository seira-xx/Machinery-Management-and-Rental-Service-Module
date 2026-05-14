// Author: Carl Louis M. Naval
// Module: Machinery Management and Rental Service 
// Description: Subsystem of ACMS for PPAC
// controllers/rentalPaymentController.js
const db = require('../config/db');

// 1. GET ALL PAYMENTS 
exports.getAllPayments = async (req, res) => {
    try {
        const query = `
            SELECT 
                rp.rental_payment_id, 
                rp.payment_date, 
                rp.rental_usage, 
                rp.payment_status,
                m.member_id,
                m.member_fname, 
                m.member_lname,
                mt.machine_type_name,
                mrates.rate_amount AS rental_rate
            FROM rental_payments rp
            LEFT JOIN rental_requests rr ON rp.rental_id = rr.rental_id
            LEFT JOIN members m ON rr.member_id = m.member_id
            LEFT JOIN machine_registry mreg ON rr.machine_id = mreg.machine_id
            LEFT JOIN machine_types mt ON mreg.machine_type_id = mt.machine_type_id
            LEFT JOIN machine_rates mrates ON mreg.machine_id = mrates.machine_id 
                AND mrates.rate_type = 'hour' -- THIS PREVENTS DUPLICATES
            ORDER BY rp.rental_payment_id DESC`;
            
        const [rows] = await db.execute(query);
        res.json(rows);
    } catch (error) {
        console.error("Database Query Error:", error.message);
        res.status(500).json({ error: error.message });
    }
};

// 2. CREATE PAYMENT
exports.createPayment = async (req, res) => {
    try {
        const { rental_id, payment_date, rental_usage, payment_status } = req.body;
        const query = `INSERT INTO rental_payments (rental_id, payment_date, rental_usage, payment_status) VALUES (?, ?, ?, ?)`;
        await db.execute(query, [rental_id, payment_date, rental_usage, payment_status || 'Pending']);
        res.status(201).json({ message: "Rental payment record created" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. GET BY ID 
exports.getPaymentById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.execute('SELECT * FROM rental_payments WHERE rental_payment_id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ message: "Payment record not found" });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. UPDATE PAYMENT 
exports.updatePayment = async (req, res) => {
    try {
        const { id } = req.params;
        const { payment_date, rental_usage, payment_status } = req.body;
        const query = `
            UPDATE rental_payments 
            SET payment_date = ?, rental_usage = ?, payment_status = ? 
            WHERE rental_payment_id = ?`;
        const [result] = await db.execute(query, [payment_date || null, rental_usage || null, payment_status, id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Payment record not found" });
        res.json({ message: "Payment updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 5. DELETE PAYMENT 
exports.deletePayment = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.execute('DELETE FROM rental_payments WHERE rental_payment_id = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Payment record not found" });
        res.json({ message: "Payment record deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};