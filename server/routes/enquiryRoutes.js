const express = require('express');
const router = express.Router();
const { getEnquiries, getEnquiryById, deleteEnquiry } = require('../controllers/enquiryController');



router.get('/',  getEnquiries);
router.get('/:id',  getEnquiryById);
router.delete('/:id',  deleteEnquiry);

module.exports = router;
