// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();

const { getAllCategories, createCategory } = require('../controllers/categoryController');
const { protect, authorizeRoles } = require('../middleware/roleMiddleware');

// Public route to get all categories (or you can protect it if needed)
router.get('/', getAllCategories);

// Admin only route to create new category
router.post('/', protect, authorizeRoles('admin', 'superadmin'), createCategory);

module.exports = router;
