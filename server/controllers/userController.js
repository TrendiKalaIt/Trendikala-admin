import User from '../models/User.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'name email isGuest mobile createdAt'); // select only needed fields
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};
