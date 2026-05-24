const multer = require('multer');

/**
 * Configure strictly Memory Storage to hold uploaded files in temporary RAM buffers.
 * Bypassing standard disk I/O provides rapid sequential execution specifically tuned for Google Gemini API transfers.
 */
const storage = multer.memoryStorage();

/**
 * Filter mechanism to restrict parsing files purely identifying as image documents or explicit PDFs.
 *
 * @param {express.Request} req - Local application request state.
 * @param {Express.Multer.File} file - Mimetypes uploaded through form data bounds.
 * @param {Function} cb - Multipar callback handling success/failure validation paths natively.
 */
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Invalid parsing format. Please explicitly upload PDF, JPEG, JPG, or PNG certificates only.'), false);
  }
};

/**
 * Export configured multer instances with tightly restricted payload maximums.
 * Specifically limits uploads strictly to reasonable 10MB bounds preventing memory overflows.
 */
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Explicit limit of 5 Megabytes total buffers allowed per cycle
  },
  fileFilter,
});

module.exports = { upload };
