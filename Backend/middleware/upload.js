const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  console.log('Creating uploads directory:', uploadDir);
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('Multer destination called with file:', file);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now();
    const ext = path.extname(file.originalname);
    const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
    console.log('Generated filename:', filename);
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  console.log('File filter checking file:', file);
  const filetypes = /jpeg|jpg|png|gif/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    console.log('File accepted:', file.originalname);
    return cb(null, true);
  }
  console.log('File rejected:', file.originalname);
  cb(new Error('Error: Images Only!'));
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter,
});

// Add error handling middleware
const handleMulterError = (err, req, res, next) => {
  console.error('Multer error:', err);
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size too large. Maximum size is 10MB.' });
    }
    return res.status(400).json({ error: err.message });
  }
  next(err);
};

module.exports = { upload, handleMulterError }; 