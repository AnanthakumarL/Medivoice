const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { promisify } = require('util');

// Environment variables validation
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is required in environment variables');
}

/**
 * Generate JWT token for user
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
};

/**
 * Verify JWT token
 */
const verifyToken = async (token) => {
  try {
    const decoded = await promisify(jwt.verify)(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    }
    throw new Error('Token verification failed');
  }
};

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
const auth = async (req, res, next) => {
  try {
    // Get token from header
    let token;
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Verify token
    const decoded = await verifyToken(token);
    
    // Get user from database
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account has been deactivated.'
      });
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked. Please try again later.'
      });
    }

    // Attach user to request
    req.user = user;
    next();

  } catch (error) {
    console.error('Authentication error:', error);
    
    if (error.message.includes('expired')) {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please login again.'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid token. Authentication failed.'
    });
  }
};

// Legacy support - alias for auth
const authenticate = auth;

/**
 * Authorization middleware - check user roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.user.role}`
      });
    }

    next();
  };
};

/**
 * Doctor-specific authorization
 */
const authorizeDoctor = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'doctor') {
      return res.status(403).json({
        success: false,
        message: 'Doctor access required'
      });
    }

    // Get doctor record
    const Doctor = require('../models/Doctor');
    const doctor = await Doctor.findOne({ user: req.user._id });
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found'
      });
    }

    if (!doctor.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Doctor profile not verified'
      });
    }

    req.doctor = doctor;
    next();
  } catch (error) {
    console.error('Doctor authorization error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error verifying doctor authorization'
    });
  }
};

/**
 * Patient access authorization (for patient or their doctor)
 */
const authorizePatientAccess = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    
    if (req.user.role === 'patient') {
      // Patient can only access their own data
      const Patient = require('../models/Patient');
      const patient = await Patient.findOne({ user: req.user._id });
      
      if (!patient || patient._id.toString() !== patientId) {
        return res.status(403).json({
          success: false,
          message: 'Cannot access other patient data'
        });
      }
      
      req.patient = patient;
    } else if (req.user.role === 'doctor') {
      // Doctor can access their patients' data
      const Patient = require('../models/Patient');
      const patient = await Patient.findById(patientId);
      
      if (!patient) {
        return res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      }

      const Doctor = require('../models/Doctor');
      const doctor = await Doctor.findOne({ user: req.user._id });
      
      // Check if doctor has access to this patient
      if (!patient.primaryDoctor || patient.primaryDoctor.toString() !== doctor._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Cannot access patient data - not your patient'
        });
      }
      
      req.patient = patient;
      req.doctor = doctor;
    } else if (req.user.role === 'admin') {
      // Admin can access any patient data
      const Patient = require('../models/Patient');
      const patient = await Patient.findById(patientId);
      
      if (!patient) {
        return res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      }
      
      req.patient = patient;
    } else {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  } catch (error) {
    console.error('Patient access authorization error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error verifying patient access'
    });
  }
};

/**
 * Check if user owns resource or has admin privileges
 */
const checkOwnership = (resourceUserField = 'user') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    // Admin can access any resource
    if (req.user.role === 'admin') {
      return next();
    }

    // For other roles, check ownership based on the resource
    const resourceUserId = req.params.userId || req.params.id;
    
    if (resourceUserId && resourceUserId !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your own resources.'
      });
    }

    next();
  };
};

/**
 * Rate limiting for authentication endpoints
 */
const authRateLimit = (maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
  const attempts = new Map();

  return (req, res, next) => {
    const key = req.ip + req.body.email;
    const now = Date.now();
    
    if (!attempts.has(key)) {
      attempts.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    const attempt = attempts.get(key);
    
    if (now > attempt.resetTime) {
      attempt.count = 1;
      attempt.resetTime = now + windowMs;
      return next();
    }

    if (attempt.count >= maxAttempts) {
      return res.status(429).json({
        success: false,
        message: `Too many login attempts. Please try again in ${Math.ceil((attempt.resetTime - now) / 60000)} minutes.`
      });
    }

    attempt.count++;
    next();
  };
};

module.exports = {
  generateToken,
  verifyToken,
  auth,
  authenticate,
  authorize,
  authorizeDoctor,
  authorizePatientAccess,
  checkOwnership,
  authRateLimit
};