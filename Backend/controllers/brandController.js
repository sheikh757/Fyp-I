const Brand = require('../models/Brand');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Add JWT import
// const nodemailer = require('nodemailer'); // Uncomment if you plan to send emails for OTP
const { generateVerificationCode, sendVerificationEmail } = require('../utils/email');

const verificationCodeExpires = new Date(Date.now() + 180000); // 3 minutes from now

// @desc    Register a new brand
// @route   POST /api/brand/signup
// @access  Public
exports.signupBrand = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if brand already exists
    let brand = await Brand.findOne({ email });
    if (brand) {
      return res.status(400).json({ message: 'Brand already exists' });
    }

    // Generate verification code and expiry
    const verificationCode = generateVerificationCode();
    const verificationCodeExpires = new Date(Date.now() + 180000); // 3 minutes from now

    // Create new brand
    brand = new Brand({
      name,
      email,
      password,
      verificationCode,
      verificationCodeExpires,
    });

    // Password will be hashed by the pre-save hook in the model
    await brand.save();

    // Send verification email
    const emailSent = await sendVerificationEmail(brand.email, verificationCode);
    if (!emailSent) {
      // Optionally, handle email sending failure (e.g., delete user or mark for retry)
      return res.status(500).json({ message: 'Failed to send verification email.' });
    }

    res.status(201).json({ message: 'Brand registered. Verification email sent.', userId: brand._id, verificationCodeExpires: verificationCodeExpires });
    console.log('Brand signup response - verificationCodeExpires:', verificationCodeExpires);

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Verify brand email with OTP
// @route   POST /api/brand/verify-email
// @access  Public
exports.verifyEmailBrand = async (req, res) => {
  const { userId, otp } = req.body;

  try {
    const brand = await Brand.findById(userId);

    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    if (brand.isVerified) {
      return res.status(400).json({ message: 'Email already verified.' });
    }

    // Check if OTP matches and is not expired
    if (brand.verificationCode !== otp) {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }

    if (new Date() > brand.verificationCodeExpires) {
      return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
    }

    // Mark user as verified
    brand.isVerified = true;
    brand.verificationCode = undefined; // Clear code after successful verification
    brand.verificationCodeExpires = undefined;
    await brand.save();

    res.status(200).json({ message: 'Email verified successfully.' });

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Authenticate brand & get token
// @route   POST /api/brand/login
// @access  Public
exports.loginBrand = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if brand exists
    let brand = await Brand.findOne({ email });
    if (!brand) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // Check if email is verified (optional, but recommended)
    if (!brand.isVerified) {
      return res.status(400).json({ message: 'Please verify your email first.' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, brand.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: brand._id, role: 'brand' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );

    res.status(200).json({ 
      message: 'Brand logged in successfully', 
      brandId: brand._id,
      name: brand.name,
      token 
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Resend OTP to brand
// @route   POST /api/brand/resend-otp
// @access  Public
exports.resendOtpBrand = async (req, res) => {
  const { userId } = req.body;

  try {
    const brand = await Brand.findById(userId);

    if (!brand) {
      return res.status(404).json({ message: 'Brand not found.' });
    }

    // Generate new verification code and expiry
    const verificationCode = generateVerificationCode();
    const verificationCodeExpires = new Date(Date.now() + 180000); // 3 minutes from now

    brand.verificationCode = verificationCode;
    brand.verificationCodeExpires = verificationCodeExpires;
    await brand.save();

    // Send new verification email
    const emailSent = await sendVerificationEmail(brand.email, verificationCode);
    if (!emailSent) {
      return res.status(500).json({ message: 'Failed to send new verification email.' });
    }

    res.status(200).json({ message: 'New OTP sent successfully.', verificationCodeExpires: verificationCodeExpires });
    console.log('Brand resend OTP response - verificationCodeExpires:', verificationCodeExpires);

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get brand profile
// @route   GET /api/brand/profile/:id
// @access  Private (will add authentication middleware later)
exports.getBrandProfile = async (req, res) => {
  try {
    console.log('BrandController: Attempting to get profile for ID:', req.params.id);
    const brand = await Brand.findById(req.params.id).select('-password'); // Exclude password

    if (!brand) {
      console.log('BrandController: Brand not found for ID:', req.params.id);
      return res.status(404).json({ message: 'Brand not found.' });
    }

    console.log('BrandController: Sending brand profile data:', brand);
    res.status(200).json(brand);
  } catch (error) {
    console.error('BrandController - Get Profile Error:', error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update brand profile
// @route   PUT /api/brand/profile/:id
// @access  Private (will add authentication middleware later)
exports.updateBrandProfile = async (req, res) => {
  const { name, email, phone } = req.body; // Add phone here

  try {
    console.log('BrandController: Attempting to update profile for ID:', req.params.id, 'with data:', req.body);
    let brand = await Brand.findById(req.params.id);

    if (!brand) {
      console.log('BrandController: Brand not found for ID:', req.params.id);
      return res.status(404).json({ message: 'Brand not found.' });
    }

    // Update fields
    brand.name = name || brand.name;
    brand.email = email || brand.email;
    brand.phone = phone || brand.phone; // Update phone field

    await brand.save();
    console.log('BrandController: Brand profile updated successfully:', brand);
    res.status(200).json({ message: 'Profile updated successfully.', brand });
  } catch (error) {
    console.error('BrandController - Update Profile Error:', error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all brands
// @route   GET /api/brand/all
// @access  Public
exports.getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find({ isVerified: true })
      .select('name email phone')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: brands.length,
      data: brands
    });
  } catch (error) {
    console.error('Error in getAllBrands:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}; 