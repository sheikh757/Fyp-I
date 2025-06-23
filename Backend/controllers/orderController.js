const Order = require('../models/Order');
const Product = require('../models/Product'); // Needed to check product stock

// @desc    Create a new order
// @route   POST /api/orders
// @access  Public (or Private if customer authentication is implemented)
exports.createOrder = async (req, res) => {
  const {
    customerInfo,
    product: cartProduct,
    paymentMethod,
    customerId, // Added customerId from request body
  } = req.body;

  try {
    // Calculate total price based on product price and quantity
    if (!cartProduct || !cartProduct.price || !cartProduct.quantity) {
      return res.status(400).json({ message: 'Product details are incomplete.' });
    }
    const totalPrice = cartProduct.price * cartProduct.quantity;

    // Create the order
    const order = new Order({
      customerInfo,
      product: cartProduct,
      totalPrice,
      paymentMethod,
      customerId, // Save customerId with the order
      // orderStatus will default to 'Pending' as per schema
      // user field can be added if customer is authenticated (req.user.id)
    });

    await order.save();

    // Optionally, update product stock (decrement)
    const product = await Product.findById(cartProduct.productId);
    if (product) {
      if (product.stock >= cartProduct.quantity) {
        product.stock -= cartProduct.quantity;
        await product.save();
      } else {
        // Handle insufficient stock (though frontend should ideally prevent this)
        console.warn(`Insufficient stock for product ${product.name}. Order placed but stock not updated.`);
        // You might want to revert the order or mark it as problematic
      }
    }

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    console.error('Error creating order:', error.message);
    // Check for Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Get all orders or orders for a specific customer
// @route   GET /api/orders
// @route   GET /api/orders/customer/:customerId
// @access  Public (or Private)
exports.getOrders = async (req, res) => {
  try {
    let query = {};
    
    // If customerId is provided in params, filter by customer
    if (req.params.customerId) {
      query.customerId = req.params.customerId;
    }
    
    // If brandId is provided in the request (from auth middleware), filter by brand
    if (req.brandId) {
      query['product.productId'] = { $exists: true };
    }

    const orders = await Order.find(query)
      .populate({
        path: 'product.productId',
        match: { brand: req.brandId }
      })
      .sort({ createdAt: -1 }); // Sort by newest first
    
    // Filter out orders where the populated product is null (doesn't match brand)
    const filteredOrders = orders.filter(order => order.product.productId !== null);
    
    res.status(200).json({ 
      success: true, 
      count: filteredOrders.length, 
      data: filteredOrders 
    });
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Server Error' 
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Brand only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      });
    }

    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update only the status field
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: { orderStatus: status } },
      { new: true, runValidators: false } // Disable validators since we're only updating status
    );

    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

exports.getCustomerOrders = async (req, res) => {
  try {
    const { customerId } = req.params;
    
    if (!customerId) {
      return res.status(400).json({
        success: false,
        message: 'Customer ID is required'
      });
    }

    const orders = await Order.find({ customerId })
      .populate('product.productId', 'name price images')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders'
    });
  }
}; 