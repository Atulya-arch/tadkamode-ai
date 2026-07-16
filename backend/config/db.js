import mongoose from 'mongoose';

/**
 * Connects backend to MongoDB instance
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tadkamode');
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database] Connection Error: ${error.message}`);
    // Only crash the process in production. In development/testing, allow the server to run.
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    } else {
      console.warn('[Database] Warning: MongoDB connection failed. Database features will be unavailable.');
    }
  }
};

export default connectDB;
