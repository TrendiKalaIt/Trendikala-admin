const Admin = require("../models/Admin");


exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");
    res.status(200).json(admins);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch admins" });
  }
};


exports.getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select("-password");
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.status(200).json(admin);
  } catch (err) {
    res.status(500).json({ message: "Error fetching admin" });
  }
};


exports.updateAdmin = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const admin = await Admin.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true }
    ).select("-password");

    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.status(200).json(admin);
  } catch (err) {
    res.status(500).json({ message: "Error updating admin" });
  }
};

// DELETE admin by ID
exports.deleteAdmin = async (req, res) => {
  try {
    const deleted = await Admin.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Admin not found" });
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting admin" });
  }
};




// GET current admin's profile
exports.getAdminProfile = async (req, res) => {
  try {
    res.status(200).json(req.user); // `req.user` is set by `protect` middleware
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};


exports.updateAdminProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.user.id, // token se mila ID
      { name, email, phone },
      { new: true }
    ).select("-password");

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json(updatedAdmin);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

