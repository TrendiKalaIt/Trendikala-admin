const jwt = require('jsonwebtoken');
const User = require('../models/Admin');  


const protect = async (req, res, next) => {
  try {
    
    let token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Not authorized' });

   
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) throw new Error('User not found');

    next();
  } catch (err) {
    
    res.status(401).json({ message: 'Invalid token' });
  }
};


const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    
    if (!allowedRoles.includes(req.user?.role)) {
      return res.status(403).json({ message: 'Access denied: Insufficient role' });
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };
