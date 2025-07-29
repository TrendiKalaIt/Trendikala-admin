// controllers/userController.js
import User from "../models/User.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "name email phone role"); // specific fields only
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error" });
  }
};
