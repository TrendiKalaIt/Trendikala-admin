import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["superadmin", "admin"],
    default: "admin",
  },
});

export default mongoose.model("User", userSchema);
