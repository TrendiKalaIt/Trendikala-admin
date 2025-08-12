
const express = require('express');
const router = express.Router();
const { getDashboardRevenue } = require('../controllers/dashboardController');


router.get('/', getDashboardRevenue);


module.exports = router;

