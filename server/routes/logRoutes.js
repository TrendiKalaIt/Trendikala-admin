const express = require("express");
const router = express.Router();
const {
  getLogs,
  createLog,
  deleteLog,
  clearLogs,
} = require("../controllers/logController");


router.get("/", getLogs);
router.post("/", createLog);
router.delete("/:id", deleteLog);
router.delete("/", clearLogs);

module.exports = router;
