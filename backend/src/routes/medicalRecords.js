const express = require('express');
const router = express.Router();

// Import models
const MedicalRecord = require('../models/MedicalRecord');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// Import middleware
const { authenticate, authorize } = require('../middleware/auth');
const { validateInput } = require('../middleware/validation');
const logger = require('../config/logger');

/**
 * @route   POST /api/medical-records
 * @desc    Create a new medical record
 * @access  Private (Doctor, Staff)
 */
router.post('/', authenticate, authorize('doctor', 'staff'), async (req, res) => {
  try {
    const {
      patientId,
      appointmentId,
      recordType,
      chiefComplaint,
      presentIllness,
      medicalHistory,
      physicalExamination,
      vitalSigns,
      diagnosis,
      treatmentPlan,
      medications,
      labResults,
      imagingStudies,
      procedures,
      followUpInstructions,
      notes
    } = req.body;

    // Validate required fields
    if (!patientId || !recordType) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID and record type are required',
        error: 'MISSING_REQUIRED_FIELDS'
      });
    }

    // Verify patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
        error: 'PATIENT_NOT_FOUND'
      });
    }

    // Get doctor profile for the current user
    let doctorId = null;
    if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user.userId });
      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: 'Doctor profile not found',
          error: 'DOCTOR_NOT_FOUND'
        });
      }
      doctorId = doctor._id;
    }

    // Verify appointment exists if provided
    if (appointmentId) {
      const appointment = await Appointment.findById(appointmentId);
      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found',
          error: 'APPOINTMENT_NOT_FOUND'
        });
      }

      // Verify appointment belongs to the patient
      if (appointment.patientId.toString() !== patientId) {
        return res.status(400).json({
          success: false,
          message: 'Appointment does not belong to the specified patient',
          error: 'APPOINTMENT_PATIENT_MISMATCH'
        });
      }
    }

    // Create medical record
    const medicalRecord = new MedicalRecord({
      patientId,
      doctorId,
      appointmentId,
      recordType,
      chiefComplaint,
      presentIllness,
      medicalHistory: medicalHistory || {},
      physicalExamination: physicalExamination || {},
      vitalSigns: vitalSigns || {},
      diagnosis: diagnosis || {},
      treatmentPlan: treatmentPlan || {},
      medications: medications || [],
      labResults: labResults || [],
      imagingStudies: imagingStudies || [],
      procedures: procedures || [],
      followUpInstructions: followUpInstructions || {},
      notes,
      createdBy: req.user.userId
    });

    await medicalRecord.save();

    // Populate the response
    await medicalRecord.populate([
      {
        path: 'patientId',
        populate: {
          path: 'userId',
          select: 'firstName lastName'
        }
      },
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
    ]);

    logger.info('Medical record created', {
      recordId: medicalRecord._id,
      patientId,
      doctorId,
      recordType,
      createdBy: req.user.userId
    });

    res.status(201).json({
      success: true,
      message: 'Medical record created successfully',
      data: { medicalRecord }
    });

  } catch (error) {
    logger.error('Create medical record error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create medical record',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

/**
 * @route   GET /api/medical-records
 * @desc    Get medical records (role-based access)
 * @access  Private
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      patientId,
      recordType,
      startDate,
      endDate,
      search
    } = req.query;

    let query = {};

    // Role-based access control
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
    // Admin and staff can access all records

    // Apply additional filters
    if (patientId && ['admin', 'staff', 'doctor'].includes(req.user.role)) {
      query.patientId = patientId;
    }

    if (recordType) query.recordType = recordType;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Search functionality
    if (search) {
      query.$or = [
        { chiefComplaint: { $regex: search, $options: 'i' } },
        { 'diagnosis.primaryDiagnosis': { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } }
      ];
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: [
        {
          path: 'patientId',
          populate: {
            path: 'userId',
            select: 'firstName lastName'
          }
        },
        {
          path: 'doctorId',
          populate: {
            path: 'userId',
            select: 'firstName lastName'
          }
        },
        {
          path: 'appointmentId',
          select: 'appointmentDate consultationType'
        }
      ]
    };

    const records = await MedicalRecord.paginate(query, options);

    res.json({
      success: true,
      data: records
    });

  } catch (error) {
    logger.error('Get medical records error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get medical records',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

/**
 * @route   GET /api/medical-records/:id
 * @desc    Get medical record by ID
 * @access  Private
 */
router.get('/:id', authenticate, async (req, res) => {
  try {
    const medicalRecord = await MedicalRecord.findById(req.params.id)
      .populate([
        {
          path: 'patientId',
          populate: {
            path: 'userId',
            select: 'firstName lastName email phoneNumber dateOfBirth'
          }
        },
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
      ]);

    if (!medicalRecord) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found',
        error: 'MEDICAL_RECORD_NOT_FOUND'
      });
    }

    // Check authorization
    let isAuthorized = false;
    
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user.userId });
      isAuthorized = medicalRecord.patientId._id.toString() === patient._id.toString();
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user.userId });
      isAuthorized = medicalRecord.doctorId && 
                    medicalRecord.doctorId._id.toString() === doctor._id.toString();
    } else if (['admin', 'staff'].includes(req.user.role)) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this medical record',
        error: 'UNAUTHORIZED_ACCESS'
      });
    }

    res.json({
      success: true,
      data: { medicalRecord }
    });

  } catch (error) {
    logger.error('Get medical record by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get medical record',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

/**
 * @route   PUT /api/medical-records/:id
 * @desc    Update medical record
 * @access  Private (Doctor who created it, Staff, Admin)
 */
router.put('/:id', authenticate, authorize('doctor', 'staff', 'admin'), async (req, res) => {
  try {
    const updates = req.body;
    const medicalRecord = await MedicalRecord.findById(req.params.id);

    if (!medicalRecord) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found',
        error: 'MEDICAL_RECORD_NOT_FOUND'
      });
    }

    // Check authorization (doctor can only update their own records)
    if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user.userId });
      if (!medicalRecord.doctorId || medicalRecord.doctorId.toString() !== doctor._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this medical record',
          error: 'UNAUTHORIZED_ACCESS'
        });
      }
    }

    // Define allowed update fields
    const allowedUpdates = [
      'chiefComplaint', 'presentIllness', 'medicalHistory', 'physicalExamination',
      'vitalSigns', 'diagnosis', 'treatmentPlan', 'medications', 'labResults',
      'imagingStudies', 'procedures', 'followUpInstructions', 'notes'
    ];

    // Filter updates
    const filteredUpdates = {};
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    // Add update metadata
    filteredUpdates.lastModifiedBy = req.user.userId;
    filteredUpdates.lastModifiedAt = new Date();

    const updatedRecord = await MedicalRecord.findByIdAndUpdate(
      req.params.id,
      filteredUpdates,
      { new: true, runValidators: true }
    ).populate([
      {
        path: 'patientId',
        populate: {
          path: 'userId',
          select: 'firstName lastName'
        }
      },
      {
        path: 'doctorId',
        populate: {
          path: 'userId',
          select: 'firstName lastName'
        }
      }
    ]);

    logger.info('Medical record updated', {
      recordId: req.params.id,
      updatedBy: req.user.userId,
      updates: Object.keys(filteredUpdates)
    });

    res.json({
      success: true,
      message: 'Medical record updated successfully',
      data: { medicalRecord: updatedRecord }
    });

  } catch (error) {
    logger.error('Update medical record error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update medical record',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

/**
 * @route   DELETE /api/medical-records/:id
 * @desc    Delete medical record
 * @access  Private (Admin only)
 */
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const medicalRecord = await MedicalRecord.findById(req.params.id);

    if (!medicalRecord) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found',
        error: 'MEDICAL_RECORD_NOT_FOUND'
      });
    }

    await MedicalRecord.findByIdAndDelete(req.params.id);

    logger.info('Medical record deleted', {
      recordId: req.params.id,
      deletedBy: req.user.userId
    });

    res.json({
      success: true,
      message: 'Medical record deleted successfully'
    });

  } catch (error) {
    logger.error('Delete medical record error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete medical record',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

/**
 * @route   GET /api/medical-records/patient/:patientId/summary
 * @desc    Get patient's medical record summary
 * @access  Private (Healthcare providers only)
 */
router.get('/patient/:patientId/summary', authenticate, authorize('doctor', 'staff', 'admin'), async (req, res) => {
  try {
    const { patientId } = req.params;

    // Verify patient exists
    const patient = await Patient.findById(patientId)
      .populate('userId', 'firstName lastName dateOfBirth');

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
        error: 'PATIENT_NOT_FOUND'
      });
    }

    // Get recent records
    const recentRecords = await MedicalRecord.find({ patientId })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('doctorId', 'userId')
      .populate('doctorId.userId', 'firstName lastName');

    // Get chronic conditions from records
    const chronicConditions = await MedicalRecord.aggregate([
      { $match: { patientId: require('mongoose').Types.ObjectId(patientId) } },
      { $unwind: '$diagnosis.secondaryDiagnoses' },
      {
        $group: {
          _id: '$diagnosis.secondaryDiagnoses',
          count: { $sum: 1 },
          lastSeen: { $max: '$createdAt' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get allergies from patient profile and records
    const allergies = [...(patient.medicalInfo.allergies || [])];
    
    // Get current medications from recent records
    const currentMedications = recentRecords
      .filter(record => record.medications && record.medications.length > 0)
      .slice(0, 3)
      .reduce((meds, record) => [...meds, ...record.medications], []);

    // Get vital signs trends (last 5 records with vital signs)
    const vitalSignsRecords = await MedicalRecord.find({
      patientId,
      'vitalSigns.bloodPressure.systolic': { $exists: true }
    })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('vitalSigns createdAt');

    const summary = {
      patient: {
        id: patient._id,
        name: `${patient.userId.firstName} ${patient.userId.lastName}`,
        dateOfBirth: patient.userId.dateOfBirth,
        bloodType: patient.medicalInfo.bloodType,
        allergies
      },
      overview: {
        totalRecords: await MedicalRecord.countDocuments({ patientId }),
        lastVisit: recentRecords[0]?.createdAt,
        chronicConditions: chronicConditions.slice(0, 5)
      },
      recentRecords: recentRecords.slice(0, 5),
      currentMedications: currentMedications.slice(0, 10),
      vitalSignsTrends: vitalSignsRecords.reverse()
    };

    res.json({
      success: true,
      data: summary
    });

  } catch (error) {
    logger.error('Get medical record summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get medical record summary',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

/**
 * @route   GET /api/medical-records/stats/overview
 * @desc    Get medical records statistics
 * @access  Private (Admin, Staff)
 */
router.get('/stats/overview', authenticate, authorize('admin', 'staff'), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    // Records by type
    const recordsByType = await MedicalRecord.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$recordType',
          count: { $sum: 1 }
        }
      }
    ]);

    // Records by month (last 12 months)
    const yearAgo = new Date();
    yearAgo.setFullYear(yearAgo.getFullYear() - 1);

    const monthlyRecords = await MedicalRecord.aggregate([
      {
        $match: {
          createdAt: { $gte: yearAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Top diagnoses
    const topDiagnoses = await MedicalRecord.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$diagnosis.primaryDiagnosis',
          count: { $sum: 1 }
        }
      },
      { $match: { _id: { $ne: null } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const totalRecords = await MedicalRecord.countDocuments(dateFilter);

    res.json({
      success: true,
      data: {
        totalRecords,
        recordsByType,
        monthlyRecords,
        topDiagnoses
      }
    });

  } catch (error) {
    logger.error('Get medical records stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get medical records statistics',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

module.exports = router;
