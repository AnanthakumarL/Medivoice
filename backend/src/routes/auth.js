const express = require('express');
const { 
  auth, 
  authRateLimit, 
  generateToken 
} = require('../middleware/auth');
const { 
  validate, 
  userValidation 
} = require('../middleware/validation');
const { 
  catchAsync, 
  sendResponse, 
  AppError 
} = require('../middleware/errorHandler');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const crypto = require('crypto');

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', 
  authRateLimit(3, 15 * 60 * 1000), // 3 attempts per 15 minutes
  validate(userValidation.register),
  catchAsync(async (req, res) => {
    const { firstName, lastName, email, password, role, phone, dateOfBirth, gender } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('User with this email already exists', 400);
    }

    // Create user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      role,
      phone,
      dateOfBirth,
      gender
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    user.password = undefined;

    sendResponse(res, 201, {
      user,
      token
    }, 'User registered successfully');
  })
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login',
  authRateLimit(5, 15 * 60 * 1000), // 5 attempts per 15 minutes
  validate(userValidation.login),
  catchAsync(async (req, res) => {
    const { email, password, rememberMe } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const lockTimeRemaining = Math.ceil((user.lockUntil - Date.now()) / 60000);
      throw new AppError(`Account locked. Try again in ${lockTimeRemaining} minutes`, 423);
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      // Increment login attempts
      await user.incLoginAttempts();
      throw new AppError('Invalid email or password', 401);
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0) {
      await user.resetLoginAttempts();
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token with extended expiry if rememberMe is true
    const tokenExpiry = rememberMe ? '30d' : '7d';
    const token = generateToken(user._id);

    // Set HTTP-only cookie
    const cookieOptions = {
      expires: new Date(Date.now() + (rememberMe ? 30 : 7) * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    };
    res.cookie('jwt', token, cookieOptions);

    // Remove password from response
    user.password = undefined;

    sendResponse(res, 200, {
      user,
      token
    }, 'Login successful');
  })
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', 
  auth,
  catchAsync(async (req, res) => {
    // Clear cookie
    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });

    sendResponse(res, 200, null, 'Logged out successfully');
  })
);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send password reset email
 * @access  Public
 */
router.post('/forgot-password',
  authRateLimit(3, 60 * 60 * 1000), // 3 attempts per hour
  validate(userValidation.forgotPassword),
  catchAsync(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists or not
      sendResponse(res, 200, null, 'If email exists, password reset instructions have been sent');
      return;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // TODO: Send email with reset token
    // For now, we'll return the token in development mode
    const responseData = process.env.NODE_ENV === 'development' ? { resetToken } : null;

    sendResponse(res, 200, responseData, 'Password reset instructions sent to email');
  })
);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post('/reset-password',
  validate(userValidation.resetPassword),
  catchAsync(async (req, res) => {
    const { token, password } = req.body;

    // Hash token and find user
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      throw new AppError('Token is invalid or has expired', 400);
    }

    // Update password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.passwordChangedAt = new Date();

    await user.save();

    // Generate new token
    const jwtToken = generateToken(user._id);

    sendResponse(res, 200, { token: jwtToken }, 'Password reset successful');
  })
);

/**
 * @route   POST /api/auth/change-password
 * @desc    Change password for authenticated user
 * @access  Private
 */
router.post('/change-password',
  auth,
  validate(userValidation.changePassword),
  catchAsync(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user._id).select('+password');

    // Check current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      throw new AppError('Current password is incorrect', 400);
    }

    // Update password
    user.password = newPassword;
    user.passwordChangedAt = new Date();
    await user.save();

    sendResponse(res, 200, null, 'Password changed successfully');
  })
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me',
  auth,
  catchAsync(async (req, res) => {
    let userData = req.user.toObject();

    // Get role-specific profile data
    if (req.user.role === 'doctor') {
      const doctorProfile = await Doctor.findOne({ user: req.user._id })
        .populate('user', 'firstName lastName email phone');
      if (doctorProfile) {
        userData.doctorProfile = doctorProfile;
      }
    } else if (req.user.role === 'patient') {
      const patientProfile = await Patient.findOne({ user: req.user._id })
        .populate('user', 'firstName lastName email phone')
        .populate('primaryDoctor', 'specialization user');
      if (patientProfile) {
        userData.patientProfile = patientProfile;
      }
    }

    sendResponse(res, 200, userData, 'Profile retrieved successfully');
  })
);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile',
  auth,
  validate(userValidation.updateProfile),
  catchAsync(async (req, res) => {
    const allowedFields = ['firstName', 'lastName', 'phone', 'dateOfBirth', 'gender', 'address'];
    const updates = {};

    // Filter allowed fields
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    );

    sendResponse(res, 200, user, 'Profile updated successfully');
  })
);

/**
 * @route   POST /api/auth/verify-email
 * @desc    Send email verification
 * @access  Private
 */
router.post('/verify-email',
  auth,
  catchAsync(async (req, res) => {
    if (req.user.emailVerified) {
      throw new AppError('Email is already verified', 400);
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    req.user.emailVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
    req.user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    await req.user.save();

    // TODO: Send verification email
    // For now, return token in development mode
    const responseData = process.env.NODE_ENV === 'development' ? { verificationToken } : null;

    sendResponse(res, 200, responseData, 'Verification email sent');
  })
);

/**
 * @route   GET /api/auth/verify-email/:token
 * @desc    Verify email with token
 * @access  Public
 */
router.get('/verify-email/:token',
  catchAsync(async (req, res) => {
    const { token } = req.params;

    // Hash token and find user
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      throw new AppError('Token is invalid or has expired', 400);
    }

    // Verify email
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    await user.save();

    sendResponse(res, 200, null, 'Email verified successfully');
  })
);

/**
 * @route   GET /api/auth/check-token
 * @desc    Check if token is valid
 * @access  Private
 */
router.get('/check-token',
  auth,
  catchAsync(async (req, res) => {
    sendResponse(res, 200, {
      user: req.user,
      isValid: true
    }, 'Token is valid');
  })
);

module.exports = router;