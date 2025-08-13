const mongoose = require('mongoose');
const moment = require('moment');
const Product = require('./Product');
const Counter = require('./counterSchema');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  discountPrice: { type: Number, required: true },
  image: { type: String },
  color: { type: String },
  size: { type: String }
}, { _id: false });

const shippingInfoSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  streetAddress: { type: String, required: true },
  apartment: { type: String },
  townCity: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  emailAddress: { type: String, required: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    index: true
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  items: [orderItemSchema],
  shippingInfo: shippingInfoSchema,
  paymentMethod: { type: String, enum: ['bank', 'cashOnDelivery', 'Razorpay'], default: 'cashOnDelivery', required: true },
  shippingCost: {
    type: Number,
    required: true,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending'
  },
  orderStatus: {
    type: String,
    enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  createdAt: { type: Date, default: Date.now },
  isGuest: { type: Boolean, default: false }
});


orderSchema.pre('save', async function (next) {
  if (!this.isNew) return next();
 
  if (!this.items.length) {
    return next(new Error("Order must have at least one item"));
  }
 
  // First product fetch
  const firstProduct = await Product.findById(this.items[0].product).populate('category');
  if (!firstProduct) {
    return next(new Error("Product not found for order"));
  }
 
  const dateStr = moment().format('YYYYMMDD');
  const categoryCode = firstProduct.category.categoryCode;
  const productCode = firstProduct.productCode;
 
  const counterId = `${dateStr}-${categoryCode}-${productCode}`;
 
  // Increment counter for the combination
  let counter = await Counter.findOneAndUpdate(
    { id: counterId },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
 
  const seqNumber = String(counter.seq).padStart(4, '0'); // e.g., 0001
  this.orderId = `${counterId}-${seqNumber}`;
 
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
