
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



seedUsers();
