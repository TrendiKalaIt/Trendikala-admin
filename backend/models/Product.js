import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discountPrice: {
    type: Number,
  },
  category: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
  },
  fabric: {
    type: String,
  },
  pattern: {
    type: String,
  },
  washCare: {
    type: String,
  },
  deliveryReturn: {
    type: String,
  },
  fitType: {
    type: String,
  },
  occasionType: {
    type: String,
  },
  countryOrigin: {
    type: String,
  },
  colors: {
    type: [String],
    default: [],
  },
  sizes: {
    type: [String],
    default: [],
  },
  images: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", productSchema);
export default Product;
