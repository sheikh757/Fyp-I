const Rider = require('../models/Rider');
const bcrypt = require('bcryptjs');
const { generateVerificationCode, sendVerificationEmail } = require('../utils/email');
const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer'); // Uncomment if you plan to send emails for OTP

// @desc    Register a new rider
// @route   POST /api/rider/signup
// @access  Public
exports.signupRider = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if rider already exists
    let rider = await Rider.findOne({ email });
    if (rider) {
      return res.status(400).json({ message: 'Rider already exists' });
    }

    // Generate verification code and expiry
    const verificationCode = generateVerificationCode();
    const verificationCodeExpires = new Date(Date.now() + 180000); // 3 minutes from now

    // Create new rider
    rider = new Rider({
      name,
      email,
      password,
      verificationCode,
      verificationCodeExpires,
    });

    // Password will be hashed by the pre-save hook in the model
    await rider.save();

    // Send verification email
    const emailSent = await sendVerificationEmail(rider.email, verificationCode);
    if (!emailSent) {
      // Optionally, handle email sending failure (e.g., delete user or mark for retry)
      return res.status(500).json({ message: 'Failed to send verification email.' });
    }

    res.status(201).json({ message: 'Rider registered. Verification email sent.', userId: rider._id, verificationCodeExpires: verificationCodeExpires });
    console.log('Rider signup response - verificationCodeExpires:', verificationCodeExpires);

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Verify rider email with OTP
// @route   POST /api/rider/verify-email
// @access  Public
exports.verifyEmailRider = async (req, res) => {
  const { userId, otp } = req.body;

  try {
    const rider = await Rider.findById(userId);

    if (!rider) {
      return res.status(404).json({ message: 'Rider not found' });
    }

    if (rider.isVerified) {
      return res.status(400).json({ message: 'Email already verified.' });
    }

    // Check if OTP matches and is not expired
    if (rider.verificationCode !== otp) {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }

    if (new Date() > rider.verificationCodeExpires) {
      return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
    }

    // Mark user as verified
    rider.isVerified = true;
    rider.verificationCode = undefined; // Clear code after successful verification
    rider.verificationCodeExpires = undefined;
    await rider.save();

    res.status(200).json({ message: 'Email verified successfully.' });

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Authenticate rider & get token
// @route   POST /api/rider/login
// @access  Public
exports.loginRider = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if rider exists
    let rider = await Rider.findOne({ email });
    if (!rider) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // Check if email is verified (optional, but recommended)
    if (!rider.isVerified) {
      return res.status(400).json({ message: 'Please verify your email first.' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, rider.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: rider._id, role: 'rider' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );

    res.status(200).json({ 
      message: 'Rider logged in successfully', 
      riderId: rider._id,
      name: rider.name,
      token
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Resend OTP to rider
// @route   POST /api/rider/resend-otp
// @access  Public
exports.resendOtpRider = async (req, res) => {
  const { userId } = req.body;

  try {
    const rider = await Rider.findById(userId);

    if (!rider) {
      return res.status(404).json({ message: 'Rider not found.' });
    }

    // Generate new verification code and expiry
    const verificationCode = generateVerificationCode();
    const verificationCodeExpires = new Date(Date.now() + 180000); // 3 minutes from now

    rider.verificationCode = verificationCode;
    rider.verificationCodeExpires = verificationCodeExpires;
    await rider.save();

    // Send new verification email
    const emailSent = await sendVerificationEmail(rider.email, verificationCode);
    if (!emailSent) {
      return res.status(500).json({ message: 'Failed to send new verification email.' });
    }

    res.status(200).json({ message: 'New OTP sent successfully.', verificationCodeExpires: verificationCodeExpires });
    console.log('Rider resend OTP response - verificationCodeExpires:', verificationCodeExpires);

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get rider profile
// @route   GET /api/rider/profile/:id
// @access  Private (will add authentication middleware later)
exports.getRiderProfile = async (req, res) => {
  try {
    const rider = await Rider.findById(req.params.id).select('-password'); // Exclude password

    if (!rider) {
      return res.status(404).json({ message: 'Rider not found.' });
    }

    res.status(200).json(rider);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update rider profile
// @route   PUT /api/rider/profile/:id
// @access  Private (will add authentication middleware later)
exports.updateRiderProfile = async (req, res) => {
  const { name, email } = req.body; // Add other fields as needed

  try {
    let rider = await Rider.findById(req.params.id);

    if (!rider) {
      return res.status(404).json({ message: 'Rider not found.' });
    }

    // Update fields
    rider.name = name || rider.name;
    rider.email = email || rider.email;
    // Add more fields to update here

    await rider.save();

    res.status(200).json({ message: 'Profile updated successfully.', rider });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
}; 