const jwt = require('jsonwebtoken');
const User = require('../models/Admin');  // Aapka User model

// Token check karne wala middleware
const protect = async (req, res, next) => {
  try {
    // Authorization header me 'Bearer token' aata hai, usme se token nikal rahe hain
    let token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Not authorized' });

    // JWT verify kar rahe hain
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Database se user dhundh ke req.user me daal rahe hain, password hata ke
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) throw new Error('User not found');

    next();
  } catch (err) {
    // Agar koi error, invalid token ya user na mile to 401 bhejo
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Role-based authorization middleware
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // req.user me role check karo, agar allowed roles me nahi to 403 bhejo
    if (!allowedRoles.includes(req.user?.role)) {
      return res.status(403).json({ message: 'Access denied: Insufficient role' });
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };
