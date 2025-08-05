const Log = require("../models/Log");


exports.getLogs = async (req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.createLog = async (req, res) => {
  try {
    const newLog = await Log.create(req.body);
    res.status(201).json(newLog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.deleteLog = async (req, res) => {
  try {
    const deletedLog = await Log.findByIdAndDelete(req.params.id);
    if (!deletedLog) {
      return res.status(404).json({ message: "Log not found" });
    }
    res.json({ message: "Log deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.clearLogs = async (req, res) => {
  try {
    await Log.deleteMany({});
    res.json({ message: "All logs deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
