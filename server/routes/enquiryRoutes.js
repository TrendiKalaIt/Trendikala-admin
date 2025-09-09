const express = require('express');
const router = express.Router();
const { getEnquiries, getEnquiryById, deleteEnquiry,markEnquiryStatus } = require('../controllers/enquiryController');



router.get('/',  getEnquiries);
router.get('/:id',  getEnquiryById);
router.delete('/:id',  deleteEnquiry);
router.patch('/:id/status', markEnquiryStatus);


module.exports = router;
