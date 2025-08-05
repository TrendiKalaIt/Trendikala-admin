const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const Log = require("../models/Log");

const uploadFromBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

function tryParseJSON(field) {
  if (typeof field === "string") {
    try {
      return JSON.parse(field);
    } catch {
      return field;
    }
  }
  return field;
}

exports.addProduct = async (req, res) => {
  try {
    console.log("--- Incoming Request ---");
    console.log("req.body:", req.body);
    console.log("req.files:", req.files);

    const {
      productName,
      category,
      brand,
      price,
      discountPrice,
      discountPercent,
      description,
      detailedDescription,
      colors,
      sizes,
      details,
      materialWashing,
      sizeShape,
      stock,
    } = req.body;

    if (!productName || !category) {
      return res
        .status(400)
        .json({ success: false, message: "productName and category required" });
    }

    // Parse JSON fields
    const detailedDesc = tryParseJSON(detailedDescription);
    const parsedColors = tryParseJSON(colors);
    const parsedSizes = tryParseJSON(sizes);
    const parsedDetails = tryParseJSON(details);
    const parsedMaterialWashing = tryParseJSON(materialWashing);
    const parsedSizeShape = tryParseJSON(sizeShape);

    const mediaFiles = req.files?.media || [];
    const thumbnailFile = req.files?.thumbnail?.[0] || null;

    console.log(`Number of media files: ${mediaFiles.length}`);
    if (thumbnailFile)
      console.log(`Thumbnail file: ${thumbnailFile.originalname}`);

    // Upload media files to Cloudinary
    const media = await Promise.all(
      mediaFiles.map(async (file, index) => {
        console.log(`Uploading media file #${index + 1}:`, file.originalname);
        const result = await uploadFromBuffer(file.buffer);
        let type = file.mimetype.startsWith("video/") ? "video" : "image";
        return { url: result.secure_url, type };
      })
    );

    // Upload thumbnail file
    let thumbnailUrl = "";
    if (thumbnailFile) {
      const result = await uploadFromBuffer(thumbnailFile.buffer);
      thumbnailUrl = result.secure_url;
    }

    const productData = {
      productName,
      category,
      brand,
      price,
      discountPrice,
      discountPercent,
      description,
      detailedDescription: detailedDesc,
      colors: parsedColors,
      sizes: parsedSizes,
      details: parsedDetails,
      materialWashing: parsedMaterialWashing,
      sizeShape: parsedSizeShape,
      stock: Number(stock) || 0,
      thumbnail: thumbnailUrl,
      media,
    };

    const product = await Product.create(productData);
    console.log("Product saved:", product._id);

    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error("Error in addProduct:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.editProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const updatedFields = {
      productName: req.body.productName,
      category: req.body.category,
      brand: req.body.brand,
      price: req.body.price,
      discountPrice: req.body.discountPrice,
      discountPercent: req.body.discountPercent,
      description: req.body.description,
      detailedDescription: tryParseJSON(req.body.detailedDescription),
      colors: tryParseJSON(req.body.colors),
      sizes: tryParseJSON(req.body.sizes),
      details: tryParseJSON(req.body.details),
      materialWashing: tryParseJSON(req.body.materialWashing),
      sizeShape: tryParseJSON(req.body.sizeShape),
      stock: Number(req.body.stock),
    }; // Optional: Upload new thumbnail or media

    const mediaFiles = req.files?.media || [];
    const thumbnailFile = req.files?.thumbnail?.[0];

    if (mediaFiles.length > 0) {
      const media = await Promise.all(
        mediaFiles.map(async (file) => {
          const result = await uploadFromBuffer(file.buffer);
          const type = file.mimetype.startsWith("video/") ? "video" : "image";
          return { url: result.secure_url, type };
        })
      );
      updatedFields.media = media;
    }

    if (thumbnailFile) {
      const result = await uploadFromBuffer(thumbnailFile.buffer);
      updatedFields.thumbnail = result.secure_url;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: updatedFields },
      { new: true }
    );

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock, price, discountPrice, discountPercent } = req.body;

    const product = await Product.findByIdAndUpdate(
      id,
      {
        $set: {
          stock: Number(stock),
          price: Number(price),
          discountPrice: Number(discountPrice),
          discountPercent: Number(discountPercent),
        },
      },
      { new: true }
    );

    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("Error updating inventory:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
