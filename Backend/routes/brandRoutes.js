const express = require('express');
const { signupBrand, verifyEmailBrand, loginBrand, resendOtpBrand, getBrandProfile, updateBrandProfile, getAllBrands } = require('../controllers/brandController');

const router = express.Router();

router.post('/signup', signupBrand);
router.post('/verify-email', verifyEmailBrand);
router.post('/login', loginBrand);
router.post('/resend-otp', resendOtpBrand);
router.get('/profile/:id', getBrandProfile);
router.get('/all', getAllBrands);
router.put('/profile/:id', updateBrandProfile);

module.exports = router; 