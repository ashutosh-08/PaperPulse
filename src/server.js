require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const { startExpiryWorker } = require('./utils/expiryWorker');

const PORT = process.env.PORT || 5000;

/**
 * Initializes the server component of the Backend application.
 * Connects to the primary MongoDB database immediately.
 * After establishing connection safely binding the express application locally on mapped PORT.
 * Handles process exceptions asynchronously.
 *
 * @async
 * @function startServer
 * @returns {Promise<void>}
 */
const startServer = async () => {
  try {
    await connectDB();
    
    // Boot Worker executing background Document analysis directly post-connection logic
    startExpiryWorker();

    app.listen(PORT, () => {
      console.log(`Server is running robustly on mode: ${process.env.NODE_ENV || 'development'}`);
      console.log(`PaperPulse API accessible on port: ${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to launch PaperPulse server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
