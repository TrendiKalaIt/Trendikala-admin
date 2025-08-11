
const express = require("express");
const router = express.Router();
const {
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  getAdminProfile,
  updateAdminProfile,
  changePassword
} = require("../controllers/adminController");

const { protect, authorizeRoles } = require("../middleware/roleMiddleware");

router.get("/profile", protect, getAdminProfile);
router.put("/profile", protect, updateAdminProfile);
// Only superadmin can perform these actions
router.get("/", protect, authorizeRoles("superadmin"), getAllAdmins);
router.get("/:id", protect, authorizeRoles("superadmin"), getAdminById);
router.put("/:id", protect, authorizeRoles("superadmin"), updateAdmin);
router.delete("/:id", protect, authorizeRoles("superadmin"), deleteAdmin);

router.post("/change-password", protect, changePassword);

module.exports = router;
