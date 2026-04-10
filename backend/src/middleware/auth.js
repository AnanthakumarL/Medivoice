const jwt = require('jsonwebtoken');
const User = require('../models/User-enhanced');
const logger = require('../config/logger');

/**
 * Authentication middleware to verify JWT tokens and authenticate users
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
        error: 'AUTHENTICATION_REQUIRED'
      });
    }

    // Extract token from "Bearer <token>" format
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token format.',
        error: 'INVALID_TOKEN_FORMAT'
      });
    }

    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token has expired. Please login again.',
          error: 'TOKEN_EXPIRED'
        });
      } else if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token. Please login again.',
          error: 'INVALID_TOKEN'
        });
      } else {
        throw jwtError;
      }
    }

    // Find user by ID from token
    const user = await User.findById(decoded.userId)
      .select('-password -refreshTokens')
      .lean();

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Please login again.',
        error: 'USER_NOT_FOUND'
      });
    }

    // Check if user account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.',
        error: 'ACCOUNT_DEACTIVATED'
      });
    }

    // Check if user account is locked
    if (user.accountLock && user.accountLock.isLocked) {
      const unlockTime = new Date(user.accountLock.lockedUntil);
      if (unlockTime > new Date()) {
        return res.status(423).json({
          success: false,
          message: `Account is locked until ${unlockTime.toISOString()}. Please try again later.`,
          error: 'ACCOUNT_LOCKED',
          lockedUntil: unlockTime
        });
      }
    }

    // Check if email is verified (if email verification is required)
    if (process.env.REQUIRE_EMAIL_VERIFICATION === 'true' && !user.emailVerification.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email address before accessing this resource.',
        error: 'EMAIL_NOT_VERIFIED'
      });
    }

    // Add user to request object
    req.user = user;
    req.userId = user._id.toString();

    // Log successful authentication
    logger.info('User authenticated successfully', {
      userId: user._id,
      email: user.email,
      role: user.role,
      endpoint: req.originalUrl,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    next();
  } catch (error) {
    logger.error('Authentication error:', {
      error: error.message,
      stack: error.stack,
      endpoint: req.originalUrl,
      method: req.method,
      ip: req.ip
    });

    res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.',
      error: 'AUTHENTICATION_ERROR'
    });
  }
};

/**
 * Optional authentication middleware - authenticates if token is present but doesn't require it
 */
const optionalAuthenticate = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      // No token provided, continue without authentication
      return next();
    }

    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    if (!token) {
      // Invalid token format, continue without authentication
      return next();
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId)
        .select('-password -refreshTokens')
        .lean();

      if (user && user.isActive) {
        req.user = user;
        req.userId = user._id.toString();
      }
    } catch (jwtError) {
      // Token verification failed, continue without authentication
      logger.warn('Optional authentication failed:', {
        error: jwtError.message,
        endpoint: req.originalUrl,
        ip: req.ip
      });
    }

    next();
  } catch (error) {
    logger.error('Optional authentication error:', {
      error: error.message,
      stack: error.stack,
      endpoint: req.originalUrl,
      ip: req.ip
    });

    // Continue without authentication on error
    next();
  }
};

/**
 * Authorization middleware to check user roles
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required.',
          error: 'AUTHENTICATION_REQUIRED'
        });
      }

      if (!allowedRoles.includes(req.user.role)) {
        logger.warn('Authorization failed - insufficient permissions:', {
          userId: req.user._id,
          userRole: req.user.role,
          requiredRoles: allowedRoles,
          endpoint: req.originalUrl,
          method: req.method,
          ip: req.ip
        });

        return res.status(403).json({
          success: false,
          message: `Access denied. Required role: ${allowedRoles.join(' or ')}.`,
          error: 'INSUFFICIENT_PERMISSIONS',
          userRole: req.user.role,
          requiredRoles: allowedRoles
        });
      }

      next();
    } catch (error) {
      logger.error('Authorization error:', {
        error: error.message,
        stack: error.stack,
        userId: req.user?._id,
        endpoint: req.originalUrl,
        ip: req.ip
      });

      res.status(500).json({
        success: false,
        message: 'Internal server error during authorization.',
        error: 'AUTHORIZATION_ERROR'
      });
    }
  };
};

/**
 * Resource ownership middleware - checks if user owns the resource or has admin privileges
 */
const checkResourceOwnership = (resourceIdParam = 'id', userIdField = 'user') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required.',
          error: 'AUTHENTICATION_REQUIRED'
        });
      }

      // Admin and super admin can access any resource
      if (['admin', 'super_admin'].includes(req.user.role)) {
        return next();
      }

      const resourceId = req.params[resourceIdParam];
      
      if (!resourceId) {
        return res.status(400).json({
          success: false,
          message: `Resource ID parameter '${resourceIdParam}' is required.`,
          error: 'MISSING_RESOURCE_ID'
        });
      }

      // For user resources, check if the user owns the resource
      if (userIdField === 'user' && resourceId === req.userId) {
        return next();
      }

      // For other resources, you might need to query the database
      // This is a basic implementation - extend as needed for specific resources
      req.resourceId = resourceId;
      next();
    } catch (error) {
      logger.error('Resource ownership check error:', {
        error: error.message,
        stack: error.stack,
        userId: req.user?._id,
        resourceId: req.params[resourceIdParam],
        endpoint: req.originalUrl,
        ip: req.ip
      });

      res.status(500).json({
        success: false,
        message: 'Internal server error during resource ownership check.',
        error: 'OWNERSHIP_CHECK_ERROR'
      });
    }
  };
};

/**
 * Middleware to check if user has completed profile setup
 */
const requireProfileSetup = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
        error: 'AUTHENTICATION_REQUIRED'
      });
    }

    // Check if profile is complete based on role
    const user = req.user;
    let isProfileComplete = true;
    let missingFields = [];

    // Basic required fields for all users
    if (!user.firstName) {
      isProfileComplete = false;
      missingFields.push('firstName');
    }
    if (!user.lastName) {
      isProfileComplete = false;
      missingFields.push('lastName');
    }
    if (!user.phone) {
      isProfileComplete = false;
      missingFields.push('phone');
    }

    // Role-specific checks
    if (user.role === 'patient') {
      if (!user.dateOfBirth) {
        isProfileComplete = false;
        missingFields.push('dateOfBirth');
      }
      if (!user.gender) {
        isProfileComplete = false;
        missingFields.push('gender');
      }
    }

    if (!isProfileComplete) {
      return res.status(400).json({
        success: false,
        message: 'Profile setup is incomplete. Please complete your profile before accessing this resource.',
        error: 'INCOMPLETE_PROFILE',
        missingFields: missingFields
      });
    }

    next();
  } catch (error) {
    logger.error('Profile setup check error:', {
      error: error.message,
      stack: error.stack,
      userId: req.user?._id,
      endpoint: req.originalUrl,
      ip: req.ip
    });

    res.status(500).json({
      success: false,
      message: 'Internal server error during profile setup check.',
      error: 'PROFILE_CHECK_ERROR'
    });
  }
};

/**
 * Middleware to validate API key for external integrations
 */
const validateApiKey = async (req, res, next) => {
  try {
    const apiKey = req.header('X-API-Key');
    
    if (!apiKey) {
      return res.status(401).json({
        success: false,
        message: 'API key required.',
        error: 'API_KEY_REQUIRED'
      });
    }

    // Validate API key format and check against stored keys
    // This is a basic implementation - extend based on your API key management strategy
    const validApiKeys = process.env.VALID_API_KEYS?.split(',') || [];
    
    if (!validApiKeys.includes(apiKey)) {
      return res.status(401).json({
        success: false,
        message: 'Invalid API key.',
        error: 'INVALID_API_KEY'
      });
    }

    req.apiKey = apiKey;
    req.isApiAccess = true;
    
    logger.info('API key validated successfully', {
      apiKey: apiKey.substring(0, 8) + '...',
      endpoint: req.originalUrl,
      method: req.method,
      ip: req.ip
    });

    next();
  } catch (error) {
    logger.error('API key validation error:', {
      error: error.message,
      stack: error.stack,
      endpoint: req.originalUrl,
      ip: req.ip
    });

    res.status(500).json({
      success: false,
      message: 'Internal server error during API key validation.',
      error: 'API_KEY_VALIDATION_ERROR'
    });
  }
};

module.exports = {
  authenticate,
  optionalAuthenticate,
  authorize,
  checkResourceOwnership,
  requireProfileSetup,
  validateApiKey
};