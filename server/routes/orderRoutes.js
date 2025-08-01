const express = require('express');
const router = express.Router();
const { getAllOrders, getOrderByOrderId,updateOrderStatus } = require('../controllers/orderController');
const { protect, authorizeRoles } = require('../middleware/roleMiddleware');

// Route to get all orders (admin only)
router.get('/', protect, authorizeRoles('admin', 'superadmin'), getAllOrders);

// Route to get order by orderId (logged-in users)
router.get('/:orderId', protect, getOrderByOrderId);

//route to update order status
router.put('/:orderId/status', protect, authorizeRoles('admin', 'superadmin'), updateOrderStatus);


module.exports = router;
