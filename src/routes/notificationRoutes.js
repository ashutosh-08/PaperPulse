const express = require('express');
const { testManualTrigger, debugTrigger } = require('../controllers/notificationController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * Specifically maps testing endpoints pushing isolated Notifications globally triggering SMTP and WhatsApp simultaneously.
 * JSDoc: Evaluates explicitly mapped developer interfaces exclusively natively for Viva presentations.
 * 
 * @route POST /api/notifications/test-trigger
 */
router.post('/test-trigger', protect, testManualTrigger);

// Public debug endpoint (no auth) to quickly test email/WhatsApp providers with custom payloads
router.post('/debug-trigger', debugTrigger);

module.exports = router;
