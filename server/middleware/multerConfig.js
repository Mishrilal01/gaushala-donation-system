/**
 * Multer Configuration for File Uploads
 * Handles image uploads for expenses
 * Files are stored in memory and uploaded to Supabase Storage
 */

const multer = require('multer');

// Use memory storage since files will be uploaded to Supabase Storage
const memoryStorage = multer.memoryStorage();

// File filter for expense images (jpg, png only)
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('केवल JPEG और PNG छवियां अनुमत हैं / Only JPEG and PNG images are allowed'), false);
  }
};

// Multer upload instance for expense images (max 5MB)
const uploadExpenseImage = multer({
  storage: memoryStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit for Supabase
});

/**
 * Middleware wrapper for multer with error handling
 */
const uploadExpenseImageMiddleware = (req, res, next) => {
  uploadExpenseImage.single('billImage')(req, res, (err) => {
    if (err) {
      // Handle multer errors
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
          success: false,
          message: 'फाइल बहुत बड़ी है / File size exceeds 5MB limit'
        });
      }
      
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
          success: false,
          message: 'फाइल अपेक्षित नहीं है / Unexpected file field'
        });
      }

      return res.status(400).json({
        success: false,
        message: err.message || 'फाइल अपलोड विफल रहा / File upload failed'
      });
    }
    next();
  });
};

module.exports = {
  uploadExpenseImage: uploadExpenseImageMiddleware
};
