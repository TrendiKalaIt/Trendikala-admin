const Enquiry = require('../models/Enquiry');

// @desc    Get all enquiries
// @route   GET /api/enquiries
// @access  Private (Admin)
const getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json(enquiries);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching enquiries', error: err.message });
  }
};

// @desc    Get single enquiry by ID
// @route   GET /api/enquiries/:id
// @access  Private (Admin)
const getEnquiryById = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }
    res.status(200).json(enquiry);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching enquiry', error: err.message });
  }
};

// @desc    Delete enquiry
// @route   DELETE /api/enquiries/:id
// @access  Private (Admin)
const deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }
    await enquiry.deleteOne();
    res.status(200).json({ message: 'Enquiry deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting enquiry', error: err.message });
  }
};

module.exports = {
  getEnquiries,
  getEnquiryById,
  deleteEnquiry
};
