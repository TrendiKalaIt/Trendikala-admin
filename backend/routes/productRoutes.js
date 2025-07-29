import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// @route   POST /api/products/add
// @desc    Add a new product in JSON format
// @access  Public or Protected (based on your auth middleware setup)
router.post("/add", async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      category,
      brand,
      fabric,
      pattern,
      washCare,
      deliveryReturn,
      fitType,
      occasionType,
      countryOrigin,
      colors,
      sizes,
      images,
    } = req.body;

    // ✅ Basic validation
    if (!name || !price || !category) {
      return res.status(400).json({ message: "❌ Name, Price, and Category are required." });
    }

    // ✅ Create product instance
    const newProduct = new Product({
      name,
      description,
      price,
      discountPrice,
      category,
      brand,
      fabric,
      pattern,
      washCare,
      deliveryReturn,
      fitType,
      occasionType,
      countryOrigin,
      colors,
      sizes,
      images,
    });

    // ✅ Save to MongoDB
    const savedProduct = await newProduct.save();

    res.status(201).json({
      message: "✅ Product saved successfully!",
      product: savedProduct,
    });
  } catch (err) {
    console.error("❌ Error saving product:", err);
    res.status(500).json({ message: "❌ Server error while saving product" });
  }
});

export default router;
