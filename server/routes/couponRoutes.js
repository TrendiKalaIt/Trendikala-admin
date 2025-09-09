const express = require("express");
const { protect, authorizeRoles } = require("../middleware/roleMiddleware");
 
const router = express.Router();
 
const {
  createCoupon,
  getCoupons,
  deleteCoupon,
  updateCoupon,
  getCouponById
} = require("../controllers/couponController");
 
// Admin APIs
router.post("/", protect, authorizeRoles("admin", "superadmin"), createCoupon); 
router.get("/", protect, authorizeRoles('admin', 'superadmin'), getCoupons);
router.put("/:id", protect, authorizeRoles('admin', 'superadmin'), updateCoupon);
router.delete("/:id", protect, authorizeRoles('admin', 'superadmin'), deleteCoupon);
router.get("/:id", protect, authorizeRoles("admin", "superadmin"), getCouponById);

 
module.exports = router;