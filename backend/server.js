import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import recipeRouter from './routes/recipe.routes.js';
import authRouter from './routes/auth.routes.js';
import AppError from './utils/appError.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// 1. Establish Database Connection (MongoDB)
// In local development, we allow the server to run even if MongoDB isn't running yet (though connection logs will show errors),
// but in production, we typically want DB connectivity established.
connectDB();

// 2. Global Middlewares
app.use(helmet()); // Security headers
app.use(cors({
  origin: '*', // We can restrict this to specific origins (e.g. localhost:5173) in production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsers with payload limitation
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 3. API Routes
app.use('/api/recipes', recipeRouter);
app.use('/api/auth', authRouter);

// Health Check Endpoint
app.use('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV
  });
});

// Catch-all route for unhandled routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 4. Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log full error details on the server for debugging
  console.error(`[Error Boundary] ${err.statusCode} - ${err.message}`, err.stack);

  if (process.env.NODE_ENV === 'development') {
    // Send detailed error in development
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err
    });
  }

  // Send simplified error in production
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }

  // Programming/unknown errors: don't leak leak details to client
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong on our end. Please try again later.'
  });
});

// 5. Start Server
const server = app.listen(PORT, () => {
  console.log(`[Server] TadkaMode Backend running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// 6. Graceful Shutdown Handlers
const gracefulShutdown = (signal) => {
  console.log(`[Server] Received ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    console.log('[Server] HTTP server closed.');
    try {
      await mongoose.disconnect();
      console.log('[Database] MongoDB connection closed.');
      process.exit(0);
    } catch (err) {
      console.error('[Database] Error closing MongoDB connection:', err);
      process.exit(1);
    }
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
