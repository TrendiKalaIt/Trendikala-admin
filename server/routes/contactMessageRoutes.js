const express = require("express");
const router = express.Router();
const contactMessageController = require("../controllers/contactMessageController");


router.get("/", contactMessageController.getAllMessages);


router.put("/:id/status", contactMessageController.toggleReadStatus);

module.exports = router;
