const ContactMessage = require("../models/ContactMessage");


exports.getAllMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.toggleReadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { visited } = req.body;

    const message = await ContactMessage.findByIdAndUpdate(
      id,
      { visited },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json(message);
  } catch (error) {
    console.error("Error updating message status:", error);
    res.status(500).json({ message: "Server error" });
  }
};
