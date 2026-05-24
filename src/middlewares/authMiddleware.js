const jwt = require('jsonwebtoken');

/**
 * Authentication middleware supporting dual-mode token extraction.
 * Checks the Authorization header for Bearer tokens first, then falls back to HttpOnly cookies.
 *
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 * @param {express.NextFunction} next - Calls the next middleware on success.
 */
const protect = (req, res, next) => {
  let token = null;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'paperpulse_fallback_secret');
      req.retailerId = decoded.retailerId;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed verification.' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token provided.' });
  }
};

module.exports = { protect };
