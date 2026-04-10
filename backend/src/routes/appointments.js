const express = require('express');
const router = express.Router();

// Import models
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const User = require('../models/User');

// Import middleware
const { authenticate, authorize } = require('../middleware/auth');
const { validateInput } = require('../middleware/validation');
const logger = require('../config/logger');

/**
 * @route   POST /api/appointments
 * @desc    Book a new appointment
 * @access  Private (Patient)
 */
router.post('/', authenticate, authorize('patient'), async (req, res) => {
  try {
    const {
      doctorId,
      appointmentDate,
      appointmentTime,
      consultationType,
      reasonForVisit,
      symptoms,
      notes
    } = req.body;

    // Validate required fields
    if (!doctorId || !appointmentDate || !appointmentTime || !consultationType || !reasonForVisit) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided',
        error: 'MISSING_REQUIRED_FIELDS'
      });
    }

    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
        error: 'DOCTOR_NOT_FOUND'
      });
    }

    // Get patient profile
    const patient = await Patient.findOne({ userId: req.user.userId });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient profile not found',
        error: 'PATIENT_NOT_FOUND'
      });
    }

    // Create appointment date-time
    const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
    
    // Check if appointment time is in the future
    if (appointmentDateTime <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Appointment must be scheduled for a future date and time',
        error: 'INVALID_APPOINTMENT_TIME'
      });
    }

    // Check if doctor is available at the requested time
    const dayName = appointmentDateTime.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase().slice(0, 3);
    const daySchedule = doctor.availability.weeklySchedule.find(s => s.day === dayName);
    
    if (!daySchedule || !daySchedule.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Doctor is not available on the selected day',
        error: 'DOCTOR_NOT_AVAILABLE'
      });
    }

    // Check if time slot is available
    const existingAppointment = await Appointment.findOne({
      doctorId,
      appointmentDate: appointmentDateTime,
      status: { $in: ['scheduled', 'confirmed'] }
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked',
        error: 'TIME_SLOT_UNAVAILABLE'
      });
    }

    // Get consultation fee
    const consultationTypeData = doctor.consultationTypes.find(t => t.type === consultationType);
    const fee = consultationTypeData ? consultationTypeData.fee : 0;

    // Create appointment
    const appointment = new Appointment({
      doctorId,
      patientId: patient._id,
      appointmentDate: appointmentDateTime,
      consultationType,
      reasonForVisit,
      symptoms: symptoms || [],
      notes: notes || '',
      billing: {
        consultationFee: fee,
        totalAmount: fee,
        currency: 'USD'
      }
    });

    await appointment.save();

    // Populate doctor and patient info for response
    await appointment.populate([
      {
        path: 'doctorId',
        populate: {
          path: 'userId',
          select: 'firstName lastName'
        }
      },
      {
        path: 'patientId',
        populate: {
          path: 'userId',
          select: 'firstName lastName'
        }
      }
    ]);

    logger.info('Appointment booked successfully', {
      appointmentId: appointment._id,
      doctorId,
      patientId: patient._id,
      appointmentDate: appointmentDateTime
    });

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: { appointment }
    });

  } catch (error) {
    logger.error('Book appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to book appointment',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

/**
 * @route   GET /api/appointments
 * @desc    Get appointments (role-based access)
 * @access  Private
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      date,
      upcoming = 'true'
    } = req.query;

    let query = {};

    // Role-based filtering
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user.userId });
      if (!patient) {
        return res.status(404).json({
          success: false,
          message: 'Patient profile not found',
          error: 'PATIENT_NOT_FOUND'
        });
      }
      query.patientId = patient._id;
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user.userId });
      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: 'Doctor profile not found',
          error: 'DOCTOR_NOT_FOUND'
        });
      }
      query.doctorId = doctor._id;
    }
    // Admin and staff can see all appointments (no additional filter)

    // Apply other filters
    if (status) query.status = status;
    
    if (date) {
      const queryDate = new Date(date);
      const nextDay = new Date(queryDate);
      nextDay.setDate(queryDate.getDate() + 1);
      
      query.appointmentDate = {
        $gte: queryDate,
        $lt: nextDay
      };
    } else if (upcoming === 'true') {
      query.appointmentDate = { $gte: new Date() };
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { appointmentDate: upcoming === 'true' ? 1 : -1 },
      populate: [
        {
          path: 'doctorId',
          populate: {
            path: 'userId',
            select: 'firstName lastName'
          }
        },
        {
          path: 'patientId',
          populate: {
            path: 'userId',
            select: 'firstName lastName email phoneNumber'
          }
        }
      ]
    };

    const appointments = await Appointment.paginate(query, options);

    res.json({
      success: true,
      data: appointments
    });

  } catch (error) {
    logger.error('Get appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get appointments',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

/**
 * @route   GET /api/appointments/:id
 * @desc    Get appointment by ID
 * @access  Private
 */
router.get('/:id', authenticate, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate([
        {
          path: 'doctorId',
          populate: {
            path: 'userId',
            select: 'firstName lastName email phoneNumber'
          }
        },
        {
          path: 'patientId',
          populate: {
            path: 'userId',
            select: 'firstName lastName email phoneNumber dateOfBirth'
          }
        }
      ]);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
        error: 'APPOINTMENT_NOT_FOUND'
      });
    }

    // Check authorization
    const isPatient = req.user.role === 'patient' && 
                     appointment.patientId.userId._id.toString() === req.user.userId;
    const isDoctor = req.user.role === 'doctor' && 
                    appointment.doctorId.userId._id.toString() === req.user.userId;
    const isAuthorized = isPatient || isDoctor || ['admin', 'staff'].includes(req.user.role);

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this appointment',
        error: 'UNAUTHORIZED_ACCESS'
      });
    }

    res.json({
      success: true,
      data: { appointment }
    });

  } catch (error) {
    logger.error('Get appointment by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get appointment',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

/**
 * @route   PUT /api/appointments/:id
 * @desc    Update appointment
 * @access  Private
 */
router.put('/:id', authenticate, async (req, res) => {
  try {
    const updates = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
        error: 'APPOINTMENT_NOT_FOUND'
      });
    }

    // Check authorization and determine allowed updates
    let allowedUpdates = [];
    
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user.userId });
      if (appointment.patientId.toString() !== patient._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this appointment',
          error: 'UNAUTHORIZED_ACCESS'
        });
      }
      allowedUpdates = ['reasonForVisit', 'symptoms', 'notes'];
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user.userId });
      if (appointment.doctorId.toString() !== doctor._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this appointment',
          error: 'UNAUTHORIZED_ACCESS'
        });
      }
      allowedUpdates = ['status', 'notes', 'diagnosis', 'treatmentPlan', 'followUpRequired', 'followUpDate'];
    } else if (['admin', 'staff'].includes(req.user.role)) {
      allowedUpdates = Object.keys(updates);
    }

    // Filter updates
    const filteredUpdates = {};
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    // Special handling for status updates
    if (filteredUpdates.status) {
      const validTransitions = {
        'scheduled': ['confirmed', 'cancelled'],
        'confirmed': ['checked_in', 'cancelled', 'no_show'],
        'checked_in': ['in_progress'],
        'in_progress': ['completed'],
        'completed': [], // Cannot change from completed
        'cancelled': [], // Cannot change from cancelled
        'no_show': [] // Cannot change from no_show
      };

      if (!validTransitions[appointment.status].includes(filteredUpdates.status)) {
        return res.status(400).json({
          success: false,
          message: `Cannot change status from ${appointment.status} to ${filteredUpdates.status}`,
          error: 'INVALID_STATUS_TRANSITION'
        });
      }

      // Set timestamps for status changes
      if (filteredUpdates.status === 'checked_in') {
        filteredUpdates.checkInTime = new Date();
      } else if (filteredUpdates.status === 'completed') {
        filteredUpdates.endTime = new Date();
      }
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      filteredUpdates,
      { new: true, runValidators: true }
    ).populate([
      {
        path: 'doctorId',
        populate: {
          path: 'userId',
          select: 'firstName lastName'
        }
      },
      {
        path: 'patientId',
        populate: {
          path: 'userId',
          select: 'firstName lastName'
        }
      }
    ]);

    logger.info('Appointment updated', {
      appointmentId: req.params.id,
      updatedBy: req.user.userId,
      updates: Object.keys(filteredUpdates)
    });

    res.json({
      success: true,
      message: 'Appointment updated successfully',
      data: { appointment: updatedAppointment }
    });

  } catch (error) {
    logger.error('Update appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update appointment',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

/**
 * @route   POST /api/appointments/:id/check-in
 * @desc    Check in for appointment
 * @access  Private (Patient, Staff)
 */
router.post('/:id/check-in', authenticate, authorize('patient', 'staff'), async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
        error: 'APPOINTMENT_NOT_FOUND'
      });
    }

    // Verify authorization for patients
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user.userId });
      if (appointment.patientId.toString() !== patient._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to check in for this appointment',
          error: 'UNAUTHORIZED_ACCESS'
        });
      }
    }

    // Check if appointment can be checked in
    if (appointment.status !== 'confirmed') {
      return res.status(400).json({
        success: false,
        message: 'Only confirmed appointments can be checked in',
        error: 'INVALID_APPOINTMENT_STATUS'
      });
    }

    // Check if appointment is today
    const appointmentDate = new Date(appointment.appointmentDate);
    const today = new Date();
    const isToday = appointmentDate.toDateString() === today.toDateString();

    if (!isToday) {
      return res.status(400).json({
        success: false,
        message: 'Can only check in on the day of the appointment',
        error: 'INVALID_CHECK_IN_DATE'
      });
    }

    // Update appointment status
    appointment.status = 'checked_in';
    appointment.checkInTime = new Date();
    await appointment.save();

    logger.info('Patient checked in for appointment', {
      appointmentId: appointment._id,
      checkedInBy: req.user.userId
    });

    res.json({
      success: true,
      message: 'Checked in successfully',
      data: {
        appointmentId: appointment._id,
        checkInTime: appointment.checkInTime,
        status: appointment.status
      }
    });

  } catch (error) {
    logger.error('Check-in error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check in',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

/**
 * @route   POST /api/appointments/:id/cancel
 * @desc    Cancel appointment
 * @access  Private (Patient, Doctor, Staff, Admin)
 */
router.post('/:id/cancel', authenticate, async (req, res) => {
  try {
    const { reason } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
        error: 'APPOINTMENT_NOT_FOUND'
      });
    }

    // Check authorization
    let isAuthorized = false;
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user.userId });
      isAuthorized = appointment.patientId.toString() === patient._id.toString();
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user.userId });
      isAuthorized = appointment.doctorId.toString() === doctor._id.toString();
    } else if (['admin', 'staff'].includes(req.user.role)) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this appointment',
        error: 'UNAUTHORIZED_ACCESS'
      });
    }

    // Check if appointment can be cancelled
    if (!['scheduled', 'confirmed'].includes(appointment.status)) {
      return res.status(400).json({
        success: false,
        message: 'Only scheduled or confirmed appointments can be cancelled',
        error: 'INVALID_APPOINTMENT_STATUS'
      });
    }

    // Update appointment
    appointment.status = 'cancelled';
    appointment.cancellationReason = reason || 'No reason provided';
    appointment.cancelledBy = req.user.userId;
    appointment.cancelledAt = new Date();
    await appointment.save();

    logger.info('Appointment cancelled', {
      appointmentId: appointment._id,
      cancelledBy: req.user.userId,
      reason: appointment.cancellationReason
    });

    res.json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: {
        appointmentId: appointment._id,
        status: appointment.status,
        cancelledAt: appointment.cancelledAt
      }
    });

  } catch (error) {
    logger.error('Cancel appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel appointment',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

/**
 * @route   GET /api/appointments/stats/overview
 * @desc    Get appointment statistics
 * @access  Private (Admin, Staff)
 */
router.get('/stats/overview', authenticate, authorize('admin', 'staff'), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter.appointmentDate = {};
      if (startDate) dateFilter.appointmentDate.$gte = new Date(startDate);
      if (endDate) dateFilter.appointmentDate.$lte = new Date(endDate);
    }

    // Appointment statistics by status
    const statusStats = await Appointment.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Daily appointment counts (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const dailyStats = await Appointment.aggregate([
      {
        $match: {
          appointmentDate: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$appointmentDate" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Revenue statistics
    const revenueStats = await Appointment.aggregate([
      {
        $match: {
          status: 'completed',
          ...dateFilter
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$billing.totalAmount' },
          averageRevenue: { $avg: '$billing.totalAmount' },
          appointmentCount: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        statusStats,
        dailyStats,
        revenue: revenueStats[0] || { totalRevenue: 0, averageRevenue: 0, appointmentCount: 0 }
      }
    });

  } catch (error) {
    logger.error('Get appointment stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get appointment statistics',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

module.exports = router;
