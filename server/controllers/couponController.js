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
      per_user_usage_limit,
      scope,
      applicable_product,
      slabs,
      free_delivery_product
    } = req.body;

    const normalizedScope = scope || "cart";
    let normalizedApplicableProduct = applicable_product;

    if (normalizedScope === "product") {
      if (!normalizedApplicableProduct) {
        return res.status(400).json({
          success: false,
          message: "applicable_product is required when scope is product",
        });
      }
    } else {
      // cart-scope or anything else: do not store an empty string as ObjectId
      normalizedApplicableProduct = null;
    }

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
      per_user_usage_limit,
      scope: normalizedScope,
      applicable_product: normalizedApplicableProduct,
      slabs,
      free_delivery_product: !!free_delivery_product
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
    const updateData = { ...req.body };
    if (typeof updateData.free_delivery_product === 'undefined') {
      // leave as-is (don't change), OR explicitly set false for cart-scope
    } else {
      updateData.free_delivery_product = !!updateData.free_delivery_product;
    }

    const incomingScope = updateData.scope || "cart";

    if (incomingScope === "product") {
      if (!updateData.applicable_product) {
        return res.status(400).json({
          success: false,
          message: "applicable_product is required when scope is product",
        });
      }
    } else {
      // for cart-scope, make sure we are not leaving an empty string that causes ObjectId cast errors
      updateData.applicable_product = null;
    }

    const updatedCoupon = await Coupon.findByIdAndUpdate(id, updateData, { new: true });

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


// Get Single Coupon by ID
const getCouponById = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findById(id)
      .populate("coupon_used_by_users.user_id", "name email") // user ka naam, email dikhane ke liye
      .populate("coupon_used_by_users.order_id", "_id totalAmount") // order ka detail
      .populate("applicable_product", "productName productCode");

    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }

    res.json({ success: true, coupon });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createCoupon,
  getCoupons,
  deleteCoupon,
  updateCoupon,
  getCouponById,
}
