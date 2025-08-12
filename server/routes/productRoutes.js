
const express = require('express');
const router = express.Router();
const { addProduct, getAllProducts, deleteProduct, editProduct, updateInventory,getProductById } = require('../controllers/productController');
const { protect, authorizeRoles } = require('../middleware/roleMiddleware');
const upload  = require('../middleware/multer'); 


router.post( '/add', protect, authorizeRoles('admin', 'superadmin'),upload.fields([ { name: 'media', maxCount: 10 }, { name:'thumbnail', maxCount: 1 },]),addProduct);


router.get('/', protect, authorizeRoles('admin', 'superadmin'), getAllProducts);
router.get('/:id', protect, authorizeRoles('admin', 'superadmin'), getProductById);



router.delete('/:id', protect, authorizeRoles('admin', 'superadmin'), deleteProduct);


router.put( '/edit/:id',protect,authorizeRoles('admin', 'superadmin'),upload.fields([ { name: 'media', maxCount: 10 },{ name: 'thumbnail', maxCount: 1 } ]), editProduct);


router.patch( '/inventory/:id',protect, authorizeRoles('admin', 'superadmin'),updateInventory);


module.exports = router;
