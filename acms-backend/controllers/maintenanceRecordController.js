// Author: Carl Louis M. Naval
// Module: Machinery Management and Rental Service 
// Description: Subsystem of ACMS for PPAC
// controllers/maintenanceRecordController.js
const db = require('../config/db');

// CREATE: Log a new maintenance activity (Supports NULLs and New Status)
exports.createMaintenanceRecord = async (req, res) => {
    try {
        const { 
            machine_id, 
            maintenance_type_id, 
            maintenance_date, // New
            maintenance_status, // New
            part_replaced, 
            maintenance_cost 
        } = req.body;

        // Named columns are safer to prevent errors when table structure changes
        const query = `
            INSERT INTO maintenance_records 
            (machine_id, maintenance_type_id, maintenance_date, maintenance_status, part_replaced, maintenance_cost) 
            VALUES (?, ?, ?, ?, ?, ?)`;
        
        await db.execute(query, [
            machine_id, 
            maintenance_type_id, 
            maintenance_date || null,      // Accept NULL
            maintenance_status || 'Scheduled', // Default to Scheduled
            part_replaced || null,         // Accept NULL
            maintenance_cost || null       // Accept NULL
        ]);
        
        res.status(201).json({ message: "Maintenance record saved successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// READ ALL: Updated to include new columns
exports.getAllMaintenanceRecords = async (req, res) => {
    try {
        const query = `
            SELECT mr.*, mt.maintenance_type 
            FROM maintenance_records mr
            JOIN maintenance_types mt ON mr.maintenance_type_id = mt.maintenance_type_id
            ORDER BY mr.maintenance_date DESC`; // Helpful for the UI
            
        const [rows] = await db.execute(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE: Added status, date, and handling for nullable fields
exports.updateMaintenanceRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            machine_id, 
            maintenance_type_id, 
            maintenance_date, 
            maintenance_status, 
            part_replaced, 
            maintenance_cost 
        } = req.body;

        const query = `
            UPDATE maintenance_records 
            SET machine_id = ?, 
                maintenance_type_id = ?, 
                maintenance_date = ?, 
                maintenance_status = ?, 
                part_replaced = ?, 
                maintenance_cost = ? 
            WHERE maintenance_id = ?`;

        const [result] = await db.execute(query, [
            machine_id, 
            maintenance_type_id, 
            maintenance_date || null, 
            maintenance_status, 
            part_replaced || null, 
            maintenance_cost || null, 
            id
        ]);

        if (result.affectedRows === 0) return res.status(404).json({ message: "Record not found" });
        res.json({ message: "Maintenance record updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE (Stays same)
exports.deleteMaintenanceRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.execute('DELETE FROM maintenance_records WHERE maintenance_id = ?', [id]);
        
        if (result.affectedRows === 0) return res.status(404).json({ message: "Record not found" });
        res.json({ message: "Maintenance record deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};