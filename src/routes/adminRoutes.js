const express = require('express');
const { verifyFullFlow } = require('../controllers/adminController');
const { upload } = require('../middlewares/uploadMiddleware');

const router = express.Router();

/**
 * Executes a single shot multipart parsing explicitly binding test targets bypassing strict API dependencies globally mapping Twilio limits autonomously against explicit phone numbers flexibly defining Sandbox bounds.
 * 
 * @route POST /api/admin/verify-full-flow
 */
router.post('/verify-full-flow', upload.single('certificate'), verifyFullFlow);

module.exports = router;
