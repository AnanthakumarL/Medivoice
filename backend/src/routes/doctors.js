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
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');

const router = express.Router();

/**
 * @route   GET /api/doctors
 * @desc    Get all doctors with search and filters
 * @access  Public
 */
router.get('/',
  validateQuery(doctorValidation.search),
  catchAsync(async (req, res) => {
    const { specialization, location, rating, fee, page = 1, limit = 10 } = req.query;

    // Build search query
    let query = { isVerified: true };
    
    if (specialization) {
      query.specialization = { $regex: specialization, $options: 'i' };
    }
    
    if (location) {
      query.$or = [
        { 'address.city': { $regex: location, $options: 'i' } },
        { 'address.state': { $regex: location, $options: 'i' } }
      ];
    }
    
    if (rating) {
      query.rating = { $gte: parseFloat(rating) };
    }
    
    if (fee && fee.min && fee.max) {
      query.consultationFee = { $gte: fee.min, $lte: fee.max };
    }

    // Execute query with pagination
    const { query: paginatedQuery, pagination } = paginate(
      Doctor.find(query)
        .populate('user', 'firstName lastName profilePicture')
        .sort({ rating: -1, totalPatients: -1 }),
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
 * @route   GET /api/doctors/:id
 * @desc    Get doctor by ID
 * @access  Public
 */
router.get('/:id',
  catchAsync(async (req, res) => {
    const doctor = await Doctor.findById(req.params.id)
      .populate('user', 'firstName lastName email phone profilePicture')
      .populate('patients', 'patientId user', null, { limit: 5 });

    if (!doctor) {
      throw new AppError('Doctor not found', 404);
    }

    // Get recent reviews (implement Review model later)
    // const reviews = await Review.find({ doctor: doctor._id })
    //   .populate('patient', 'user')
    //   .sort({ createdAt: -1 })
    //   .limit(5);

    sendResponse(res, 200, {
      doctor
      // reviews
    }, 'Doctor details retrieved successfully');
  })
);

/**
 * @route   POST /api/doctors/profile
 * @desc    Create or update doctor profile
 * @access  Private (Doctor only)
 */
router.post('/profile',
  auth,
  authorize('doctor'),
  validate(doctorValidation.profile),
  catchAsync(async (req, res) => {
    const doctorData = {
      user: req.user._id,
      ...req.body
    };

    // Check if doctor profile already exists
    let doctor = await Doctor.findOne({ user: req.user._id });

    if (doctor) {
      // Update existing profile
      Object.assign(doctor, req.body);
      doctor = await doctor.save();
    } else {
      // Create new profile
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
 * @route   GET /api/doctors/me/profile
 * @desc    Get current doctor's profile
 * @access  Private (Doctor only)
 */
router.get('/me/profile',
  auth,
  authorize('doctor'),
  catchAsync(async (req, res) => {
    const doctor = await Doctor.findOne({ user: req.user._id })
      .populate('user', 'firstName lastName email phone profilePicture')
      .populate('patients', 'patientId user');

    if (!doctor) {
      throw new AppError('Doctor profile not found', 404);
    }

    sendResponse(res, 200, doctor, 'Doctor profile retrieved successfully');
  })
);

/**
 * @route   PUT /api/doctors/me/availability
 * @desc    Update doctor availability
 * @access  Private (Doctor only)
 */
router.put('/me/availability',
  auth,
  authorize('doctor'),
  authorizeDoctor,
  catchAsync(async (req, res) => {
    const { availability } = req.body;

    req.doctor.availability = availability;
    await req.doctor.save();

    sendResponse(res, 200, req.doctor, 'Availability updated successfully');
  })
);

/**
 * @route   GET /api/doctors/me/appointments
 * @desc    Get doctor's appointments
 * @access  Private (Doctor only)
 */
router.get('/me/appointments',
  auth,
  authorize('doctor'),
  authorizeDoctor,
  catchAsync(async (req, res) => {
    const { status, date, page = 1, limit = 10 } = req.query;

    let query = { doctor: req.doctor._id };
    
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
 * @route   GET /api/doctors/me/patients
 * @desc    Get doctor's patients
 * @access  Private (Doctor only)
 */
router.get('/me/patients',
  auth,
  authorize('doctor'),
  authorizeDoctor,
  catchAsync(async (req, res) => {
    const { search, page = 1, limit = 10 } = req.query;

    let query = { primaryDoctor: req.doctor._id };
    
    if (search) {
      // Search in patient details
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
        .populate('user', 'firstName lastName email phone profilePicture')
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
 * @route   GET /api/doctors/me/analytics
 * @desc    Get doctor analytics
 * @access  Private (Doctor only)
 */
router.get('/me/analytics',
  auth,
  authorize('doctor'),
  authorizeDoctor,
  catchAsync(async (req, res) => {
    const { period = '30d' } = req.query;
    
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
          doctor: req.doctor._id,
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
    const totalPatients = await Patient.countDocuments({ primaryDoctor: req.doctor._id });

    // Get recent appointments
    const recentAppointments = await Appointment.find({
      doctor: req.doctor._id,
      createdAt: { $gte: startDate }
    })
    .populate('patient', 'patientId user')
    .sort({ createdAt: -1 })
    .limit(5);

    // Calculate revenue (if payment tracking is implemented)
    const revenue = await Appointment.aggregate([
      {
        $match: {
          doctor: req.doctor._id,
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
      recentAppointments,
      revenue: revenue[0]?.total || 0,
      dateRange: { startDate, endDate }
    }, 'Analytics retrieved successfully');
  })
);

/**
 * @route   GET /api/doctors/:id/availability
 * @desc    Get doctor availability for appointment booking
 * @access  Public
 */
router.get('/:id/availability',
  catchAsync(async (req, res) => {
    const { date } = req.query;
    
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      throw new AppError('Doctor not found', 404);
    }

    const targetDate = date ? new Date(date) : new Date();
    const dayName = targetDate.toLocaleLowerCase().slice(0, 3); // mon, tue, wed, etc.
    
    // Get doctor's availability for the day
    const dayAvailability = doctor.availability[dayName];
    
    if (!dayAvailability || !dayAvailability.isAvailable) {
      sendResponse(res, 200, {
        date: targetDate,
        available: false,
        slots: []
      }, 'Doctor not available on this day');
      return;
    }

    // Get existing appointments for the date
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingAppointments = await Appointment.find({
      doctor: doctor._id,
      scheduledTime: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ['scheduled', 'confirmed', 'in-progress'] }
    }).select('scheduledTime duration');

    // Calculate available slots
    const availableSlots = [];
    dayAvailability.slots.forEach(slot => {
      const slotStart = new Date(targetDate);
      const [startHour, startMinute] = slot.startTime.split(':');
      slotStart.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);
      
      const slotEnd = new Date(targetDate);
      const [endHour, endMinute] = slot.endTime.split(':');
      slotEnd.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);

      // Generate 30-minute slots
      let currentTime = new Date(slotStart);
      while (currentTime < slotEnd) {
        const slotEndTime = new Date(currentTime);
        slotEndTime.setMinutes(currentTime.getMinutes() + 30);

        // Check if slot conflicts with existing appointments
        const hasConflict = existingAppointments.some(appointment => {
          const appointmentEnd = new Date(appointment.scheduledTime);
          appointmentEnd.setMinutes(appointmentEnd.getMinutes() + (appointment.duration || 30));
          
          return (currentTime < appointmentEnd && slotEndTime > appointment.scheduledTime);
        });

        if (!hasConflict && currentTime > new Date()) {
          availableSlots.push({
            startTime: currentTime.toISOString(),
            endTime: slotEndTime.toISOString(),
            available: true
          });
        }

        currentTime.setMinutes(currentTime.getMinutes() + 30);
      }
    });

    sendResponse(res, 200, {
      date: targetDate,
      available: availableSlots.length > 0,
      slots: availableSlots
    }, 'Availability retrieved successfully');
  })
);

module.exports = router;