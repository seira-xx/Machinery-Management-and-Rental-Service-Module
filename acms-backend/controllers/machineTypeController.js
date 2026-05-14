// Author: Carl Louis M. Naval
// Module: Machinery Management and Rental Service 
// Description: Subsystem of ACMS for PPAC
// controllers/machineTypeController.js
const db = require('../config/db');

// CREATE: Add a new Machine Type (Category)
exports.createMachineType = async (req, res) => {
    try {
        const { machine_type_name, machine_brand, fuel_type } = req.body;
        const query = `
            INSERT INTO machine_types (machine_type_name, machine_brand, fuel_type) 
            VALUES (?, ?, ?)`;
            
        await db.execute(query, [machine_type_name, machine_brand, fuel_type]);
        
        res.status(201).json({ message: "Machine Type successfully added" });
    } catch (error) { 
        res.status(500).json({ error: error.message }); 
    }
};

// READ ALL: Get all categories
exports.getMachineTypes = async (req, res) => {
    try {
        const query = `SELECT * FROM machine_types ORDER BY machine_type_name ASC`;
        const [rows] = await db.execute(query);
        res.json(rows);
    } catch (error) { 
        res.status(500).json({ error: error.message }); 
    }
};

// UPDATE: Full update of name, brand, and fuel
exports.updateMachineType = async (req, res) => {
    try {
        const { id } = req.params;
        const { machine_type_name, machine_brand, fuel_type } = req.body;
        
        const query = `
            UPDATE machine_types 
            SET machine_type_name = ?, 
                machine_brand = ?, 
                fuel_type = ? 
            WHERE machine_type_id = ?`;
        
        const [result] = await db.execute(query, [machine_type_name, machine_brand, fuel_type, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Machine Type not found" });
        }

        res.json({ message: "Machine Type updated successfully" });
    } catch (error) { 
        res.status(500).json({ error: error.message }); 
    }
};

// DELETE: Remove a category
exports.deleteMachineType = async (req, res) => {
    try {
        const { id } = req.params;
        
        const query = `DELETE FROM machine_types WHERE machine_type_id = ?`;
        const [result] = await db.execute(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Machine Type not found" });
        }

        res.json({ message: "Machine Type deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Cannot delete: Ensure no machines are currently using this type." });
    }
};