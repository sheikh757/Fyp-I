const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: false,
  },
  verificationCode: {
    type: String,
  },
  verificationCodeExpires: {
    type: Date,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  // Add any other customer-specific fields here
});

// Hash the password before saving
CustomerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('Customer', CustomerSchema); 