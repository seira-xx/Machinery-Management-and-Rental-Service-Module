const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');

// Define your endpoints
router.post('/register-profile', memberController.createMemberProfile);
router.get('/profile/:id', memberController.getMemberByUserId);
router.get('/', memberController.getAllMembers);

module.exports = router;