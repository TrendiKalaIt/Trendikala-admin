
const express = require('express');
const router = express.Router();
const { getDashboardRevenue } = require('../controllers/dashboardController');

// GET dashboard revenue
router.get('/', getDashboardRevenue);


module.exports = router;

