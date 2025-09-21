const express = require('express');
const { 
  auth, 
  authorize, 
  authorizePatientAccess 
} = require('../middleware/auth');
const { 
  validate, 
  patientValidation 
} = require('../middleware/validation');
const { 
  catchAsync, 
  sendResponse, 
  AppError 
} = require('../middleware/errorHandler');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

const router = express.Router();

/**
 * @route   POST /api/patients/profile
 * @desc    Create or update patient profile
 * @access  Private (Patient only)
 */
router.post('/profile',
  auth,
  authorize('patient'),
  validate(patientValidation.profile),
  catchAsync(async (req, res) => {
    const patientData = {
      user: req.user._id,
      ...req.body
    };

    let patient = await Patient.findOne({ user: req.user._id });

    if (patient) {
      Object.assign(patient, req.body);
      patient = await patient.save();
    } else {
      patient = new Patient(patientData);
      await patient.save();
    }

    await patient.populate('user', 'firstName lastName email phone');

    sendResponse(res, patient.isNew ? 201 : 200, patient, 
      patient.isNew ? 'Patient profile created successfully' : 'Patient profile updated successfully'
    );
  })
);

/**
 * @route   GET /api/patients/me/profile
 * @desc    Get current patient's profile
 * @access  Private (Patient only)
 */
router.get('/me/profile',
  auth,
  authorize('patient'),
  catchAsync(async (req, res) => {
    const patient = await Patient.findOne({ user: req.user._id })
      .populate('user', 'firstName lastName email phone')
      .populate('primaryDoctor', 'specialization user');

    if (!patient) {
      throw new AppError('Patient profile not found', 404);
    }

    sendResponse(res, 200, patient, 'Patient profile retrieved successfully');
  })
);

/**
 * @route   PUT /api/patients/me/vitals
 * @desc    Update patient vitals
 * @access  Private (Patient only)
 */
router.put('/me/vitals',
  auth,
  authorize('patient'),
  validate(patientValidation.updateVitals),
  catchAsync(async (req, res) => {
    const patient = await Patient.findOne({ user: req.user._id });
    
    if (!patient) {
      throw new AppError('Patient profile not found', 404);
    }

    await patient.updateVitals(req.body);
    
    sendResponse(res, 200, patient, 'Vitals updated successfully');
  })
);

/**
 * @route   GET /api/patients/:id
 * @desc    Get patient details (doctor access)
 * @access  Private (Doctor/Admin)
 */
router.get('/:id',
  auth,
  authorize('doctor', 'admin'),
  authorizePatientAccess,
  catchAsync(async (req, res) => {
    sendResponse(res, 200, req.patient, 'Patient details retrieved successfully');
  })
);

module.exports = router;