const express = require('express');
const router = express.Router();
const { getAllOrders, getOrderByOrderId,updateOrderStatus } = require('../controllers/orderController');
const { protect, authorizeRoles } = require('../middleware/roleMiddleware');


router.get('/', protect, authorizeRoles('admin', 'superadmin'), getAllOrders);


router.get('/:orderId', protect, getOrderByOrderId);


router.put('/:orderId/status', protect, authorizeRoles('admin', 'superadmin'), updateOrderStatus);


module.exports = router;
