const jwt = require('jsonwebtoken');
const Brand = require('../models/Brand');

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Set both user and brand information
    req.user = decoded;
    
    if (decoded.role === 'brand') {
      const brand = await Brand.findById(decoded.id);
      if (!brand) {
        return res.status(401).json({ message: 'Brand not found' });
      }
      req.brandId = decoded.id; // Set brandId for brand-specific queries
    }
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication required' });
  }
};

// Authorize by role
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'You do not have permission to perform this action' 
      });
    }

    next();
  };
}; 