// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const {
  addProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
} = require('../controllers/productController');
const { protect, authorizeRoles } = require('../middleware/roleMiddleware');


router.get('/', protect, authorizeRoles('admin', 'superadmin'), getAllProducts);
router.get('/:id', protect, getProductById);


//router.post('/add', upload.array([images]),protect,authorizeRoles('admin', 'superadmin'),addProduct);
router.post(
  '/add',
  upload.array('images'), // <-- 'images' is the form field name (string), not array or variable
  protect,
  authorizeRoles('admin', 'superadmin'),
  addProduct
);
// router.put('/:id', protect, authorizeRoles('admin', 'superadmin'), updateProduct);
router.delete('/:id', protect, authorizeRoles('admin', 'superadmin'), deleteProduct);

module.exports = router;
