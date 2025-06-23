const express = require('express');
const router = express.Router();
const {
  createProduct,
  getBrandProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  updateStock,
  getProductsByBrand
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/brand/:brandId', getProductsByBrand);

// Protected routes
router.route('/')
  .get(protect, authorize('brand'), getBrandProducts)
  .post(protect, authorize('brand'), createProduct);

router.route('/search')
  .get(protect, authorize('brand'), searchProducts);

router.route('/:id')
  .get(protect, authorize('brand'), getProduct)
  .put(protect, authorize('brand'), updateProduct)
  .delete(protect, authorize('brand'), deleteProduct);

router.route('/:id/stock')
  .put(protect, authorize('brand'), updateStock);

module.exports = router; 