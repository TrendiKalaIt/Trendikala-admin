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


exports.addProduct = async (req, res) => {
  try {
    console.log("--- Incoming Request ---");
    console.log("req.body:", req.body);
    console.log("req.files:", req.files);

    const {
      productName,
      category,
      productCode,
      brand,
      description,
      detailedDescription,
      colors,
      sizes,
      details,
      materialWashing,
      sizeShape,
    } = req.body;

    if (!productName || !category) {
      return res
        .status(400)
        .json({ success: false, message: "productName and category required" });
    }

    const detailedDesc = tryParseJSON(detailedDescription);
    const parsedColors = tryParseJSON(colors);
    const parsedSizes = tryParseJSON(sizes); // [{ size, price, discountPrice, discountPercent, stock }]
    const parsedDetails = tryParseJSON(details);
    const parsedMaterialWashing = tryParseJSON(materialWashing);
    const parsedSizeShape = tryParseJSON(sizeShape);

    // Media Upload
    const mediaFiles = req.files?.media || [];
    const thumbnailFile = req.files?.thumbnail?.[0] || null;

    const media = await Promise.all(
      mediaFiles.map(async (file) => {
        const result = await uploadFromBuffer(file.buffer);
        let type = file.mimetype.startsWith("video/") ? "video" : "image";
        return { url: result.secure_url, type };
      })
    );

    let thumbnailUrl = "";
    if (thumbnailFile) {
      const result = await uploadFromBuffer(thumbnailFile.buffer);
      thumbnailUrl = result.secure_url;
    }

    const productData = {
      productName,
      category,
      productCode,
      brand,
      description,
      detailedDescription: detailedDesc,
      colors: parsedColors,
      sizes: parsedSizes, // price, stock etc. per size
      details: parsedDetails,
      materialWashing: parsedMaterialWashing,
      sizeShape: parsedSizeShape,
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

exports.editProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const updatedFields = {
      productName: req.body.productName,
      productCode: req.body.productCode,
      category: req.body.category,
      brand: req.body.brand,
      description: req.body.description,
      detailedDescription: tryParseJSON(req.body.detailedDescription),
      colors: tryParseJSON(req.body.colors),
      sizes: tryParseJSON(req.body.sizes), // Updated size-wise pricing
      details: tryParseJSON(req.body.details),
      materialWashing: tryParseJSON(req.body.materialWashing),
      sizeShape: tryParseJSON(req.body.sizeShape),
    };

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
    const { id } = req.params; // Product ID
    const { size, stock, price, discountPrice, discountPercent } = req.body;

    if (!size) {
      return res
        .status(400)
        .json({ success: false, message: "Size is required for inventory update" });
    }

    const product = await Product.updateOne(
      { _id: id, "sizes.size": size },
      {
        $set: {
          "sizes.$.stock": Number(stock),
          "sizes.$.price": Number(price),
          "sizes.$.discountPrice": Number(discountPrice),
          "sizes.$.discountPercent": Number(discountPercent),
        },
      }
    );

    if (!product.matchedCount) {
      return res
        .status(404)
        .json({ success: false, message: "Product or size not found" });
    }

    res.status(200).json({ success: true, message: "Inventory updated" });
  } catch (error) {
    console.error("Error updating inventory:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
