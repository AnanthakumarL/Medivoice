const jwt = require('jsonwebtoken');
const Patient = require('../models/Patient-enhanced');
const User = require('../models/User-enhanced');

// Enhanced authentication middleware matching your frontend's role system
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Extract token (Bearer token format)
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token format.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    
    // Handle demo users (matching your frontend demo store)
    if (decoded.isDemoUser) {
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        isDemoUser: true,
        fullName: decoded.fullName || `Demo ${decoded.role}`
      };
      return next();
    }

    // Get user from database for real users
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. User not found.'
      });
    }

    // Check if user account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Account is deactivated.'
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({
        success: false,
        message: 'Access denied. Account is temporarily locked.'
      });
    }

    // Attach user to request
    req.user = {
      userId: user._id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
      isEmailVerified: user.isEmailVerified,
      preferences: user.preferences
    };

    next();

  } catch (error) {
    console.error('Authentication middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Token expired.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Authentication error.'
    });
  }
};

// Role-based authorization middleware (matching your frontend's 5 roles)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Authentication required.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required roles: ${roles.join(', ')}`
      });
    }

    next();
  };
};

// Specific role middleware functions
const requirePatient = authorize('patient');
const requireDoctor = authorize('doctor');
const requireStaff = authorize('staff');
const requireLaboratory = authorize('laboratory');
const requireAdmin = authorize('admin');

// Combined role middleware for medical staff
const requireMedicalStaff = authorize('doctor', 'staff', 'admin');

// Combined role middleware for healthcare providers
const requireHealthcareProvider = authorize('doctor', 'laboratory', 'staff', 'admin');

// Optional authentication (for public routes that benefit from user context)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      req.user = null;
      return next();
    }

    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    
    // Handle demo users
    if (decoded.isDemoUser) {
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        isDemoUser: true,
        fullName: decoded.fullName || `Demo ${decoded.role}`
      };
      return next();
    }

    // Get real user
    const user = await User.findById(decoded.userId).select('-password');
    
    if (user && user.isActive && !user.isLocked) {
      req.user = {
        userId: user._id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        isEmailVerified: user.isEmailVerified,
        preferences: user.preferences
      };
    } else {
      req.user = null;
    }

    next();

  } catch (error) {
    // For optional auth, we don't fail on token errors
    req.user = null;
    next();
  }
};

// Check if user owns the resource or has admin privileges
const checkResourceOwnership = (resourceUserIdField = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Admin can access all resources
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if user owns the resource
    const resourceUserId = req.body[resourceUserIdField] || 
                          req.params[resourceUserIdField] || 
                          req.query[resourceUserIdField];

    if (resourceUserId && resourceUserId.toString() === req.user.userId.toString()) {
      return next();
    }

    // For some resources, check alternative ownership patterns
    if (req.params.id || req.params.userId) {
      const targetId = req.params.id || req.params.userId;
      if (targetId === req.user.userId.toString()) {
        return next();
      }
    }

    return res.status(403).json({
      success: false,
      message: 'Access denied. Insufficient permissions.'
    });
  };
};

// Middleware to check if user's email is verified
const requireEmailVerified = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  // Skip verification check for demo users
  if (req.user.isDemoUser) {
    return next();
  }

  if (!req.user.isEmailVerified) {
    return res.status(403).json({
      success: false,
      message: 'Email verification required',
      code: 'EMAIL_NOT_VERIFIED'
    });
  }

  next();
};

// Rate limiting per user (basic implementation)
const createUserRateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const userRequestCounts = new Map();

  return (req, res, next) => {
    if (!req.user) {
      return next();
    }

    const userId = req.user.userId.toString();
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old entries
    for (const [key, data] of userRequestCounts.entries()) {
      if (data.resetTime < now) {
        userRequestCounts.delete(key);
      }
    }

    // Check user's request count
    const userKey = `${userId}_${Math.floor(now / windowMs)}`;
    const userData = userRequestCounts.get(userKey) || { count: 0, resetTime: now + windowMs };

    if (userData.count >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil((userData.resetTime - now) / 1000)
      });
    }

    userData.count += 1;
    userRequestCounts.set(userKey, userData);
    next();
  };
};

// Audit log middleware (for sensitive operations)
const auditLog = (action) => {
  return (req, res, next) => {
    if (req.user) {
      console.log(`[AUDIT] ${new Date().toISOString()} - User ${req.user.userId} (${req.user.role}) performed action: ${action} - IP: ${req.ip} - User-Agent: ${req.get('User-Agent')}`);
    }
    next();
  };
};

module.exports = {
  auth,
  authorize,
  requirePatient,
  requireDoctor,
  requireStaff,
  requireLaboratory,
  requireAdmin,
  requireMedicalStaff,
  requireHealthcareProvider,
  optionalAuth,
  checkResourceOwnership,
  requireEmailVerified,
  createUserRateLimit,
  auditLog
};