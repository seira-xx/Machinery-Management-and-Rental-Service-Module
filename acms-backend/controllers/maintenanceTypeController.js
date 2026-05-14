// Author: Carl Louis M. Naval
// Module: Machinery Management and Rental Service 
// Description: Subsystem of ACMS for PPAC
// controllers/maintenanceTypeController.js
const db = require('../config/db');

// CREATE a new Category (e.g., "Repair", "Oil Change")

exports.createMaintenanceType = async (req, res) => {
    try {
        const { maintenance_type, status } = req.body;
        
        const query = `INSERT INTO maintenance_types (maintenance_type, status) VALUES (?, ?)`;
        await db.execute(query, [maintenance_type, status || 'Active']);
        
        res.status(201).json({ message: "Maintenance type created successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// READ ALL (Used for filling dropdown menus in the frontend)
exports.getMaintenanceTypes = async (req, res) => {
    try {
        const query = `SELECT * FROM maintenance_types ORDER BY maintenance_type ASC`;
        const [rows] = await db.execute(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE
exports.updateMaintenanceType = async (req, res) => {
    try {
        const { id } = req.params;
        const { maintenance_type, status } = req.body;
        
        const query = `UPDATE maintenance_types SET maintenance_type = ?, status = ? WHERE maintenance_type_id = ?`;
        const [result] = await db.execute(query, [maintenance_type, status, id]);

        if (result.affectedRows === 0) return res.status(404).json({ message: "Type not found" });
        res.json({ message: "Maintenance type updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE
exports.deleteMaintenanceType = async (req, res) => {
    try {
        const { id } = req.params;
        await db.execute('DELETE FROM maintenance_types WHERE maintenance_type_id = ?', [id]);
        res.json({ message: "Maintenance Type deleted" });
    } catch (error) {
        res.status(500).json({ error: "Cannot delete: This type is being used in existing records." });
    }
};