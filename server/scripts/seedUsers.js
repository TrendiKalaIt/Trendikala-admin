// scripts/seedUsers.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
require('dotenv').config();

const users = [
  {
    name: 'Super Admin',
    email: 'superadmin@example.com',
    password: bcrypt.hashSync('superpass', 10),
    role: 'superadmin',
  },
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('adminpass', 10),
    role: 'admin',
  },
  {
    name: 'Staff Member',
    email: 'staff@example.com',
    password: bcrypt.hashSync('staffpass', 10),
    role: 'staff',
  },
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(' Connected to MongoDB');

    // Optional: Clear existing users
    await Admin.deleteMany({});
    console.log('  Deleted existing users');

    // Insert seed users
    await Admin.insertMany(users);
    console.log(' Seed users added');

    process.exit(0);
  } catch (err) {
    console.error(' Error seeding users:', err);
    process.exit(1);
  }
};

seedUsers();
