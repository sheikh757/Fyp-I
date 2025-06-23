const express = require('express');
const { createOrder, getOrders, updateOrderStatus, getCustomerOrders } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.route('/').post(createOrder);

// Protected routes
router.route('/').get(protect, authorize('brand'), getOrders);
router.route('/customer/:customerId').get(getCustomerOrders);
router.route('/:id/status').put(protect, authorize('brand'), updateOrderStatus);

module.exports = router; 