const Product = require('../models/Product');

// Create a new product
exports.createProduct = async (req, res) => {
  console.log('createProduct controller hit.');
  console.log('Request body for product creation:', req.body);
  try {
    const productData = {
      ...req.body,
      brand: req.body.brand // Use brand ID from request body
    };

    const product = new Product(productData);
    console.log('Attempting to save new product:', productData);
    await product.save();

    console.log('Product saved successfully:', product);
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error in createProduct controller:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get all products for a brand
exports.getBrandProducts = async (req, res) => {
  try {
    console.log('getBrandProducts: Fetching products for brand ID:', req.brandId);
    const products = await Product.find({ brand: req.brandId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error in getBrandProducts:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      brand: req.brand._id
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, brand: req.brand._id },
      req.body,
      {
        new: true
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      brand: req.brand._id
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Search products
exports.searchProducts = async (req, res) => {
  try {
    const { query, category, gender, minPrice, maxPrice } = req.query;
    
    let searchQuery = { brand: req.brand._id };

    if (query) {
      searchQuery.$text = { $search: query };
    }

    if (category) {
      searchQuery.category = category;
    }

    if (gender) {
      searchQuery.gender = gender;
    }

    if (minPrice || maxPrice) {
      searchQuery.price = {};
      if (minPrice) searchQuery.price.$gte = Number(minPrice);
      if (maxPrice) searchQuery.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(searchQuery)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update product stock
exports.updateStock = async (req, res) => {
  try {
    const { stock } = req.body;
    
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, brand: req.brand._id },
      { stock },
      {
        new: true
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get all products for a specific brand
// @route   GET /api/product/brand/:brandId
// @access  Public
exports.getProductsByBrand = async (req, res) => {
  try {
    const products = await Product.find({ brand: req.params.brandId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error in getProductsByBrand:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}; 