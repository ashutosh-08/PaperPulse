const express = require('express');
const { registerRetailer, loginRetailer } = require('../controllers/authController');

const router = express.Router();

/**
 * Handle new registrations assigning initial cookies locally mapping to logic.
 * @route POST /api/auth/register
 */
router.post('/register', registerRetailer);

/**
 * Maps authentication workflow to explicit login attempt verifying securely stored hashes.
 * @route POST /api/auth/login
 */
router.post('/login', loginRetailer);

module.exports = router;
