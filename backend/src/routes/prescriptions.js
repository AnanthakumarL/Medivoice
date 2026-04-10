const express = require('express');
const router = express.Router();

// Import models
const Prescription = require('../models/Prescription');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// Import middleware
const { authenticate, authorize } = require('../middleware/auth');
const { validateInput } = require('../middleware/validation');
const logger = require('../config/logger');

/**
 * @route   POST /api/prescriptions
 * @desc    Create a new prescription
 * @access  Private (Doctor)
 */
router.post('/', authenticate, authorize('doctor'), async (req, res) => {
  try {
    const {
      patientId,
      appointmentId,
      medications,
      instructions,
      duration,
      startDate,
      endDate,
      refillsAllowed,
      notes,
      pharmacyInfo
    } = req.body;

    // Validate required fields
    if (!patientId || !medications || !Array.isArray(medications) || medications.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID and medications are required',
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

    // Get doctor profile
    const doctor = await Doctor.findOne({ userId: req.user.userId });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found',
        error: 'DOCTOR_NOT_FOUND'
      });
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

      // Verify appointment belongs to the patient and doctor
      if (appointment.patientId.toString() !== patientId || 
          appointment.doctorId.toString() !== doctor._id.toString()) {
        return res.status(400).json({
          success: false,
          message: 'Appointment does not match patient and doctor',
          error: 'APPOINTMENT_MISMATCH'
        });
      }
    }

    // Validate medications
    for (const med of medications) {
      if (!med.name || !med.dosage || !med.frequency) {
        return res.status(400).json({
          success: false,
          message: 'Each medication must have name, dosage, and frequency',
          error: 'INVALID_MEDICATION_DATA'
        });
      }
    }

    // Set default dates if not provided
    const prescriptionStartDate = startDate ? new Date(startDate) : new Date();
    const prescriptionEndDate = endDate ? new Date(endDate) : 
      duration ? new Date(prescriptionStartDate.getTime() + duration * 24 * 60 * 60 * 1000) : 
      new Date(prescriptionStartDate.getTime() + 30 * 24 * 60 * 60 * 1000); // Default 30 days

    // Create prescription
    const prescription = new Prescription({
      patientId,
      doctorId: doctor._id,
      appointmentId,
      medications: medications.map(med => ({
        ...med,
        status: 'active'
      })),
      instructions: instructions || '',
      startDate: prescriptionStartDate,
      endDate: prescriptionEndDate,
      refillsAllowed: refillsAllowed || 0,
      notes: notes || '',
      pharmacyInfo: pharmacyInfo || {},
      prescribedBy: req.user.userId,
      digitalSignature: {
        doctorId: doctor._id,
        timestamp: new Date(),
        verified: true
      }
    });

    await prescription.save();

    // Populate the response
    await prescription.populate([
      {
        path: 'patientId',
        populate: {
          path: 'userId',
          select: 'firstName lastName dateOfBirth'
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
    ]);

    logger.info('Prescription created', {
      prescriptionId: prescription._id,
      patientId,
      doctorId: doctor._id,
      medicationCount: medications.length,
      prescribedBy: req.user.userId
    });

    res.status(201).json({
      success: true,
      message: 'Prescription created successfully',
      data: { prescription }
    });

  } catch (error) {
    logger.error('Create prescription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create prescription',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

/**
 * @route   GET /api/prescriptions
 * @desc    Get prescriptions (role-based access)
 * @access  Private
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      patientId,
      status,
      active = 'false',
      startDate,
      endDate
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
    // Admin and staff can access all prescriptions

    // Apply additional filters
    if (patientId && ['admin', 'staff', 'doctor'].includes(req.user.role)) {
      query.patientId = patientId;
    }

    if (status) query.status = status;

    if (active === 'true') {
      query.status = { $in: ['active', 'partially_filled'] };
      query.endDate = { $gte: new Date() };
    }

    if (startDate || endDate) {
      query.startDate = {};
      if (startDate) query.startDate.$gte = new Date(startDate);
      if (endDate) query.startDate.$lte = new Date(endDate);
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
            select: 'firstName lastName dateOfBirth'
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

    const prescriptions = await Prescription.paginate(query, options);

    res.json({
      success: true,
      data: prescriptions
    });

  } catch (error) {
    logger.error('Get prescriptions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get prescriptions',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

/**
 * @route   GET /api/prescriptions/:id
 * @desc    Get prescription by ID
 * @access  Private
 */
router.get('/:id', authenticate, async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
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
            select: 'firstName lastName email phoneNumber'
          }
        },
        {
          path: 'appointmentId'
        }
      ]);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found',
        error: 'PRESCRIPTION_NOT_FOUND'
      });
    }

    // Check authorization
    let isAuthorized = false;
    
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user.userId });
      isAuthorized = prescription.patientId._id.toString() === patient._id.toString();
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user.userId });
      isAuthorized = prescription.doctorId._id.toString() === doctor._id.toString();
    } else if (['admin', 'staff', 'pharmacy'].includes(req.user.role)) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this prescription',
        error: 'UNAUTHORIZED_ACCESS'
      });
    }

    res.json({
      success: true,
      data: { prescription }
    });

  } catch (error) {
    logger.error('Get prescription by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get prescription',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

/**
 * @route   PUT /api/prescriptions/:id
 * @desc    Update prescription
 * @access  Private (Doctor who created it, Staff, Admin)
 */
router.put('/:id', authenticate, async (req, res) => {
  try {
    const updates = req.body;
    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found',
        error: 'PRESCRIPTION_NOT_FOUND'
      });
    }

    // Check authorization
    let allowedUpdates = [];
    
    if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user.userId });
      if (prescription.doctorId.toString() !== doctor._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this prescription',
          error: 'UNAUTHORIZED_ACCESS'
        });
      }
      allowedUpdates = ['medications', 'instructions', 'endDate', 'refillsAllowed', 'notes', 'status'];
    } else if (req.user.role === 'pharmacy') {
      allowedUpdates = ['status', 'dispensingHistory', 'pharmacyInfo'];
    } else if (['admin', 'staff'].includes(req.user.role)) {
      allowedUpdates = Object.keys(updates);
    } else {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update prescriptions',
        error: 'UNAUTHORIZED_ACCESS'
      });
    }

    // Filter updates
    const filteredUpdates = {};
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    // Handle status changes
    if (filteredUpdates.status) {
      const validTransitions = {
        'active': ['partially_filled', 'filled', 'expired', 'cancelled'],
        'partially_filled': ['filled', 'expired', 'cancelled'],
        'filled': ['expired'],
        'expired': [],
        'cancelled': []
      };

      if (!validTransitions[prescription.status].includes(filteredUpdates.status)) {
        return res.status(400).json({
          success: false,
          message: `Cannot change status from ${prescription.status} to ${filteredUpdates.status}`,
          error: 'INVALID_STATUS_TRANSITION'
        });
      }

      // Add dispensing history for pharmacy fills
      if (req.user.role === 'pharmacy' && ['partially_filled', 'filled'].includes(filteredUpdates.status)) {
        const dispensingEntry = {
          date: new Date(),
          pharmacyInfo: updates.pharmacyInfo || prescription.pharmacyInfo,
          dispensedBy: req.user.userId,
          quantityDispensed: updates.quantityDispensed || 0,
          notes: updates.dispensingNotes || ''
        };

        if (!prescription.dispensingHistory) {
          prescription.dispensingHistory = [];
        }
        prescription.dispensingHistory.push(dispensingEntry);
        filteredUpdates.dispensingHistory = prescription.dispensingHistory;
      }
    }

    // Add update metadata
    filteredUpdates.lastModifiedBy = req.user.userId;
    filteredUpdates.lastModifiedAt = new Date();

    const updatedPrescription = await Prescription.findByIdAndUpdate(
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

    logger.info('Prescription updated', {
      prescriptionId: req.params.id,
      updatedBy: req.user.userId,
      updates: Object.keys(filteredUpdates),
      newStatus: updatedPrescription.status
    });

    res.json({
      success: true,
      message: 'Prescription updated successfully',
      data: { prescription: updatedPrescription }
    });

  } catch (error) {
    logger.error('Update prescription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update prescription',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

/**
 * @route   POST /api/prescriptions/:id/refill
 * @desc    Request prescription refill
 * @access  Private (Patient, Pharmacy)
 */
router.post('/:id/refill', authenticate, authorize('patient', 'pharmacy'), async (req, res) => {
  try {
    const { quantity, notes } = req.body;
    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found',
        error: 'PRESCRIPTION_NOT_FOUND'
      });
    }

    // Check authorization for patients
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ userId: req.user.userId });
      if (prescription.patientId.toString() !== patient._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to request refill for this prescription',
          error: 'UNAUTHORIZED_ACCESS'
        });
      }
    }

    // Check if prescription allows refills
    if (prescription.refillsUsed >= prescription.refillsAllowed) {
      return res.status(400).json({
        success: false,
        message: 'No refills remaining for this prescription',
        error: 'NO_REFILLS_REMAINING'
      });
    }

    // Check if prescription is still valid
    if (prescription.endDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Prescription has expired',
        error: 'PRESCRIPTION_EXPIRED'
      });
    }

    // Check if prescription is active
    if (!['active', 'partially_filled'].includes(prescription.status)) {
      return res.status(400).json({
        success: false,
        message: 'Prescription is not active',
        error: 'PRESCRIPTION_NOT_ACTIVE'
      });
    }

    // Add refill request or process refill
    const refillEntry = {
      requestedDate: new Date(),
      requestedBy: req.user.userId,
      quantity: quantity || 0,
      notes: notes || '',
      status: req.user.role === 'pharmacy' ? 'filled' : 'requested'
    };

    if (!prescription.refillHistory) {
      prescription.refillHistory = [];
    }
    prescription.refillHistory.push(refillEntry);

    // Update refills used if filled by pharmacy
    if (req.user.role === 'pharmacy') {
      prescription.refillsUsed += 1;
      
      // Add to dispensing history
      const dispensingEntry = {
        date: new Date(),
        pharmacyInfo: prescription.pharmacyInfo,
        dispensedBy: req.user.userId,
        quantityDispensed: quantity || 0,
        notes: notes || '',
        type: 'refill'
      };

      if (!prescription.dispensingHistory) {
        prescription.dispensingHistory = [];
      }
      prescription.dispensingHistory.push(dispensingEntry);
    }

    await prescription.save();

    logger.info('Prescription refill processed', {
      prescriptionId: prescription._id,
      requestedBy: req.user.userId,
      role: req.user.role,
      refillsRemaining: prescription.refillsAllowed - prescription.refillsUsed
    });

    res.json({
      success: true,
      message: req.user.role === 'pharmacy' ? 'Refill processed successfully' : 'Refill requested successfully',
      data: {
        prescriptionId: prescription._id,
        refillsUsed: prescription.refillsUsed,
        refillsRemaining: prescription.refillsAllowed - prescription.refillsUsed,
        status: refillEntry.status
      }
    });

  } catch (error) {
    logger.error('Prescription refill error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process refill',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

/**
 * @route   GET /api/prescriptions/patient/:patientId/active
 * @desc    Get patient's active prescriptions
 * @access  Private (Healthcare providers)
 */
router.get('/patient/:patientId/active', authenticate, authorize('doctor', 'staff', 'admin', 'pharmacy'), async (req, res) => {
  try {
    const { patientId } = req.params;

    // Verify patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
        error: 'PATIENT_NOT_FOUND'
      });
    }

    // Get active prescriptions
    const activePrescriptions = await Prescription.find({
      patientId,
      status: { $in: ['active', 'partially_filled'] },
      endDate: { $gte: new Date() }
    })
    .sort({ createdAt: -1 })
    .populate([
      {
        path: 'doctorId',
        populate: {
          path: 'userId',
          select: 'firstName lastName'
        }
      },
      {
        path: 'appointmentId',
        select: 'appointmentDate'
      }
    ]);

    res.json({
      success: true,
      data: {
        patientId,
        activePrescriptions,
        count: activePrescriptions.length
      }
    });

  } catch (error) {
    logger.error('Get active prescriptions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get active prescriptions',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

/**
 * @route   GET /api/prescriptions/stats/overview
 * @desc    Get prescription statistics
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

    // Prescriptions by status
    const statusStats = await Prescription.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Most prescribed medications
    const topMedications = await Prescription.aggregate([
      { $match: dateFilter },
      { $unwind: '$medications' },
      {
        $group: {
          _id: '$medications.name',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Monthly prescription trends
    const monthlyStats = await Prescription.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) }
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

    const totalPrescriptions = await Prescription.countDocuments(dateFilter);
    const activePrescriptions = await Prescription.countDocuments({
      ...dateFilter,
      status: { $in: ['active', 'partially_filled'] },
      endDate: { $gte: new Date() }
    });

    res.json({
      success: true,
      data: {
        totalPrescriptions,
        activePrescriptions,
        statusStats,
        topMedications,
        monthlyStats
      }
    });

  } catch (error) {
    logger.error('Get prescription stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get prescription statistics',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

module.exports = router;
