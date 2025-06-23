const express = require('express');
const { signupCustomer, verifyEmailCustomer, loginCustomer, resendOtpCustomer, getCustomerProfile, updateCustomerProfile } = require('../controllers/customerController');

const router = express.Router();

router.post('/signup', signupCustomer);
router.post('/verify-email', verifyEmailCustomer);
router.post('/login', loginCustomer);
router.post('/resend-otp', resendOtpCustomer);
router.get('/profile/:id', getCustomerProfile);
router.put('/profile/:id', updateCustomerProfile);

module.exports = router; 