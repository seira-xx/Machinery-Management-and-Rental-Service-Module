const db = require('../config/db');

// CREATE: Register a new member profile
exports.createMemberProfile = async (req, res) => {
    try {
        const { 
            member_id, 
            user_id, 
            member_fname, 
            member_mname, 
            member_lname, 
            member_birthdate, 
            member_civil_status, 
            member_contact, 
            member_address, 
            member_status, 
            join_date 
        } = req.body;

        const query = `
            INSERT INTO members 
            (member_id, user_id, member_fname, member_mname, member_lname, 
             member_birthdate, member_civil_status, member_contact, 
             member_address, member_status, join_date) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        await db.execute(query, [
            member_id, user_id, member_fname, member_mname, member_lname, 
            member_birthdate, member_civil_status, member_contact, 
            member_address, member_status, join_date
        ]);

        res.status(201).json({ message: "Member profile created successfully" });
    } catch (error) {
        // If the user_id doesn't exist in the users table, MySQL will throw an error
        res.status(500).json({ error: error.message });
    }
};

// READ: Get a specific member's profile by their User ID
exports.getMemberByUserId = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.execute('SELECT * FROM members WHERE user_id = ?', [id]);
        
        if (rows.length === 0) return res.status(404).json({ message: "Profile not found" });
        
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// READ ALL: Get all members (for admin use)
exports.getAllMembers = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM members');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};