import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

dotenv.config();

const seedUsers = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteMany();

  const hashedPassword = await bcrypt.hash("admin123", 10);
  await User.create([
    { email: "superadmin@example.com", password: hashedPassword, role: "superadmin" },
    { email: "admin@example.com", password: hashedPassword, role: "admin" }
  ]);

  console.log("Users seeded");
  process.exit();
};

seedUsers();
