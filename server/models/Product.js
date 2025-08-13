const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  type: { type: String, enum: ['image', 'video'], required: true },
  url: { type: String, required: true },
}, { _id: false });

const productSchema = new mongoose.Schema({
  productCode: { type: String, required: true, unique: true, uppercase: true, trim: true },
  productName: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  brand: String,
  media: [mediaSchema],
  thumbnail: String,
  description: String,
  detailedDescription: {
    paragraph1: String,
    paragraph2: String,
  },

  colors: [{ name: String, hex: String }],

  // Size-wise pricing & stock
  sizes: [{
    size: { type: String, required: true },          
    price: { type: Number, required: true },         
    discountPrice: { type: Number },                  
    stock: { type: Number, required: true, default: 0 } 
  }],

  details: {
    fabric: String,
    fitType: String,
    length: String,
    sleeveNeckType: String,
    patternPrint: String,
    occasionType: String,
    washCare: String,
    countryOfOrigin: String,
    deliveryReturns: String,
  },

  materialWashing: [{ label: String, value: String }],
  sizeShape: [{ label: String, value: String }],

}, { timestamps: true });

// Virtual field: product in stock if any size has stock
productSchema.virtual('inStock').get(function () {
  return this.sizes.some(s => s.stock > 0);
});

// Ensure virtual fields are serialized
productSchema.set('toObject', { virtuals: true });
productSchema.set('toJSON', { virtuals: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
