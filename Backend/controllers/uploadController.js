const uploadImage = (req, res) => {
  console.log('Upload controller hit with request:', {
    file: req.file,
    body: req.body,
    headers: req.headers
  });

  try {
    if (!req.file) {
      console.error('No file uploaded');
      return res.status(400).json({ 
        success: false, 
        error: 'No file uploaded',
        details: 'The request did not contain a file'
      });
    }

    // Verify file exists
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
    
    if (!fs.existsSync(filePath)) {
      console.error('File not found after upload:', filePath);
      return res.status(500).json({ 
        success: false, 
        error: 'File upload failed',
        details: 'File was not saved properly'
      });
    }

    // Construct the image URL
    const imageUrl = `/uploads/${req.file.filename}`;
    console.log('Successfully uploaded image:', {
      filename: req.file.filename,
      path: filePath,
      url: imageUrl
    });

    res.status(200).json({ 
      success: true, 
      imageUrl,
      details: {
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
  } catch (error) {
    console.error('Error in upload controller:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error',
      details: error.message
    });
  }
};

module.exports = { uploadImage }; 