const express = require('express');
const { 
  auth, 
  authorize 
} = require('../middleware/auth');
const { 
  validate, 
  appointmentValidation 
} = require('../middleware/validation');
const { 
  catchAsync, 
  sendResponse, 
  AppError 
} = require('../middleware/errorHandler');
const Appointment = require('../models/Appointment');

const router = express.Router();

/**
 * @route   POST /api/appointments
 * @desc    Create new appointment
 * @access  Private (Patient)
 */
router.post('/',
  auth,
  authorize('patient'),
  validate(appointmentValidation.create),
  catchAsync(async (req, res) => {
    const appointmentData = {
      ...req.body,
      patient: req.body.patient || req.user.patientProfile?._id
    };

    // Check for conflicts
    const hasConflict = await Appointment.checkConflict(
      appointmentData.doctor,
      appointmentData.scheduledTime,
      appointmentData.duration
    );

    if (hasConflict) {
      throw new AppError('Time slot is not available', 409);
    }

    const appointment = new Appointment(appointmentData);
    await appointment.save();

    await appointment.populate([
      { path: 'doctor', populate: { path: 'user', select: 'firstName lastName' } },
      { path: 'patient', populate: { path: 'user', select: 'firstName lastName' } }
    ]);

    sendResponse(res, 201, appointment, 'Appointment created successfully');
  })
);

/**
 * @route   GET /api/appointments
 * @desc    Get appointments (filtered by user role)
 * @access  Private
 */
router.get('/',
  auth,
  catchAsync(async (req, res) => {
    let query = {};

    // Filter based on user role
    if (req.user.role === 'patient') {
      const Patient = require('../models/Patient');
      const patient = await Patient.findOne({ user: req.user._id });
      if (!patient) {
        throw new AppError('Patient profile not found', 404);
      }
      query.patient = patient._id;
    } else if (req.user.role === 'doctor') {
      const Doctor = require('../models/Doctor');
      const doctor = await Doctor.findOne({ user: req.user._id });
      if (!doctor) {
        throw new AppError('Doctor profile not found', 404);
      }
      query.doctor = doctor._id;
    }

    const appointments = await Appointment.find(query)
      .populate('doctor', 'specialization user')
      .populate('patient', 'patientId user')
      .sort({ scheduledTime: 1 });

    sendResponse(res, 200, appointments, 'Appointments retrieved successfully');
  })
);

/**
 * @route   PUT /api/appointments/:id
 * @desc    Update appointment
 * @access  Private
 */
router.put('/:id',
  auth,
  validate(appointmentValidation.update),
  catchAsync(async (req, res) => {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      throw new AppError('Appointment not found', 404);
    }

    // Authorization check
    // Implementation depends on business logic

    Object.assign(appointment, req.body);
    await appointment.save();

    sendResponse(res, 200, appointment, 'Appointment updated successfully');
  })
);

module.exports = router;