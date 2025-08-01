// controllers/productController.js

const cloudinary = require('../config/cloudinary');
const Product = require('../models/Product');

const addProduct = async (req, res) => {
  try {
    let productData = JSON.parse(req.body.productData);
    const images = req.files;

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: 'image',
        });
        return result.secure_url;
      })
    );

    await Product.create({ ...productData, images: imagesUrl });

    res.json({ success: true, message: 'Product added' });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate('category', 'name')  // Populate category name (assuming category has name)
            .sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category', 'name');
        if (!product) return res.status(404).json({ message: 'Product not found' });

        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};


const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    addProduct,
    getAllProducts,
    getProductById,
    deleteProduct,
};

