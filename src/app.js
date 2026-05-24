const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || 'http://localhost:3000',
      'http://localhost:5174',
      'http://localhost:5173', // Allow Vite dev server
    ],
    credentials: true,
  })
);

/**
 * Health check route meant to verify if the Application server is running correctly.
 * 
 * @route GET /api/health
 * @param {express.Request} req - Express Request object
 * @param {express.Response} res - Express Response object
 * @returns {Object} JSON response containing the server status configuration.
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'PaperPulse API API' });
});

const complianceRoutes = require('./routes/complianceRoutes');
const authRoutes = require('./routes/authRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const ocrRoutes = require('./routes/ocrRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { errorHandler } = require('./middlewares/errorMiddleware');

// Mount the route integrations seamlessly
app.use('/api/auth', authRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/compliance', complianceRoutes);
app.use('/api/ocr', ocrRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Register ultimate generic error handler to interpret unhandled promises securely downstream
app.use(errorHandler);

module.exports = app;
