// Author: Carl Louis M. Naval
// Module: Machinery Management and Rental Service 
// Description: Subsystem of ACMS for PPAC
// controllers/machineRateController.js
const db = require('../config/db');

// CREATE
exports.createRate = async (req, res) => {
    try {
        const { machine_id, rate_amount, rate_type } = req.body;

        const validRateTypes = ['hour', 'bag'];
        if (!validRateTypes.includes(rate_type)) {
            return res.status(400).json({ message: "Invalid rate_type. Use 'hour' or 'bag'." });
        }

        const query = `
            INSERT INTO machine_rates (machine_id, rate_amount, rate_type) 
            VALUES (?, ?, ?)`;
            
        await db.execute(query, [machine_id, rate_amount, rate_type]);
        
        res.status(201).json({ message: "Machine rate created successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// READ ALL 
exports.getAllRates = async (req, res) => {
    try {
        const query = `
            SELECT 
                mr.rate_id,
                mr.machine_id,
                mr.rate_amount,
                mr.rate_type,
                mt.machine_type_name, 
                mt.machine_brand 
            FROM machine_rates mr
            JOIN machine_registry reg ON mr.machine_id = reg.machine_id
            JOIN machine_types mt ON reg.machine_type_id = mt.machine_type_id
            ORDER BY mr.rate_id DESC`;
            
        const [rows] = await db.execute(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// UPDATE
exports.updateRate = async (req, res) => {
    try {
        const { id } = req.params;
        const { machine_id, rate_amount, rate_type } = req.body;

        const query = `UPDATE machine_rates SET machine_id = ?, rate_amount = ?, rate_type = ? WHERE rate_id = ?`;
        const [result] = await db.execute(query, [machine_id, rate_amount, rate_type, id]);

        if (result.affectedRows === 0) return res.status(404).json({ message: "Rate not found" });
        res.json({ message: "Rate updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE
exports.deleteRate = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.execute('DELETE FROM machine_rates WHERE rate_id = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Rate not found" });
        res.json({ message: "Rate deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};