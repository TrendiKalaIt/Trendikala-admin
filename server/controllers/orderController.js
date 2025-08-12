const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product')


const getAllOrders = async (req, res) => {
  try {
    
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
};


const getOrderByOrderId = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId })
      .populate('user', 'name email')
      .populate('items.product', 'name images');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order by orderId:', error.message);
    res.status(500).json({ message: 'Server error while fetching order details' });
  }
};



const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

  
    const existingOrder = await Order.findOne({ orderId: orderId });
    if (!existingOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (existingOrder.orderStatus === 'Delivered' || existingOrder.orderStatus === 'Cancelled') {
      return res.status(400).json({ message: 'Cannot update a delivered or cancelled order' });
    }

   
    const updateFields = { orderStatus };

    if (orderStatus === 'Delivered') {
      updateFields.paymentStatus = 'Paid';
    } else if (orderStatus === 'Cancelled') {
      updateFields.paymentStatus = 'Failed';
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { orderId },
      updateFields,
      { new: true }
    );

    res.status(200).json({ message: 'Order status updated', order: updatedOrder });
  } catch (error) {
    console.error('Error updating order status:', error.message);
    res.status(500).json({ message: 'Server error while updating order status' });
  }
};



module.exports = {
  getAllOrders,
  getOrderByOrderId,
  updateOrderStatus,
};
