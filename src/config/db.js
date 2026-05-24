const mongoose = require('mongoose');

/**
 * Establishes a connection to the MongoDB database using Mongoose.
 * This function uses the MONGODB_URI environment variable.
 * If the connection fails, the process exits with a status code of 1.
 *
 * @async
 * @function connectDB
 * @returns {Promise<void>} Resolves when the database connection is successfully established.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/paperpulse');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[CRITICAL] Error connection to MongoDB: ${error.message}`);
    console.warn('The PaperPulse engine is starting without database connectivity. Auth and scan-commit operations will fail until your IP is whitelisted in MongoDB Atlas.');
    // process.exit(1); 
  }
};

module.exports = connectDB;
