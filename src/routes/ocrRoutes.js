const express = require('express');
const { scanDocument } = require('../controllers/ocrController');
const { upload } = require('../middlewares/uploadMiddleware');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * Specifically maps incoming multipar/form-data pushing isolated Native JSON buffers downstream strictly isolated from third-party verifications.
 * JSDoc: Evaluates explicitly mapped 5MB payload representations specifically designed for the Indian Document frameworks exclusively.
 * 
 * @route POST /api/ocr/scan
 */
router.post('/scan', protect, upload.single('certificate'), scanDocument);

module.exports = router;
