const express = require('express');
const { 
  auth, 
  authorize, 
  authorizeDoctor 
} = require('../middleware/auth');
const { 
  validate, 
  validateQuery,
  doctorValidation 
} = require('../middleware/validation');
const { 
  catchAsync, 
  sendResponse, 
  AppError,
  paginate 
} = require('../middleware/errorHandler');
const Doctor = require('../models/Doctor-enhanced');
const User = require('../models/User-enhanced');
const Appointment = require('../models/Appointment-enhanced');
const Patient = require('../models/Patient-enhanced');
const MedicalRecord = require('../models/MedicalRecord');

const router = express.Router();

// Public route to get all doctors
router.get('/', catchAsync(async (req, res) => {
  const doctors = await Doctor.find({})
    .populate('user', 'firstName lastName email avatar');
  
  // A simple way to add some dynamic 'nextAvailable' and 'availableToday' info
  const enhancedDoctors = doctors.map(doc => {
    const docObj = doc.toObject();
    // This is mock data logic and should be replaced with real availability logic
    const isAvailable = Math.random() > 0.3;
    return {
      ...docObj,
      availableToday: isAvailable,
      nextAvailable: isAvailable ? 'Today, 3:00 PM' : 'Tomorrow, 10:00 AM',
      rating: (Math.random() * (5 - 4) + 4).toFixed(1), // Random rating between 4 and 5
    };
  });

  sendResponse(res, 200, enhancedDoctors, 'Doctors retrieved successfully');
}));

/**
 * @route   GET /api/doctor/dashboard
 * @desc    Get doctor dashboard data
 * @access  Private (Doctor only)
 */
router.get('/dashboard',
  catchAsync(async (req, res) => {
    const doctor = await Doctor.findOne({ user: req.user._id })
      .populate('user', 'firstName lastName email');

    if (!doctor) {
      throw new AppError('Doctor profile not found', 404);
    }

    // Get today's appointments
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAppointments = await Appointment.find({
      doctor: doctor._id,
      scheduledTime: { $gte: today, $lt: tomorrow },
      status: { $in: ['scheduled', 'confirmed', 'in-progress'] }
    })
    .populate('patient', 'patientId user')
    .populate('patient.user', 'firstName lastName')
    .sort({ scheduledTime: 1 });

    // Get statistics
    const totalPatients = await Patient.countDocuments({ primaryDoctor: doctor._id });
    const totalAppointments = await Appointment.countDocuments({ doctor: doctor._id });
    const completedAppointments = await Appointment.countDocuments({ 
      doctor: doctor._id, 
      status: 'completed' 
    });

    // Get upcoming appointments (next 7 days)
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const upcomingAppointments = await Appointment.find({
      doctor: doctor._id,
      scheduledTime: { $gte: today, $lte: nextWeek },
      status: { $in: ['scheduled', 'confirmed'] }
    })
    .populate('patient', 'patientId user')
    .sort({ scheduledTime: 1 })
    .limit(5);

    // Get recent patients
    const recentPatients = await Patient.find({ primaryDoctor: doctor._id })
      .populate('user', 'firstName lastName profileImageUrl')
      .sort({ lastVisit: -1 })
      .limit(5);

    sendResponse(res, 200, {
      doctor,
      stats: {
        totalPatients,
        totalAppointments,
        completedAppointments,
        todayAppointments: todayAppointments.length
      },
      todayAppointments,
      upcomingAppointments,
      recentPatients
    }, 'Dashboard data retrieved successfully');
  })
);

/**
 * @route   POST /api/doctor/profile
 * @desc    Create/update doctor profile
 * @access  Private (Doctor only)
 */
router.post('/profile',
  validate(doctorValidation.profile),
  catchAsync(async (req, res) => {
    const doctorData = {
      user: req.user._id,
      ...req.body
    };

    let doctor = await Doctor.findOne({ user: req.user._id });

    if (doctor) {
      Object.assign(doctor, req.body);
      doctor = await doctor.save();
    } else {
      doctor = new Doctor(doctorData);
      await doctor.save();
    }

    await doctor.populate('user', 'firstName lastName email phone');

    sendResponse(res, doctor.isNew ? 201 : 200, doctor, 
      doctor.isNew ? 'Doctor profile created successfully' : 'Doctor profile updated successfully'
    );
  })
);

/**
 * @route   GET /api/doctor/profile
 * @desc    Get own doctor profile
 * @access  Private (Doctor only)
 */
router.get('/profile',
  catchAsync(async (req, res) => {
    const doctor = await Doctor.findOne({ user: req.user._id })
      .populate('user', 'firstName lastName email phone profileImageUrl');

    if (!doctor) {
      throw new AppError('Doctor profile not found', 404);
    }

    sendResponse(res, 200, doctor, 'Doctor profile retrieved successfully');
  })
);

/**
 * @route   PUT /api/doctor/profile
 * @desc    Update doctor profile
 * @access  Private (Doctor only)
 */
router.put('/profile',
  validate(doctorValidation.profile),
  catchAsync(async (req, res) => {
    const doctor = await Doctor.findOneAndUpdate(
      { user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    ).populate('user', 'firstName lastName email phone');

    if (!doctor) {
      throw new AppError('Doctor profile not found', 404);
    }

    sendResponse(res, 200, doctor, 'Doctor profile updated successfully');
  })
);

/**
 * @route   GET /api/doctor/appointments
 * @desc    Get doctor's appointments
 * @access  Private (Doctor only)
 */
router.get('/appointments',
  catchAsync(async (req, res) => {
    const { status, date, page = 1, limit = 10 } = req.query;

    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      throw new AppError('Doctor profile not found', 404);
    }

    let query = { doctor: doctor._id };
    
    if (status) {
      query.status = status;
    }
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.scheduledTime = { $gte: startDate, $lt: endDate };
    }

    const { query: paginatedQuery, pagination } = paginate(
      Appointment.find(query)
        .populate('patient', 'patientId user')
        .populate('patient.user', 'firstName lastName phone')
        .sort({ scheduledTime: 1 }),
      page,
      limit
    );

    const appointments = await paginatedQuery;
    const total = await Appointment.countDocuments(query);

    sendResponse(res, 200, {
      appointments,
      pagination: {
        ...pagination,
        total,
        pages: Math.ceil(total / pagination.limit)
      }
    }, 'Appointments retrieved successfully');
  })
);

/**
 * @route   POST /api/doctor/appointments/:id/start
 * @desc    Start an appointment
 * @access  Private (Doctor only)
 */
router.post('/appointments/:id/start',
  catchAsync(async (req, res) => {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      throw new AppError('Doctor profile not found', 404);
    }

    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'patientId user');

    if (!appointment) {
      throw new AppError('Appointment not found', 404);
    }

    if (appointment.doctor.toString() !== doctor._id.toString()) {
      throw new AppError('Not authorized to start this appointment', 403);
    }

    if (appointment.status !== 'confirmed' && appointment.status !== 'scheduled') {
      throw new AppError('Appointment cannot be started', 400);
    }

    await appointment.startAppointment();

    sendResponse(res, 200, appointment, 'Appointment started successfully');
  })
);

/**
 * @route   POST /api/doctor/appointments/:id/complete
 * @desc    Complete an appointment
 * @access  Private (Doctor only)
 */
router.post('/appointments/:id/complete',
  catchAsync(async (req, res) => {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      throw new AppError('Doctor profile not found', 404);
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      throw new AppError('Appointment not found', 404);
    }

    if (appointment.doctor.toString() !== doctor._id.toString()) {
      throw new AppError('Not authorized to complete this appointment', 403);
    }

    if (appointment.status !== 'in-progress') {
      throw new AppError('Appointment must be in progress to complete', 400);
    }

    await appointment.completeAppointment(req.body);

    sendResponse(res, 200, appointment, 'Appointment completed successfully');
  })
);

/**
 * @route   GET /api/doctor/patients
 * @desc    Get doctor's patients
 * @access  Private (Doctor only)
 */
router.get('/patients',
  catchAsync(async (req, res) => {
    const { search, page = 1, limit = 10 } = req.query;

    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      throw new AppError('Doctor profile not found', 404);
    }

    let query = { primaryDoctor: doctor._id };
    
    if (search) {
      const users = await User.find({
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      }).select('_id');
      
      const userIds = users.map(user => user._id);
      
      query.$or = [
        { user: { $in: userIds } },
        { patientId: { $regex: search, $options: 'i' } }
      ];
    }

    const { query: paginatedQuery, pagination } = paginate(
      Patient.find(query)
        .populate('user', 'firstName lastName email phone profileImageUrl dateOfBirth')
        .sort({ createdAt: -1 }),
      page,
      limit
    );

    const patients = await paginatedQuery;
    const total = await Patient.countDocuments(query);

    sendResponse(res, 200, {
      patients,
      pagination: {
        ...pagination,
        total,
        pages: Math.ceil(total / pagination.limit)
      }
    }, 'Patients retrieved successfully');
  })
);

/**
 * @route   GET /api/doctor/patients/:id
 * @desc    Get patient details
 * @access  Private (Doctor only)
 */
router.get('/patients/:id',
  catchAsync(async (req, res) => {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      throw new AppError('Doctor profile not found', 404);
    }

    const patient = await Patient.findById(req.params.id)
      .populate('user', 'firstName lastName email phone dateOfBirth gender profileImageUrl')
      .populate('primaryDoctor', 'specialization user');

    if (!patient) {
      throw new AppError('Patient not found', 404);
    }

    // Check if doctor has access to this patient
    if (patient.primaryDoctor && patient.primaryDoctor._id.toString() !== doctor._id.toString()) {
      throw new AppError('Not authorized to view this patient', 403);
    }

    // Get patient's appointments with this doctor
    const appointments = await Appointment.find({
      patient: patient._id,
      doctor: doctor._id
    }).sort({ scheduledTime: -1 }).limit(10);

    // Get medical records
    const medicalRecords = await MedicalRecord.find({
      patient: patient._id,
      doctor: doctor._id
    }).sort({ createdAt: -1 }).limit(10);

    sendResponse(res, 200, {
      patient,
      appointments,
      medicalRecords
    }, 'Patient details retrieved successfully');
  })
);

/**
 * @route   POST /api/doctor/patients/:id/records
 * @desc    Create medical record for patient
 * @access  Private (Doctor only)
 */
router.post('/patients/:id/records',
  catchAsync(async (req, res) => {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      throw new AppError('Doctor profile not found', 404);
    }

    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      throw new AppError('Patient not found', 404);
    }

    const recordData = {
      patient: patient._id,
      doctor: doctor._id,
      ...req.body
    };

    const medicalRecord = new MedicalRecord(recordData);
    await medicalRecord.save();

    await medicalRecord.populate([
      { path: 'patient', select: 'patientId user' },
      { path: 'doctor', select: 'specialization user' }
    ]);

    sendResponse(res, 201, medicalRecord, 'Medical record created successfully');
  })
);

/**
 * @route   GET /api/doctor/schedule
 * @desc    Get doctor's schedule
 * @access  Private (Doctor only)
 */
router.get('/schedule',
  catchAsync(async (req, res) => {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      throw new AppError('Doctor profile not found', 404);
    }

    const { startDate, endDate } = req.query;
    
    let dateQuery = {};
    if (startDate && endDate) {
      dateQuery = {
        scheduledTime: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    }

    const appointments = await Appointment.find({
      doctor: doctor._id,
      ...dateQuery
    })
    .populate('patient', 'patientId user')
    .sort({ scheduledTime: 1 });

    sendResponse(res, 200, {
      workingHours: doctor.workingHours,
      appointments,
      unavailableDates: doctor.unavailableDates
    }, 'Schedule retrieved successfully');
  })
);

/**
 * @route   PUT /api/doctor/schedule
 * @desc    Update doctor's schedule
 * @access  Private (Doctor only)
 */
router.put('/schedule',
  catchAsync(async (req, res) => {
    const doctor = await Doctor.findOneAndUpdate(
      { user: req.user._id },
      { 
        workingHours: req.body.workingHours,
        unavailableDates: req.body.unavailableDates
      },
      { new: true, runValidators: true }
    );

    if (!doctor) {
      throw new AppError('Doctor profile not found', 404);
    }

    sendResponse(res, 200, {
      workingHours: doctor.workingHours,
      unavailableDates: doctor.unavailableDates
    }, 'Schedule updated successfully');
  })
);

/**
 * @route   GET /api/doctor/analytics
 * @desc    Get doctor analytics
 * @access  Private (Doctor only)
 */
router.get('/analytics',
  catchAsync(async (req, res) => {
    const { period = '30d' } = req.query;
    
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      throw new AppError('Doctor profile not found', 404);
    }

    let startDate;
    const endDate = new Date();
    
    switch (period) {
      case '7d':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get appointment statistics
    const appointmentStats = await Appointment.aggregate([
      {
        $match: {
          doctor: doctor._id,
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get patient count
    const totalPatients = await Patient.countDocuments({ primaryDoctor: doctor._id });

    // Get revenue
    const revenue = await Appointment.aggregate([
      {
        $match: {
          doctor: doctor._id,
          status: 'completed',
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$consultationFee' }
        }
      }
    ]);

    sendResponse(res, 200, {
      period,
      appointmentStats,
      totalPatients,
      revenue: revenue[0]?.total || 0,
      dateRange: { startDate, endDate }
    }, 'Analytics retrieved successfully');
  })
);

/**
 * @route   GET /api/doctor/earnings
 * @desc    Get doctor earnings report
 * @access  Private (Doctor only)
 */
router.get('/earnings',
  catchAsync(async (req, res) => {
    const { period = '30d' } = req.query;
    
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      throw new AppError('Doctor profile not found', 404);
    }

    let startDate;
    const endDate = new Date();
    
    switch (period) {
      case '7d':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get earnings by day
    const dailyEarnings = await Appointment.aggregate([
      {
        $match: {
          doctor: doctor._id,
          status: 'completed',
          actualEndTime: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$actualEndTime" }
          },
          totalEarnings: { $sum: '$consultationFee' },
          appointmentCount: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Get total earnings
    const totalEarnings = await Appointment.aggregate([
      {
        $match: {
          doctor: doctor._id,
          status: 'completed',
          actualEndTime: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$consultationFee' },
          count: { $sum: 1 }
        }
      }
    ]);

    sendResponse(res, 200, {
      period,
      dailyEarnings,
      totalEarnings: totalEarnings[0]?.total || 0,
      totalAppointments: totalEarnings[0]?.count || 0,
      averagePerAppointment: totalEarnings[0] ? 
        (totalEarnings[0].total / totalEarnings[0].count).toFixed(2) : 0,
      dateRange: { startDate, endDate }
    }, 'Earnings report retrieved successfully');
  })
);

module.exports = router;