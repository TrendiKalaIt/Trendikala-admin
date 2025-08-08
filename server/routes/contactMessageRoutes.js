const express = require("express");
const router = express.Router();
const contactMessageController = require("../controllers/contactMessageController");

// GET all messages
router.get("/", contactMessageController.getAllMessages);

module.exports = router;
