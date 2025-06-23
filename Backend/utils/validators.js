const validateProduct = (product) => {
  const errors = {};

  // Name validation
  if (!product.name || product.name.trim() === '') {
    errors.name = 'Product name is required';
  } else if (product.name.length < 3) {
    errors.name = 'Product name must be at least 3 characters long';
  }

  // Description validation
  if (!product.description || product.description.trim() === '') {
    errors.description = 'Product description is required';
  } else if (product.description.length < 10) {
    errors.description = 'Product description must be at least 10 characters long';
  }

  // Price validation
  if (!product.price) {
    errors.price = 'Product price is required';
  } else if (isNaN(product.price) || product.price <= 0) {
    errors.price = 'Product price must be a positive number';
  }

  // Category validation
  if (!product.category || product.category.trim() === '') {
    errors.category = 'Product category is required';
  }

  // Brand validation
  if (!product.brand || product.brand.trim() === '') {
    errors.brand = 'Brand name is required';
  }

  // Stock validation
  if (product.stock === undefined || product.stock === null) {
    errors.stock = 'Stock quantity is required';
  } else if (isNaN(product.stock) || product.stock < 0) {
    errors.stock = 'Stock quantity must be a non-negative number';
  }

  // Image validation
  if (!product.image || product.image.trim() === '') {
    errors.image = 'Product image is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

const validateUpdateProduct = (product) => {
  const errors = {};

  // Name validation (optional for updates)
  if (product.name !== undefined) {
    if (product.name.trim() === '') {
      errors.name = 'Product name cannot be empty';
    } else if (product.name.length < 3) {
      errors.name = 'Product name must be at least 3 characters long';
    }
  }

  // Description validation (optional for updates)
  if (product.description !== undefined) {
    if (product.description.trim() === '') {
      errors.description = 'Product description cannot be empty';
    } else if (product.description.length < 10) {
      errors.description = 'Product description must be at least 10 characters long';
    }
  }

  // Price validation (optional for updates)
  if (product.price !== undefined) {
    if (isNaN(product.price) || product.price <= 0) {
      errors.price = 'Product price must be a positive number';
    }
  }

  // Stock validation (optional for updates)
  if (product.stock !== undefined) {
    if (isNaN(product.stock) || product.stock < 0) {
      errors.stock = 'Stock quantity must be a non-negative number';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

module.exports = {
  validateProduct,
  validateUpdateProduct
}; 