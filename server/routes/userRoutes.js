const express = require('express');
const { getAllUsers } = require('../controllers/userController');
const { protect, authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/all', protect, authorizeRoles('superadmin', 'admin'), getAllUsers);

module.exports = router;
