const Customer = require('../models/Customer');
const bcrypt = require('bcryptjs');
const { generateVerificationCode, sendVerificationEmail } = require('../utils/email');
const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer'); // Uncomment if you plan to send emails for OTP

// @desc    Register a new customer
// @route   POST /api/customer/signup
// @access  Public
exports.signupCustomer = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if customer already exists
    let customer = await Customer.findOne({ email });
    if (customer) {
      return res.status(400).json({ message: 'Customer already exists' });
    }

    // Generate verification code and expiry
    const verificationCode = generateVerificationCode();
    const verificationCodeExpires = new Date(Date.now() + 180000); // 3 minutes from now

    // Create new customer
    customer = new Customer({
      name,
      email,
      password,
      verificationCode,
      verificationCodeExpires,
    });

    // Password will be hashed by the pre-save hook in the model
    await customer.save();

    // Send verification email
    const emailSent = await sendVerificationEmail(customer.email, verificationCode);
    if (!emailSent) {
      // Optionally, handle email sending failure (e.g., delete user or mark for retry)
      return res.status(500).json({ message: 'Failed to send verification email.' });
    }

    res.status(201).json({ message: 'Customer registered. Verification email sent.', userId: customer._id, verificationCodeExpires: verificationCodeExpires });
    console.log('Customer signup response - verificationCodeExpires:', verificationCodeExpires);

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Verify customer email with OTP
// @route   POST /api/customer/verify-email
// @access  Public
exports.verifyEmailCustomer = async (req, res) => {
  const { userId, otp } = req.body;

  try {
    const customer = await Customer.findById(userId);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    if (customer.isVerified) {
      return res.status(400).json({ message: 'Email already verified.' });
    }

    // Check if OTP matches and is not expired
    if (customer.verificationCode !== otp) {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }

    if (new Date() > customer.verificationCodeExpires) {
      return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
    }

    // Mark user as verified
    customer.isVerified = true;
    customer.verificationCode = undefined; // Clear code after successful verification
    customer.verificationCodeExpires = undefined;
    await customer.save();

    res.status(200).json({ message: 'Email verified successfully.' });

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Authenticate customer & get token
// @route   POST /api/customer/login
// @access  Public
exports.loginCustomer = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if customer exists
    let customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // Check if email is verified (optional, but recommended)
    if (!customer.isVerified) {
      return res.status(400).json({ message: 'Please verify your email first.' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: customer._id, role: 'customer' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );

    res.status(200).json({ 
      message: 'Customer logged in successfully', 
      customerId: customer._id,
      name: customer.name,
      email: customer.email,
      token
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Resend OTP to customer
// @route   POST /api/customer/resend-otp
// @access  Public
exports.resendOtpCustomer = async (req, res) => {
  const { userId } = req.body;

  try {
    const customer = await Customer.findById(userId);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found.' });
    }

    // Generate new verification code and expiry
    const verificationCode = generateVerificationCode();
    const verificationCodeExpires = new Date(Date.now() + 180000); // 3 minutes from now

    customer.verificationCode = verificationCode;
    customer.verificationCodeExpires = verificationCodeExpires;
    await customer.save();

    // Send new verification email
    const emailSent = await sendVerificationEmail(customer.email, verificationCode);
    if (!emailSent) {
      return res.status(500).json({ message: 'Failed to send new verification email.' });
    }

    res.status(200).json({ message: 'New OTP sent successfully.', verificationCodeExpires: verificationCodeExpires });
    console.log('Customer resend OTP response - verificationCodeExpires:', verificationCodeExpires);

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get customer profile
// @route   GET /api/customer/profile/:id
// @access  Private (will add authentication middleware later)
exports.getCustomerProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).select('-password'); // Exclude password

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found.' });
    }

    res.status(200).json(customer);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update customer profile
// @route   PUT /api/customer/profile/:id
// @access  Private (will add authentication middleware later)
exports.updateCustomerProfile = async (req, res) => {
  const { name, email } = req.body; // Add other fields as needed

  try {
    let customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found.' });
    }

    // Update fields
    customer.name = name || customer.name;
    customer.email = email || customer.email;
    // Add more fields to update here

    await customer.save();

    res.status(200).json({ message: 'Profile updated successfully.', customer });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
}; 