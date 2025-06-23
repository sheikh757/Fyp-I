const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      // Men's Categories
      'men_kurta', 'men_shalwar_kameez', 'men_waistcoat', 'men_sherwani', 'men_pajama', 'men_churidar',
      // Women's Categories
      'women_kurta', 'women_shalwar_kameez', 'women_lehenga', 'women_saree', 'women_gharara', 'women_frock',
      // Unisex Categories
      'unisex_footwear', 'unisex_accessories', 'unisex_bags'
    ]
  },
  colors: [{
    type: String,
    enum: ['white', 'black', 'navy_blue', 'maroon', 'bottle_green', 'peach', 'gold', 'silver']
  }],
  sizes: [{
    type: String
  }],
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female', 'unisex']
  },
  stitched: {
    type: Boolean,
    required: true,
    default: true
  },
  images: [{
    type: String // URLs to images
  }],
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better search performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, gender: 1 });
productSchema.index({ brand: 1 });

const Product = mongoose.model('Product', productSchema);

module.exports = Product; 