import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import AppError from '../utils/appError.js';

export const protect = async (req, res, next) => {
  try {
    let token;
    
    // Parse Bearer Token header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('You are not logged in. Please sign in to perform this action.', 401));
    }

    // Verify token validity
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tadkamode-super-secret-key-development');

    // Verify user document still exists in cluster
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError('The account associated with this session no longer exists.', 401));
    }

    req.user = currentUser;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(new AppError('Your session has expired or is invalid. Please log in again.', 401));
    }
    return next(error);
  }
};

// Optional auth middleware (allows guest access but resolves user details if token is valid)
export const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tadkamode-super-secret-key-development');
    const currentUser = await User.findById(decoded.id);
    if (currentUser) {
      req.user = currentUser;
    }
    next();
  } catch (error) {
    next(); // Fail silently for guest access
  }
};
