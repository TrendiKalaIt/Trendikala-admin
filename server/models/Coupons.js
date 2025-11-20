// models/Coupon.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const UsedBySchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  order_id: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  usedAt: { type: Date, default: Date.now }
}, { _id: false });

const SlabSchema = new Schema({
  name: { type: String },
  min_amount: { type: Number },
  max_amount: { type: Number },
  min_items: { type: Number, default: 0 },
  discount_type: { type: String, enum: ['percentage', 'flat'] },
  discount_value: { type: Number },
  free_delivery: { type: Boolean, default: false }
}, { _id: false });

const CouponSchema = new Schema({
  coupon_code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  discount_type: { type: String, enum: ['percentage', 'flat'], required: true },
  discount_value: { type: Number, required: true },
  per_user_usage_limit: { type: Number, default: 1 },
  total_coupon_limit: { type: Number, default: 0 }, // 0 => unlimited (or treat as unlimited)
  total_coupon_used: { type: Number, default: 0 },
  expiry_date: { type: Date, required: true },
  coupon_used_by_users: { type: [UsedBySchema], default: [] },
  scope: { type: String, enum: ['cart', 'product'], default: 'cart' },
  applicable_product: { type: Schema.Types.ObjectId, ref: 'Product', default: null },
  slabs: { type: [SlabSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Coupon', CouponSchema);