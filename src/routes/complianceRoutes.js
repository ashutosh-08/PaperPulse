const express = require('express');
const { getGSTStatus, getFSSAIStatus, getMCAStatus } = require('../controllers/complianceController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Apply Authentication sequentially across all underlying compliance actions
router.use(protect);

/**
 * Route handling GST Status Retrieval. 
 * Requires active valid JWT.
 * @route POST /api/compliance/gst
 */
router.post('/gst', getGSTStatus);

/**
 * Route enabling FSSAI License validation query parameters via body.
 * @route POST /api/compliance/fssai
 */
router.post('/fssai', getFSSAIStatus);

/**
 * Route delivering master metadata for Indian CIN properties from MCA.
 * @route POST /api/compliance/mca
 */
router.post('/mca', getMCAStatus);

module.exports = router;
