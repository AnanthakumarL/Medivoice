const jwt = require('jsonwebtoken');
const Patient = require('../models/Patient-enhanced');

// Patient-specific authentication middleware
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
    
    // Get patient from database using userId from token
    console.log('Looking for patient with userId:', decoded.userId);
    const patient = await Patient.findOne({ userId: decoded.userId }).select('-password');
    
    if (!patient) {
      console.log('No patient found for userId:', decoded.userId);
      return res.status(401).json({
        success: false,
        message: 'Access denied. Patient profile not found.'
      });
    }

    console.log('Found patient:', patient._id);

    // Check if patient account is active (only if status field exists)
    if (patient.status && patient.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Account is not active.'
      });
    }

    // Add patient info to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      patientId: patient.patientId || patient._id,
      patient: patient
    };

    next();
  } catch (error) {
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

    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.'
    });
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Not authenticated.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}`
      });
    }

    next();
  };
};

module.exports = { auth, authorize };
