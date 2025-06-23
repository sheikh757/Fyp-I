const express = require('express');
const { signupRider, verifyEmailRider, loginRider, resendOtpRider, getRiderProfile, updateRiderProfile } = require('../controllers/riderController');

const router = express.Router();

router.post('/signup', signupRider);
router.post('/verify-email', verifyEmailRider);
router.post('/login', loginRider);
router.post('/resend-otp', resendOtpRider);
router.get('/profile/:id', getRiderProfile);
router.put('/profile/:id', updateRiderProfile);

module.exports = router; 