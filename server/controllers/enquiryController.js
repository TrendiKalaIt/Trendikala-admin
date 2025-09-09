const Enquiry = require('../models/Enquiry');


const getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 }); 
    res.status(200).json(enquiries);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching enquiries', error: err.message });
  }
};


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


const markEnquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isRead, actionNote } = req.body;

    const enquiry = await Enquiry.findById(id);
    if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });

    
    if (enquiry.actionNote && actionNote && enquiry.actionNote !== actionNote) {
      return res.status(400).json({ message: "Action note already set and cannot be updated again" });
    }

    if (isRead !== undefined) enquiry.isRead = isRead;
    if (actionNote && !enquiry.actionNote) {
      enquiry.actionNote = actionNote;
      enquiry.actionDate = new Date();  
    }

    await enquiry.save();
    res.status(200).json(enquiry);
  } catch (err) {
    res.status(500).json({ message: "Error updating enquiry", error: err.message });
  }
};



module.exports = {
  getEnquiries,
  getEnquiryById,
  deleteEnquiry,
  markEnquiryStatus
};
