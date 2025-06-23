const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { upload, handleMulterError } = require('../middleware/upload');

// Add logging middleware
router.use((req, res, next) => {
  console.log('Upload route accessed:', {
    method: req.method,
    path: req.path,
    headers: req.headers,
    body: req.body,
    files: req.files
  });
  next();
});

// Test endpoint
router.get('/test', (req, res) => {
  console.log('Test endpoint hit');
  res.json({ message: 'Upload route is working' });
});

// Handle both / and /upload paths
router.post(['/', '/upload'], 
  upload.single('image'),
  handleMulterError,
  uploadController.uploadImage
);

module.exports = router; 