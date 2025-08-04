// // 

// const { getDashboardData } = require('../controllers/dashboardController');

// // GET method for dashboard summary
// router.get('/dashboard', getDashboardData);


// routes/adminRoutes.js (ya jo bhi aapka admin route file ho)
const express = require('express');
const router = express.Router();
const { getDashboardRevenue } = require('../controllers/dashboardController');

// GET dashboard revenue
router.get('/', getDashboardRevenue);


module.exports = router;

