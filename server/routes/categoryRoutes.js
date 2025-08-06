
const express = require('express');
const router = express.Router();

const { getAllCategories, createCategory } = require('../controllers/categoryController');
const { protect, authorizeRoles } = require('../middleware/roleMiddleware');


router.get('/', getAllCategories);


router.post('/', protect, authorizeRoles('admin', 'superadmin'), createCategory);

module.exports = router;
