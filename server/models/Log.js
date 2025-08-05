const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  userName: { type: String, required: true },
  userRole: { type: String, required: true },
  method: { type: String, required: true }, // POST, PUT, DELETE
  endpoint: { type: String, required: true },
  action: { type: String, required: true }, // e.g. Added Product
  details: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Log", logSchema);
