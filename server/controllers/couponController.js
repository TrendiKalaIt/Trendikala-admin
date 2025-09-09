const Coupon = require("../models/Coupons");

//  Create Coupon
const createCoupon = async (req, res) => {
  try {
    const {
      coupon_code,
      discount_type,
      discount_value,
      expiry_date,
      total_coupon_limit,
      per_user_usage_limit
    } = req.body;

    // check if coupon already exists
    const exists = await Coupon.findOne({ coupon_code });
    if (exists) {
      return res.status(400).json({ success: false, message: "Coupon code already exists" });
    }

    const coupon = await Coupon.create({
      coupon_code,
      discount_type,
      discount_value,
      expiry_date,
      total_coupon_limit,
      per_user_usage_limit
    });

    res.status(201).json({ success: true, coupon });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//  Get All Coupons
const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, coupons });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//  Delete Coupon
const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Coupon.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }

    res.json({ success: true, message: "Coupon deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//  Update Coupon
const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedCoupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedCoupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }

    res.json({ success: true, coupon: updatedCoupon });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createCoupon,
  getCoupons,
  deleteCoupon,
  updateCoupon
};
