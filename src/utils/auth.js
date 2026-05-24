const jwt = require('jsonwebtoken');

/**
 * Generates a signed JWT token for authenticated session management.
 * Returns the token string directly for Bearer-based frontend consumption.
 *
 * @function generateToken
 * @param {string|mongoose.Types.ObjectId} retailerId - Unique Database ID identifying the logged-in user.
 * @returns {string} Signed JWT token string.
 */
const generateToken = (retailerId) => {
  return jwt.sign({ retailerId }, process.env.JWT_SECRET || 'paperpulse_fallback_secret', {
    expiresIn: '15d',
  });
};

module.exports = { generateToken };
