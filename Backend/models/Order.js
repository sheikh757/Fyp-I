const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  customerInfo: {
    fullName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer', // Assuming you have a Customer model
    required: true,
  },
  product: {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    selectedColor: {
      type: String,
    },
    selectedSize: {
      type: String,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    image: {
      type: String,
    },
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['Cash on Delivery', 'Credit Card', 'PayPal'], // Add more as needed
    required: true,
  },
  orderStatus: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  deliveryDate: {
    type: Date,
  },
  // If you later implement user authentication for customers, you can link orders to users
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer', // Assuming you have a Customer model
    required: false, // For now, allow orders without a linked user if customers aren't authenticated on checkout
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema); 