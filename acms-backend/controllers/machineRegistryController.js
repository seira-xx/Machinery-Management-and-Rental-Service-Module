// Author: Carl Louis M. Naval
// Module: Machinery Management and Rental Service 
// Description: Subsystem of ACMS for PPAC
// controllers/machineRegistryController.js
const db = require('../config/db');

// CREATE: Add a machine
exports.addMachineToRegistry = async (req, res) => {
    try {
        const {machine_type_id, acquisition_date, machine_condition, machine_status } = req.body;
        const query = `
            INSERT INTO machine_registry 
            (machine_type_id, acquisition_date, machine_condition, machine_status) 
            VALUES (?, ?, ?, ?)`;

        await db.execute(query, [machine_type_id, acquisition_date, machine_condition, machine_status]);
        res.status(201).json({ message: "Machine successfully added" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// READ: Get all machines
exports.getAllRegisteredMachines = async (req, res) => {
    try {
        const query = `
            SELECT 
                mr.*, 
                mt.machine_type_name, 
                mt.machine_brand,
                mt.fuel_type
            FROM machine_registry mr
            JOIN machine_types mt ON mr.machine_type_id = mt.machine_type_id
            ORDER BY mr.machine_status ASC`;
        const [rows] = await db.execute(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE: Edit machine details 
exports.updateMachineInRegistry = async (req, res) => {
    try {
        const { id } = req.params; 
        const { 
            machine_type_id, 
            acquisition_date, 
            machine_condition, 
            machine_status 
        } = req.body;
        
        const query = `
            UPDATE machine_registry 
            SET machine_type_id = ?, 
                acquisition_date = ?, 
                machine_condition = ?, 
                machine_status = ? 
            WHERE machine_id = ?`;

        const [result] = await db.execute(query, [
            machine_type_id, 
            acquisition_date, 
            machine_condition, 
            machine_status, 
            id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Machine not found" });
        }

        res.json({ message: "Machine record updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// DELETE: Remove a machine from the registry
exports.deleteMachineFromRegistry = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.execute('DELETE FROM machine_registry WHERE machine_id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Machine not found" });
        }

        res.json({ message: "Machine deleted successfully" });
    } catch (error) {
        // This will trigger if you try to delete a machine that is already linked to a Rental record
        res.status(500).json({ error: "Cannot delete: Machine is linked to other records." });
    }
};

// Dashboard Summary for Operation Manager
exports.getMachineDashboardSummary = async (req, res) => {
    try {
        // 1. Fetch Stats (Including Reserved per your UI needs)
        const statsQuery = `
            SELECT 
                SUM(CASE WHEN machine_status = 'Under Maintenance' THEN 1 ELSE 0 END) as maintenance_count,
                SUM(CASE WHEN machine_status = 'Available' THEN 1 ELSE 0 END) as available_count,
                SUM(CASE WHEN machine_status = 'Reserved' THEN 1 ELSE 0 END) as reserved_count
            FROM machine_registry`;
        
        const [stats] = await db.execute(statsQuery);

        // 2. Fetch Recent Registry (For the Equipment Registry list)
        const registryQuery = `
            SELECT mr.machine_id, mt.machine_type_name, mr.machine_status 
            FROM machine_registry mr
            JOIN machine_types mt ON mr.machine_type_id = mt.machine_type_id
            ORDER BY mr.acquisition_date DESC
            LIMIT 5`;
        
        const [registry] = await db.execute(registryQuery);

        // 3. Fetch Upcoming Maintenance (Strictly 'Scheduled' status)
        const maintenanceQuery = `
            SELECT 
                mr.maintenance_id, 
                mr.maintenance_date, 
                mt.maintenance_type, 
                reg_mt.machine_type_name
            FROM maintenance_records mr
            JOIN maintenance_types mt ON mr.maintenance_type_id = mt.maintenance_type_id
            JOIN machine_registry reg ON mr.machine_id = reg.machine_id
            JOIN machine_types reg_mt ON reg.machine_type_id = reg_mt.machine_type_id
            WHERE mr.maintenance_status = 'Scheduled'
            ORDER BY mr.maintenance_date ASC
            LIMIT 5`;

        const [maintenance] = await db.execute(maintenanceQuery);

        res.json({
            stats: stats[0] || { maintenance_count: 0, available_count: 0, reserved_count: 0 },
            registry: registry,
            maintenance: maintenance // This feeds the "Upcoming Maintenance" section
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE: Specific for Mechanic Head (Condition and Status only)
exports.updateMachineStatusOnly = async (req, res) => {
    try {
        const { id } = req.params;
        const { machine_condition, machine_status } = req.body;

        const query = `
            UPDATE machine_registry 
            SET machine_condition = ?, 
                machine_status = ? 
            WHERE machine_id = ?`;

        const [result] = await db.execute(query, [
            machine_condition, 
            machine_status, 
            id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Machine not found" });
        }

        res.json({ message: "Machine status synced successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};