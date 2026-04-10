const express = require('express');
const { 
  auth, 
  authorize 
} = require('../middleware/auth');
const { 
  validate, 
  validateQuery 
} = require('../middleware/validation');
const { 
  catchAsync, 
  sendResponse, 
  AppError,
  paginate 
} = require('../middleware/errorHandler');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

const router = express.Router();

// Apply auth and staff authorization to all routes
router.use(auth);
router.use(authorize('staff'));

/**
 * @route   GET /api/staff/dashboard
 * @desc    Get staff dashboard data
 * @access  Private (Staff only)
 */
router.get('/dashboard',
  catchAsync(async (req, res) => {
    // Get today's statistics
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Today's appointments
    const todayAppointments = await Appointment.find({
      scheduledTime: { $gte: today, $lt: tomorrow }
    })
    .populate('patient', 'patientId user')
    .populate('doctor', 'specialization user')
    .sort({ scheduledTime: 1 });

    // Statistics
    const stats = {
      todayAppointments: todayAppointments.length,
      totalPatients: await Patient.countDocuments(),
      totalDoctors: await Doctor.countDocuments({ isActive: true }),
      pendingAppointments: await Appointment.countDocuments({ 
        status: 'scheduled',
        scheduledTime: { $gte: new Date() }
      })
    };

    // Recent registrations
    const recentPatients = await Patient.find()
      .populate('user', 'firstName lastName email phone createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    // Upcoming appointments
    const upcomingAppointments = await Appointment.find({
      scheduledTime: { $gte: new Date() },
      status: { $in: ['scheduled', 'confirmed'] }
    })
    .populate('patient', 'patientId user')
    .populate('doctor', 'specialization user')
    .sort({ scheduledTime: 1 })
    .limit(10);

    sendResponse(res, 200, {
      stats,
      todayAppointments,
      recentPatients,
      upcomingAppointments
    }, 'Staff dashboard data retrieved successfully');
  })
);

/**
 * @route   GET /api/staff/appointments
 * @desc    Manage appointments
 * @access  Private (Staff only)
 */
router.get('/appointments',
  catchAsync(async (req, res) => {
    const { status, date, doctor, patient, page = 1, limit = 20 } = req.query;

    let query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.scheduledTime = { $gte: startDate, $lt: endDate };
    }
    
    if (doctor) {
      query.doctor = doctor;
    }
    
    if (patient) {
      query.patient = patient;
    }

    const { query: paginatedQuery, pagination } = paginate(
      Appointment.find(query)
        .populate('patient', 'patientId user')
        .populate('doctor', 'specialization user')
        .sort({ scheduledTime: -1 }),
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
 * @route   PUT /api/staff/appointments/:id
 * @desc    Update appointment
 * @access  Private (Staff only)
 */
router.put('/appointments/:id',
  catchAsync(async (req, res) => {
    const { status, scheduledTime, notes } = req.body;

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      throw new AppError('Appointment not found', 404);
    }

    // Update allowed fields
    if (status) {
      appointment.status = status;
    }
    
    if (scheduledTime) {
      // Check if new time slot is available
      const conflictingAppointment = await Appointment.findOne({
        _id: { $ne: appointment._id },
        doctor: appointment.doctor,
        scheduledTime: new Date(scheduledTime),
        status: { $in: ['scheduled', 'confirmed', 'in-progress'] }
      });

      if (conflictingAppointment) {
        throw new AppError('Time slot is not available', 400);
      }

      appointment.scheduledTime = new Date(scheduledTime);
    }
    
    if (notes) {
      appointment.notes = notes;
    }

    await appointment.save();

    await appointment.populate([
      { path: 'patient', select: 'patientId user' },
      { path: 'doctor', select: 'specialization user' }
    ]);

    sendResponse(res, 200, appointment, 'Appointment updated successfully');
  })
);

/**
 * @route   GET /api/staff/patients
 * @desc    Patient management
 * @access  Private (Staff only)
 */
router.get('/patients',
  catchAsync(async (req, res) => {
    const { search, page = 1, limit = 20 } = req.query;

    let query = {};
    
    if (search) {
      const users = await User.find({
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } }
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
        .populate('user', 'firstName lastName email phone dateOfBirth gender profileImageUrl')
        .populate('primaryDoctor', 'specialization user')
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
 * @route   POST /api/staff/patients
 * @desc    Register patient
 * @access  Private (Staff only)
 */
router.post('/patients',
  catchAsync(async (req, res) => {
    const { 
      firstName, lastName, email, phone, dateOfBirth, gender,
      address, emergencyContact, medicalHistory, allergies 
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { phone }] 
    });

    if (existingUser) {
      throw new AppError('User with this email or phone already exists', 400);
    }

    // Create user
    const userData = {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth: new Date(dateOfBirth),
      gender,
      role: 'patient',
      password: 'temp123', // Temporary password
      isActive: true
    };

    const user = new User(userData);
    await user.save();

    // Generate patient ID
    const patientCount = await Patient.countDocuments();
    const patientId = `PAT${String(patientCount + 1).padStart(6, '0')}`;

    // Create patient profile
    const patientData = {
      user: user._id,
      patientId,
      address,
      emergencyContact,
      medicalHistory: medicalHistory || [],
      allergies: allergies || []
    };

    const patient = new Patient(patientData);
    await patient.save();

    await patient.populate('user', 'firstName lastName email phone dateOfBirth gender');

    sendResponse(res, 201, patient, 'Patient registered successfully');
  })
);

/**
 * @route   GET /api/staff/doctors
 * @desc    Doctor management
 * @access  Private (Staff only)
 */
router.get('/doctors',
  catchAsync(async (req, res) => {
    const { search, specialization, status, page = 1, limit = 20 } = req.query;

    let query = {};
    
    if (specialization) {
      query.specialization = specialization;
    }
    
    if (status) {
      if (status === 'active') {
        query.isActive = true;
      } else if (status === 'inactive') {
        query.isActive = false;
      } else if (status === 'verified') {
        query.isVerified = true;
      } else if (status === 'unverified') {
        query.isVerified = false;
      }
    }

    if (search) {
      const users = await User.find({
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      }).select('_id');
      
      const userIds = users.map(user => user._id);
      query.user = { $in: userIds };
    }

    const { query: paginatedQuery, pagination } = paginate(
      Doctor.find(query)
        .populate('user', 'firstName lastName email phone profileImageUrl')
        .sort({ createdAt: -1 }),
      page,
      limit
    );

    const doctors = await paginatedQuery;
    const total = await Doctor.countDocuments(query);

    sendResponse(res, 200, {
      doctors,
      pagination: {
        ...pagination,
        total,
        pages: Math.ceil(total / pagination.limit)
      }
    }, 'Doctors retrieved successfully');
  })
);

/**
 * @route   GET /api/staff/schedule
 * @desc    View schedules
 * @access  Private (Staff only)
 */
router.get('/schedule',
  catchAsync(async (req, res) => {
    const { date, doctor } = req.query;
    
    let query = {};
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.scheduledTime = { $gte: startDate, $lt: endDate };
    } else {
      // Default to today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      query.scheduledTime = { $gte: today, $lt: tomorrow };
    }
    
    if (doctor) {
      query.doctor = doctor;
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'patientId user')
      .populate('doctor', 'specialization user')
      .sort({ scheduledTime: 1 });

    // Get all doctors for the schedule view
    const doctors = await Doctor.find({ isActive: true })
      .populate('user', 'firstName lastName')
      .select('specialization workingHours');

    sendResponse(res, 200, {
      appointments,
      doctors,
      date: date || new Date().toISOString().split('T')[0]
    }, 'Schedule retrieved successfully');
  })
);

/**
 * @route   POST /api/staff/notifications
 * @desc    Send notifications
 * @access  Private (Staff only)
 */
router.post('/notifications',
  catchAsync(async (req, res) => {
    const { recipients, message, type, appointmentId } = req.body;

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      throw new AppError('Recipients array is required', 400);
    }

    if (!message) {
      throw new AppError('Message is required', 400);
    }

    // In a real application, you would integrate with notification services
    // like Firebase, SendGrid, SMS services, etc.
    // For now, we'll just simulate sending notifications

    const notifications = [];
    
    for (const recipientId of recipients) {
      const user = await User.findById(recipientId);
      if (user) {
        // Simulate notification sending
        notifications.push({
          recipient: user._id,
          message,
          type: type || 'general',
          appointmentId,
          sentAt: new Date(),
          status: 'sent'
        });
      }
    }

    sendResponse(res, 200, {
      sentCount: notifications.length,
      notifications
    }, `Notifications sent to ${notifications.length} recipients`);
  })
);

/**
 * @route   GET /api/staff/reports
 * @desc    Generate reports
 * @access  Private (Staff only)
 */
router.get('/reports',
  catchAsync(async (req, res) => {
    const { type, startDate, endDate } = req.query;

    if (!type) {
      throw new AppError('Report type is required', 400);
    }

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    let report = {};

    switch (type) {
      case 'appointments':
        const appointmentStats = await Appointment.aggregate([
          {
            $match: {
              createdAt: { $gte: start, $lte: end }
            }
          },
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 }
            }
          }
        ]);

        const appointmentsByDay = await Appointment.aggregate([
          {
            $match: {
              scheduledTime: { $gte: start, $lte: end }
            }
          },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$scheduledTime" }
              },
              count: { $sum: 1 }
            }
          },
          {
            $sort: { _id: 1 }
          }
        ]);

        report = {
          type: 'appointments',
          period: { startDate: start, endDate: end },
          summary: appointmentStats,
          daily: appointmentsByDay
        };
        break;

      case 'patients':
        const newPatients = await Patient.countDocuments({
          createdAt: { $gte: start, $lte: end }
        });

        const patientsByDay = await Patient.aggregate([
          {
            $match: {
              createdAt: { $gte: start, $lte: end }
            }
          },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
              },
              count: { $sum: 1 }
            }
          },
          {
            $sort: { _id: 1 }
          }
        ]);

        report = {
          type: 'patients',
          period: { startDate: start, endDate: end },
          summary: { newPatients },
          daily: patientsByDay
        };
        break;

      case 'revenue':
        const revenue = await Appointment.aggregate([
          {
            $match: {
              status: 'completed',
              actualEndTime: { $gte: start, $lte: end }
            }
          },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: '$consultationFee' },
              appointmentCount: { $sum: 1 }
            }
          }
        ]);

        const revenueByDay = await Appointment.aggregate([
          {
            $match: {
              status: 'completed',
              actualEndTime: { $gte: start, $lte: end }
            }
          },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$actualEndTime" }
              },
              revenue: { $sum: '$consultationFee' },
              appointments: { $sum: 1 }
            }
          },
          {
            $sort: { _id: 1 }
          }
        ]);

        report = {
          type: 'revenue',
          period: { startDate: start, endDate: end },
          summary: revenue[0] || { totalRevenue: 0, appointmentCount: 0 },
          daily: revenueByDay
        };
        break;

      default:
        throw new AppError('Invalid report type', 400);
    }

    sendResponse(res, 200, report, 'Report generated successfully');
  })
);

module.exports = router;