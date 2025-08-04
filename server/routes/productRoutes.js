

const express = require('express');
const router = express.Router();
const { addProduct, getAllProducts, deleteProduct, editProduct, updateInventory,getProductById } = require('../controllers/productController');
const { protect, authorizeRoles } = require('../middleware/roleMiddleware');
const upload  = require('../middleware/multer'); 


router.post( '/add', protect, authorizeRoles('admin', 'superadmin'),upload.fields([ { name: 'media', maxCount: 10 }, { name:'thumbnail', maxCount: 1 },]),addProduct);

// Get all products
router.get('/', protect, authorizeRoles('admin', 'superadmin'), getAllProducts);
router.get('/:id', protect, authorizeRoles('admin', 'superadmin'), getProductById);


// Delete product
router.delete('/:id', protect, authorizeRoles('admin', 'superadmin'), deleteProduct);

// Edit full product (with optional new media/thumbnail)
router.put( '/edit/:id',protect,authorizeRoles('admin', 'superadmin'),upload.fields([ { name: 'media', maxCount: 10 },{ name: 'thumbnail', maxCount: 1 } ]), editProduct);

// Update inventory (stock, price, discount only)
router.patch( '/inventory/:id',protect, authorizeRoles('admin', 'superadmin'),updateInventory);


module.exports = router;
