const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/roleMiddleware');

router.post('/admin-action', protect, authorizeRoles('superadmin'), (req, res) => {
  res.send('Only superadmin can do this');
});

module.exports = router;
