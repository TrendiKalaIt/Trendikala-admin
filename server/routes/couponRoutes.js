const express = require("express");
const { protect, authorizeRoles } = require("../middleware/roleMiddleware");
 
const router = express.Router();
 
const {
  createCoupon,
  getCoupons,
  deleteCoupon,
  updateCoupon,
} = require("../controllers/couponController");
 
// Admin APIs
router.post("/", protect, authorizeRoles("admin", "superadmin"), createCoupon); // add new coupon
router.get("/", protect, authorizeRoles('admin', 'superadmin'), getCoupons); // list all coupons
router.put("/:id", protect, authorizeRoles('admin', 'superadmin'), updateCoupon); // update coupon
router.delete("/:id", protect, authorizeRoles('admin', 'superadmin'), deleteCoupon); // delete coupon
 
module.exports = router;