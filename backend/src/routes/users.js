const express = require('express');
const { 
  auth, 
  authorize, 
  checkOwnership 
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

const router = express.Router();

/**
 * @route   GET /api/users/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile',
  auth,
  catchAsync(async (req, res) => {
    sendResponse(res, 200, req.user, 'Profile retrieved successfully');
  })
);

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile',
  auth,
  validate(userValidation.updateProfile),
  catchAsync(async (req, res) => {
    const allowedFields = ['firstName', 'lastName', 'phone', 'dateOfBirth', 'gender', 'address'];
    const updates = {};

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
 * @route   DELETE /api/users/account
 * @desc    Deactivate user account
 * @access  Private
 */
router.delete('/account',
  auth,
  catchAsync(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, { isActive: false });
    sendResponse(res, 200, null, 'Account deactivated successfully');
  })
);

module.exports = router;