const express = require('express');
const router = express.Router();

// Import models
const Patient = require('../models/Patient');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const MedicalRecord = require('../models/MedicalRecord');
const Prescription = require('../models/Prescription');

// Import middleware
const { authenticate, authorize } = require('../middleware/auth');
const { validateInput } = require('../middleware/validation');
const logger = require('../config/logger');

/**
 * @route   GET /api/patients/profile
 * @desc    Get patient profile
 * @access  Private (Patient)
 */
router.get('/profile', authenticate, authorize('patient'), async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user.userId })
      .populate('userId', 'firstName lastName email phoneNumber dateOfBirth');

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient profile not found',
        error: 'PATIENT_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      data: { patient }
    });

  } catch (error) {
    logger.error('Get patient profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

/**
 * @route   PUT /api/patients/profile
 * @desc    Update patient profile
 * @access  Private (Patient)
 */
router.put('/profile', authenticate, authorize('patient'), async (req, res) => {
  try {
    const updates = req.body;
    const allowedUpdates = [
      'emergencyContact',
      'medicalInfo',
      'insuranceInfo',
      'preferences',
      'careTeam'
    ];

    const filteredUpdates = {};
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    const patient = await Patient.findOneAndUpdate(
      { userId: req.user.userId },
      filteredUpdates,
      { new: true, runValidators: true }
    ).populate('userId', 'firstName lastName email phoneNumber dateOfBirth');

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient profile not found',
        error: 'PATIENT_NOT_FOUND'
      });
    }

    logger.info('Patient profile updated', {
      patientId: patient._id,
      userId: req.user.userId,
      updates: Object.keys(filteredUpdates)
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { patient }
    });

  } catch (error) {
    logger.error('Update patient profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

/**
 * @route   GET /api/patients/my/appointments
 * @desc    Get patient's appointments
 * @access  Private (Patient)
 */
router.get('/my/appointments', authenticate, authorize('patient'), async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      upcoming = 'true'
    } = req.query;

    const patient = await Patient.findOne({ userId: req.user.userId });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient profile not found',
        error: 'PATIENT_NOT_FOUND'
      });
    }

    const query = { patientId: patient._id };

    // Apply filters
    if (status) query.status = status;
    if (upcoming === 'true') {
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
        }
      ]
    };

    const appointments = await Appointment.paginate(query, options);

    res.json({
      success: true,
      data: appointments
    });

  } catch (error) {
    logger.error('Get patient appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get appointments',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

/**
 * @route   GET /api/patients/my/medical-records
 * @desc    Get patient's medical records
 * @access  Private (Patient)
 */
router.get('/my/medical-records', authenticate, authorize('patient'), async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      startDate,
      endDate
    } = req.query;

    const patient = await Patient.findOne({ userId: req.user.userId });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient profile not found',
        error: 'PATIENT_NOT_FOUND'
      });
    }

    const query = { patientId: patient._id };

    // Apply filters
    if (type) query.recordType = type;
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: [
        {
          path: 'doctorId',
          populate: {
            path: 'userId',
            select: 'firstName lastName'
          }
        },
        {
          path: 'appointmentId'
        }
      ]
    };

    const records = await MedicalRecord.paginate(query, options);

    res.json({
      success: true,
      data: records
    });

  } catch (error) {
    logger.error('Get patient medical records error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get medical records',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

/**
 * @route   GET /api/patients/my/prescriptions
 * @desc    Get patient's prescriptions
 * @access  Private (Patient)
 */
router.get('/my/prescriptions', authenticate, authorize('patient'), async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      active = 'true'
    } = req.query;

    const patient = await Patient.findOne({ userId: req.user.userId });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient profile not found',
        error: 'PATIENT_NOT_FOUND'
      });
    }

    const query = { patientId: patient._id };

    // Apply filters
    if (status) query.status = status;
    if (active === 'true') {
      query.status = { $in: ['active', 'partially_filled'] };
      query.endDate = { $gte: new Date() };
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: [
        {
          path: 'doctorId',
          populate: {
            path: 'userId',
            select: 'firstName lastName'
          }
        },
        {
          path: 'appointmentId'
        }
      ]
    };

    const prescriptions = await Prescription.paginate(query, options);

    res.json({
      success: true,
      data: prescriptions
    });

  } catch (error) {
    logger.error('Get patient prescriptions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get prescriptions',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

/**
 * @route   GET /api/patients/my/health-summary
 * @desc    Get patient's health summary
 * @access  Private (Patient)
 */
router.get('/my/health-summary', authenticate, authorize('patient'), async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user.userId })
      .populate('userId', 'firstName lastName dateOfBirth');

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient profile not found',
        error: 'PATIENT_NOT_FOUND'
      });
    }

    // Get appointment statistics
    const appointmentStats = await Appointment.aggregate([
      { $match: { patientId: patient._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get recent medical records (last 5)
    const recentRecords = await MedicalRecord.find({ patientId: patient._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('doctorId', 'userId')
      .populate('doctorId.userId', 'firstName lastName');

    // Get active prescriptions
    const activePrescriptions = await Prescription.find({
      patientId: patient._id,
      status: { $in: ['active', 'partially_filled'] },
      endDate: { $gte: new Date() }
    }).countDocuments();

    // Get upcoming appointments
    const upcomingAppointments = await Appointment.find({
      patientId: patient._id,
      appointmentDate: { $gte: new Date() },
      status: { $in: ['scheduled', 'confirmed'] }
    })
    .sort({ appointmentDate: 1 })
    .limit(3)
    .populate('doctorId', 'userId')
    .populate('doctorId.userId', 'firstName lastName');

    // Calculate age
    const age = patient.userId.dateOfBirth ? 
      Math.floor((new Date() - new Date(patient.userId.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000)) : null;

    const summary = {
      patient: {
        id: patient._id,
        name: `${patient.userId.firstName} ${patient.userId.lastName}`,
        age,
        bloodType: patient.medicalInfo.bloodType,
        allergies: patient.medicalInfo.allergies || [],
        chronicConditions: patient.medicalInfo.chronicConditions || []
      },
      statistics: {
        appointments: appointmentStats,
        activePrescriptions,
        totalMedicalRecords: await MedicalRecord.countDocuments({ patientId: patient._id })
      },
      upcomingAppointments,
      recentRecords: recentRecords.slice(0, 3),
      vitalSigns: patient.medicalInfo.vitalSigns || {},
      lastUpdated: patient.updatedAt
    };

    res.json({
      success: true,
      data: summary
    });

  } catch (error) {
    logger.error('Get patient health summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get health summary',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

/**
 * @route   PUT /api/patients/my/vital-signs
 * @desc    Update patient's vital signs
 * @access  Private (Patient)
 */
router.put('/my/vital-signs', authenticate, authorize('patient'), async (req, res) => {
  try {
    const { vitalSigns } = req.body;

    if (!vitalSigns) {
      return res.status(400).json({
        success: false,
        message: 'Vital signs data is required',
        error: 'VITAL_SIGNS_REQUIRED'
      });
    }

    const patient = await Patient.findOneAndUpdate(
      { userId: req.user.userId },
      {
        'medicalInfo.vitalSigns': {
          ...vitalSigns,
          lastUpdated: new Date()
        }
      },
      { new: true, runValidators: true }
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient profile not found',
        error: 'PATIENT_NOT_FOUND'
      });
    }

    logger.info('Patient vital signs updated', {
      patientId: patient._id,
      userId: req.user.userId
    });

    res.json({
      success: true,
      message: 'Vital signs updated successfully',
      data: {
        vitalSigns: patient.medicalInfo.vitalSigns
      }
    });

  } catch (error) {
    logger.error('Update vital signs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update vital signs',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

/**
 * @route   GET /api/patients
 * @desc    Get all patients (doctors/staff only)
 * @access  Private (Doctor, Staff, Admin)
 */
router.get('/', authenticate, authorize('doctor', 'staff', 'admin'), async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      bloodType,
      condition
    } = req.query;

    let query = {};

    // Search functionality
    if (search) {
      const userIds = await User.find({
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ],
        role: 'patient'
      }).distinct('_id');

      query.userId = { $in: userIds };
    }

    // Medical filters
    if (bloodType) {
      query['medicalInfo.bloodType'] = bloodType;
    }

    if (condition) {
      query['medicalInfo.chronicConditions'] = { $regex: condition, $options: 'i' };
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: {
        path: 'userId',
        select: 'firstName lastName email phoneNumber dateOfBirth'
      }
    };

    const patients = await Patient.paginate(query, options);

    res.json({
      success: true,
      data: patients
    });

  } catch (error) {
    logger.error('Get patients error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get patients',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

/**
 * @route   GET /api/patients/:id
 * @desc    Get patient by ID (healthcare providers only)
 * @access  Private (Doctor, Staff, Admin)
 */
router.get('/:id', authenticate, authorize('doctor', 'staff', 'admin'), async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate('userId', 'firstName lastName email phoneNumber dateOfBirth');

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
        error: 'PATIENT_NOT_FOUND'
      });
    }

    // Get recent medical activity
    const recentAppointments = await Appointment.find({ patientId: patient._id })
      .sort({ appointmentDate: -1 })
      .limit(5)
      .populate('doctorId', 'userId')
      .populate('doctorId.userId', 'firstName lastName');

    const activePrescriptions = await Prescription.find({
      patientId: patient._id,
      status: { $in: ['active', 'partially_filled'] },
      endDate: { $gte: new Date() }
    }).populate('doctorId', 'userId')
      .populate('doctorId.userId', 'firstName lastName');

    res.json({
      success: true,
      data: {
        patient,
        recentAppointments,
        activePrescriptions
      }
    });

  } catch (error) {
    logger.error('Get patient by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get patient',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

module.exports = router;
