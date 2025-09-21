const express = require('express');
const { 
  auth, 
  authorize 
} = require('../middleware/auth');
const { 
  catchAsync, 
  sendResponse 
} = require('../middleware/errorHandler');

const router = express.Router();

/**
 * @route   GET /api/prescriptions
 * @desc    Get prescriptions
 * @access  Private
 */
router.get('/',
  auth,
  catchAsync(async (req, res) => {
    // Placeholder implementation
    sendResponse(res, 200, [], 'Prescriptions retrieved successfully');
  })
);

/**
 * @route   POST /api/prescriptions
 * @desc    Create prescription
 * @access  Private (Doctor)
 */
router.post('/',
  auth,
  authorize('doctor'),
  catchAsync(async (req, res) => {
    // Placeholder implementation
    sendResponse(res, 201, {}, 'Prescription created successfully');
  })
);

module.exports = router;