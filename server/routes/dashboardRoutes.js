const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const { protect, authorizeRoles } = require('../middleware/roleMiddleware');

router.get("/", protect, authorizeRoles("admin", "superadmin"), getDashboardStats);

module.exports = router;
