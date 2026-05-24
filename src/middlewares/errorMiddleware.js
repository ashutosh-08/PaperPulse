/**
 * Catches all unhandled exceptions, mongoose validation failures, or explicit errors generated in routing blocks via next().
 * Provides standardized JSON output rather than crashing or exposing generic HTML stack traces to the Retailer app.
 *
 * @param {Error} err - Captured Error object carrying message properties.
 * @param {express.Request} req - Current request contextual environment.
 * @param {express.Response} res - Express Response object.
 * @param {express.NextFunction} next - Pass back execution logic flag.
 * @returns {void} Halts execution rendering payload explicitly.
 */
const errorHandler = (err, req, res, next) => {
  // Sets default to internal 500 error if standard res is inexplicably still sitting on 200 HTTP code success execution previously block.
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Dealing explicitly with special CastErrors triggered natively inside MongoDB schemas
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found or bad ObjectId string mapping.';
  }

  res.status(statusCode).json({
    message,
    // Emitting explicit stack trace map when explicitly set on developmental scopes
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { errorHandler };
