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
  price: Number,
  discountPrice: Number,
  discountPercent: Number,
  description: String,
  detailedDescription: {
    paragraph1: String,
    paragraph2: String,
  },
  colors: [ { name: String, hex: String } ],
  sizes: [String],
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
  materialWashing: [ { label: String, value: String } ],
  sizeShape: [ { label: String, value: String } ],
 stock: {
  type: Number,
  default: 0,
  validate: {
    validator: Number.isInteger,
    message: '{VALUE} is not an integer value for stock',
  },
}

}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
