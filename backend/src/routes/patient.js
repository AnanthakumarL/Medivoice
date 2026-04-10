const express = require('express');
const { auth, authorize } = require('../middleware/auth-patient');
const { 
  catchAsync,
  sendResponse,
  AppError,
  paginate 
} = require('../middleware/errorHandler');
const Patient = require('../models/Patient-enhanced');
const User = require('../models/User-enhanced');
const Appointment = require('../models/Appointment-enhanced');
const Doctor = require('../models/Doctor-enhanced');
const MedicalRecord = require('../models/MedicalRecord');
const Prescription = require('../models/Prescription');

const router = express.Router();

// Apply auth and patient authorization to all routes
router.use(auth);
router.use(authorize('patient'));

// Helper function to get patient by user ID
const getPatientByUserId = async (userId) => {
  try {
    console.log('Searching for patient with userId:', userId);
    const patient = await Patient.findOne({ userId: userId });
    
    if (!patient) {
      console.log('No patient found for userId:', userId);
      // Let's also check if there are any patients at all
      const patientCount = await Patient.countDocuments();
      console.log('Total patients in database:', patientCount);
      throw new AppError('Patient profile not found', 404);
    }
    
    console.log('Found patient:', patient._id);
    return patient;
  } catch (error) {
    console.error('Error finding patient:', error);
    throw new AppError('Patient profile not found', 404);
  }
};

/**
 * @route   GET /api/patient/dashboard
 * @desc    Get patient dashboard data
 * @access  Private (Patient only)
 */
router.get('/dashboard',
  catchAsync(async (req, res) => {
    // Get patient data directly (auto-populates userId via model pre-hook)
    const patient = await getPatientByUserId(req.user.userId);

    // Get upcoming appointments
    const upcomingAppointments = await Appointment.find({
      patient: patient._id,
      status: { $in: ['scheduled', 'confirmed'] },
      scheduledTime: { $gte: new Date() }
    })
    .populate({
      path: 'doctor',
      select: 'specialty',
      populate: { path: 'userId', select: 'firstName lastName' }
    })
    .sort({ scheduledTime: 1 })
    .limit(5);

    // Get recent appointments
    const recentAppointments = await Appointment.find({
      patient: patient._id,
      status: 'completed',
      scheduledTime: { $lt: new Date() }
    })
    .populate({
      path: 'doctor',
      select: 'specialty',
      populate: { path: 'userId', select: 'firstName lastName' }
    })
    .sort({ scheduledTime: -1 })
    .limit(5);

    // Get recent prescriptions
    const recentPrescriptions = await Prescription.find({ patient: patient._id })
      .sort({ createdAt: -1 })
      .limit(5);

    // Get recent medical records
    const recentMedicalRecords = await MedicalRecord.find({ patient: patient._id })
      .sort({ createdAt: -1 })
      .limit(5);

    // Get statistics
    const stats = {
      totalAppointments: await Appointment.countDocuments({ patient: patient._id }),
      completedAppointments: await Appointment.countDocuments({ patient: patient._id, status: 'completed' }),
      upcomingAppointments: await Appointment.countDocuments({ patient: patient._id, status: { $in: ['scheduled', 'confirmed'] }, scheduledTime: { $gte: new Date() } }),
      totalPrescriptions: await Prescription.countDocuments({ patient: patient._id })
    };

    sendResponse(res, 200, {
      patient,
      stats,
      upcomingAppointments,
      recentAppointments,
      recentPrescriptions,
      recentMedicalRecords
    }, 'Dashboard data retrieved successfully');
  })
);

/**
 * @route   POST /api/patient/profile
 * @desc    Create/update patient profile
 * @access  Private (Patient only)
 */
router.post('/profile',
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
      // Generate patient ID
      const patientCount = await Patient.countDocuments();
      patientData.patientId = `PAT${String(patientCount + 1).padStart(6, '0')}`;
      
      patient = new Patient(patientData);
      await patient.save();
    }

    await patient.populate([
      { path: 'user', select: 'firstName lastName email phone' },
      { path: 'primaryDoctor', select: 'specialization user' }
    ]);

    sendResponse(res, patient.isNew ? 201 : 200, patient, 
      patient.isNew ? 'Patient profile created successfully' : 'Patient profile updated successfully'
    );
  })
);

/**
 * @route   GET /api/patient/profile
 * @desc    Get own patient profile
 * @access  Private (Patient only)
 */
router.get('/profile',
  catchAsync(async (req, res) => {
    // Ensure patient profile exists
    const patient = await ensurePatientProfile(req.user._id);
    
    // Populate patient data
    await patient.populate([
      { path: 'user', select: 'firstName lastName email phone profileImageUrl dateOfBirth gender' },
      { path: 'primaryDoctor', select: 'specialization user' }
    ]);

    sendResponse(res, 200, patient, 'Patient profile retrieved successfully');
  })
);

/**
 * @route   PUT /api/patient/profile
 * @desc    Update patient profile
 * @access  Private (Patient only)
 */
router.put('/profile',
  catchAsync(async (req, res) => {
    // Ensure patient profile exists
    let patient = await ensurePatientProfile(req.user._id);
    
    // Update allowed fields
    const allowedFields = ['medicalInfo', 'emergencyContact', 'insurance', 'address', 'primaryDoctor'];
    const updates = {};
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'medicalInfo' && patient.medicalInfo) {
          updates[field] = { ...patient.medicalInfo.toObject(), ...req.body[field] };
        } else if (field === 'emergencyContact' && patient.emergencyContact) {
          updates[field] = { ...patient.emergencyContact.toObject(), ...req.body[field] };
        } else if (field === 'insurance' && patient.insurance) {
          updates[field] = { ...patient.insurance.toObject(), ...req.body[field] };
        } else {
          updates[field] = req.body[field];
        }
      }
    });

    patient = await Patient.findOneAndUpdate(
      { user: req.user._id },
      updates,
      { new: true, runValidators: true }
    ).populate([
      { path: 'user', select: 'firstName lastName email phone profileImageUrl dateOfBirth gender' },
      { path: 'primaryDoctor', select: 'specialization user' }
    ]);

    sendResponse(res, 200, patient, 'Patient profile updated successfully');
  })
);

/**
 * @route   PUT /api/patient/vitals
 * @desc    Update patient vitals
 * @access  Private (Patient only)
 */
router.put('/vitals',
  catchAsync(async (req, res) => {
    const patient = await Patient.findOneAndUpdate(
      { user: req.user._id },
      { 
        $push: { 
          vitals: {
            ...req.body,
            recordedAt: new Date()
          }
        }
      },
      { new: true, runValidators: true }
    );

    if (!patient) {
      throw new AppError('Patient profile not found', 404);
    }

    sendResponse(res, 200, patient.vitals[patient.vitals.length - 1], 'Vitals updated successfully');
  })
);

/**
 * @route   GET /api/patient/appointments
 * @desc    Get patient's appointments
 * @access  Private (Patient only)
 */
router.get('/appointments',
  catchAsync(async (req, res) => {
    const { status, page = 1, limit = 10 } = req.query;

    // Ensure patient profile exists
    const patient = await getPatientByUserId(req.user.userId);

    let query = { patient: patient._id };
    
    if (status) {
      query.status = status;
    }

    const { query: paginatedQuery, pagination } = paginate(
      Appointment.find(query)
        .populate({
          path: 'doctor',
          select: 'specialty consultationFee hospital',
          populate: {
            path: 'userId',
            select: 'firstName lastName'
          }
        })
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
 * @route   GET /api/patient/doctors
 * @desc    Get available doctors for booking
 * @access  Private (Patient only)
 */
router.get('/doctors',
  catchAsync(async (req, res) => {
    const doctors = await Doctor.find({ 
      isVerified: true,
      isAcceptingNewPatients: true 
    })
    .populate('userId', 'firstName lastName email phone')
    .select('specialty hospital licenseNumber experience consultationFee rating');

    sendResponse(res, 200, { doctors }, 'Doctors retrieved successfully');
  })
);

/**
 * @route   POST /api/patient/appointments
 * @desc    Book appointment
 * @access  Private (Patient only)
 */
router.post('/appointments',
  catchAsync(async (req, res) => {
    console.log('Booking appointment - User ID:', req.user.userId);
    console.log('Request body:', req.body);
    
    // Validate required fields
    if (!req.body.doctor) {
      throw new AppError('Doctor ID is required', 400);
    }
    if (!req.body.scheduledTime) {
      throw new AppError('Scheduled time is required', 400);
    }
    if (!req.body.reason || !req.body.reason.trim()) {
      throw new AppError('Reason for appointment is required', 400);
    }
    
    // Ensure patient profile exists
    const patient = await getPatientByUserId(req.user.userId);

    const doctor = await Doctor.findById(req.body.doctor);
    if (!doctor) {
      throw new AppError('Doctor not found', 404);
    }

    // Check if the requested time slot is available
    const existingAppointment = await Appointment.findOne({
      doctor: req.body.doctor,
      scheduledTime: req.body.scheduledTime,
      status: { $in: ['scheduled', 'confirmed', 'in-progress'] }
    });

    if (existingAppointment) {
      throw new AppError('Time slot is not available', 400);
    }

    const appointmentData = {
      patient: patient._id,
      doctor: req.body.doctor,
      scheduledTime: req.body.scheduledTime,
      appointmentType: req.body.appointmentType || 'consultation',
      reason: req.body.reason.trim(),
      notes: req.body.notes || '',
      duration: req.body.duration || 30,
      consultationFee: doctor.consultationFee,
      status: 'scheduled'
    };

    console.log('Creating appointment with data:', appointmentData);
    
    const appointment = new Appointment(appointmentData);
    
    try {
      await appointment.save();
      console.log('Appointment saved successfully:', appointment.appointmentNumber);
    } catch (saveError) {
      console.error('Error saving appointment:', saveError);
      throw saveError;
    }

    await appointment.populate([
      { path: 'patient', select: 'firstName lastName email' },
      { path: 'doctor', select: 'firstName lastName specialization consultationFee hospital' }
    ]);

    sendResponse(res, 201, appointment, 'Appointment booked successfully');
  })
);

/**
 * @route   POST /api/patient/check-availability
 * @desc    Check if appointment slot is available
 * @access  Private (Patient only)
 */
router.post('/check-availability',
  catchAsync(async (req, res) => {
    const { doctor, scheduledTime, duration = 30 } = req.body;

    if (!doctor || !scheduledTime) {
      throw new AppError('Doctor and scheduled time are required', 400);
    }

    // Check if the scheduled time is in the past
    const appointmentTime = new Date(scheduledTime);
    if (appointmentTime <= new Date()) {
      return sendResponse(res, 200, { 
        available: false, 
        reason: 'Cannot schedule appointments in the past' 
      });
    }

    // Check for existing appointments at this time
    const existingAppointment = await Appointment.findOne({
      doctor: doctor,
      scheduledTime: scheduledTime,
      status: { $in: ['scheduled', 'confirmed', 'in-progress'] }
    });

    if (existingAppointment) {
      return sendResponse(res, 200, { 
        available: false, 
        reason: 'Time slot is already booked' 
      });
    }

    // Check if it's within doctor's working hours (assuming 9 AM to 5 PM)
    const hour = appointmentTime.getHours();
    if (hour < 9 || hour >= 17) {
      return sendResponse(res, 200, { 
        available: false, 
        reason: 'Outside of working hours (9 AM - 5 PM)' 
      });
    }

    sendResponse(res, 200, { 
      available: true, 
      message: 'Time slot is available' 
    });
  })
);

/**
 * @route   GET /api/patient/available-slots/:doctorId/:date
 * @desc    Get available time slots for a doctor on a specific date
 * @access  Private (Patient only)
 */
router.get('/available-slots/:doctorId/:date',
  catchAsync(async (req, res) => {
    const { doctorId, date } = req.params;
    
    // Parse the date and create start/end of day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Get all booked appointments for this doctor on this date
    const bookedAppointments = await Appointment.find({
      doctor: doctorId,
      scheduledTime: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      status: { $in: ['scheduled', 'confirmed', 'in-progress'] }
    }).select('scheduledTime duration');

    // Generate all possible time slots (9 AM to 5 PM, 30-minute intervals)
    const allSlots = [];
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const slotTime = new Date(startOfDay);
        slotTime.setHours(hour, minute, 0, 0);
        allSlots.push({
          time: slotTime.toISOString(),
          formatted: slotTime.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: true 
          }),
          available: true
        });
      }
    }

    // Mark booked slots as unavailable
    bookedAppointments.forEach(appointment => {
      const bookedTime = appointment.scheduledTime.toISOString();
      const slot = allSlots.find(s => s.time === bookedTime);
      if (slot) {
        slot.available = false;
        slot.reason = 'Already booked';
      }
    });

    // Filter out past slots if it's today
    const now = new Date();
    const isToday = startOfDay.toDateString() === now.toDateString();
    
    const availableSlots = allSlots.filter(slot => {
      if (isToday) {
        return new Date(slot.time) > now && slot.available;
      }
      return slot.available;
    });

    sendResponse(res, 200, { 
      date: date,
      doctorId: doctorId,
      totalSlots: allSlots.length,
      availableSlots: availableSlots,
      bookedSlots: allSlots.filter(slot => !slot.available)
    });
  })
);

/**
 * @route   GET /api/patient/medical-records
 * @desc    Get patient's medical records
 * @access  Private (Patient only)
 */
router.get('/medical-records',
  catchAsync(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    // Ensure patient profile exists
    const patient = await ensurePatientProfile(req.user._id);

    const { query: paginatedQuery, pagination } = paginate(
      MedicalRecord.find({ patient: patient._id })
        .populate('doctor', 'specialization user')
        .populate('appointment', 'scheduledTime appointmentType')
        .sort({ createdAt: -1 }),
      page,
      limit
    );

    const medicalRecords = await paginatedQuery;
    const total = await MedicalRecord.countDocuments({ patient: patient._id });

    sendResponse(res, 200, {
      medicalRecords,
      pagination: {
        ...pagination,
        total,
        pages: Math.ceil(total / pagination.limit)
      }
    }, 'Medical records retrieved successfully');
  })
);

/**
 * @route   GET /api/patient/prescriptions
 * @desc    Get patient's prescriptions
 * @access  Private (Patient only)
 */
router.get('/prescriptions',
  catchAsync(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) {
      throw new AppError('Patient profile not found', 404);
    }

    const { query: paginatedQuery, pagination } = paginate(
      Prescription.find({ patient: patient._id })
        .populate('doctor', 'specialization user')
        .populate('appointment', 'scheduledTime')
        .sort({ createdAt: -1 }),
      page,
      limit
    );

    const prescriptions = await paginatedQuery;
    const total = await Prescription.countDocuments({ patient: patient._id });

    sendResponse(res, 200, {
      prescriptions,
      pagination: {
        ...pagination,
        total,
        pages: Math.ceil(total / pagination.limit)
      }
    }, 'Prescriptions retrieved successfully');
  })
);

/**
 * @route   GET /api/patient/doctors
 * @desc    Get available doctors
 * @access  Private (Patient only)
 */
router.get('/doctors',
  catchAsync(async (req, res) => {
    const { specialization, search, page = 1, limit = 10 } = req.query;

    let query = { isVerified: true, isActive: true };
    
    if (specialization) {
      query.specialization = specialization;
    }

    if (search) {
      const users = await User.find({
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } }
        ]
      }).select('_id');
      
      const userIds = users.map(user => user._id);
      query.user = { $in: userIds };
    }

    const { query: paginatedQuery, pagination } = paginate(
      Doctor.find(query)
        .populate('user', 'firstName lastName profileImageUrl')
        .select('specialization experience consultationFee rating workingHours languages')
        .sort({ rating: -1 }),
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
    }, 'Available doctors retrieved successfully');
  })
);

/**
 * @route   GET /api/patient/doctors/:id/availability
 * @desc    Get doctor availability
 * @access  Private (Patient only)
 */
router.get('/doctors/:id/availability',
  catchAsync(async (req, res) => {
    const { date } = req.query;
    
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      throw new AppError('Doctor not found', 404);
    }

    const targetDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Get booked appointments for the day
    const bookedAppointments = await Appointment.find({
      doctor: doctor._id,
      scheduledTime: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ['scheduled', 'confirmed', 'in-progress'] }
    }).select('scheduledTime');

    // Get doctor's working hours for the day
    const dayOfWeek = targetDate.getDay();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const workingHours = doctor.workingHours[dayNames[dayOfWeek]];

    let availableSlots = [];
    
    if (workingHours && workingHours.isWorking) {
      const startTime = new Date(targetDate);
      const [startHour, startMinute] = workingHours.startTime.split(':');
      startTime.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);

      const endTime = new Date(targetDate);
      const [endHour, endMinute] = workingHours.endTime.split(':');
      endTime.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);

      // Generate 30-minute slots
      const slotDuration = 30 * 60 * 1000; // 30 minutes in milliseconds
      const current = new Date(startTime);

      while (current < endTime) {
        const slotEnd = new Date(current.getTime() + slotDuration);
        
        // Check if slot is not booked
        const isBooked = bookedAppointments.some(apt => 
          Math.abs(apt.scheduledTime.getTime() - current.getTime()) < slotDuration
        );

        if (!isBooked && current > new Date()) { // Only future slots
          availableSlots.push({
            startTime: new Date(current),
            endTime: new Date(slotEnd),
            available: true
          });
        }

        current.setTime(current.getTime() + slotDuration);
      }
    }

    sendResponse(res, 200, {
      date: targetDate,
      workingHours,
      availableSlots,
      bookedSlots: bookedAppointments.map(apt => apt.scheduledTime)
    }, 'Doctor availability retrieved successfully');
  })
);

/**
 * @route   POST /api/patient/feedback/:appointmentId
 * @desc    Rate appointment
 * @access  Private (Patient only)
 */
router.post('/feedback/:appointmentId',
  catchAsync(async (req, res) => {
    const { rating, feedback } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      throw new AppError('Rating must be between 1 and 5', 400);
    }

    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) {
      throw new AppError('Patient profile not found', 404);
    }

    const appointment = await Appointment.findById(req.params.appointmentId);
    if (!appointment) {
      throw new AppError('Appointment not found', 404);
    }

    if (appointment.patient.toString() !== patient._id.toString()) {
      throw new AppError('Not authorized to rate this appointment', 403);
    }

    if (appointment.status !== 'completed') {
      throw new AppError('Can only rate completed appointments', 400);
    }

    if (appointment.rating) {
      throw new AppError('Appointment already rated', 400);
    }

    // Update appointment with rating
    appointment.rating = rating;
    appointment.feedback = feedback;
    await appointment.save();

    // Update doctor's average rating
    const doctor = await Doctor.findById(appointment.doctor);
    const allRatedAppointments = await Appointment.find({
      doctor: doctor._id,
      rating: { $exists: true, $ne: null }
    });

    const averageRating = allRatedAppointments.reduce((sum, apt) => sum + apt.rating, 0) / allRatedAppointments.length;
    doctor.rating = Math.round(averageRating * 10) / 10; // Round to 1 decimal place
    await doctor.save();

    sendResponse(res, 200, {
      appointment: {
        _id: appointment._id,
        rating: appointment.rating,
        feedback: appointment.feedback
      }
    }, 'Feedback submitted successfully');
  })
);

/**
 * @route   PATCH /api/patient/appointments/:id/cancel
 * @desc    Cancel an appointment
 * @access  Private (Patient only)
 */
router.patch('/appointments/:id/cancel',
  catchAsync(async (req, res) => {
    const patient = await getPatientByUserId(req.user.userId);

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      patient: patient._id
    });

    if (!appointment) {
      throw new AppError('Appointment not found or you are not authorized to cancel it', 404);
    }

    if (appointment.status !== 'scheduled' && appointment.status !== 'confirmed') {
      throw new AppError(`Cannot cancel an appointment with status: ${appointment.status}`, 400);
    }

    // Optional: Check if cancellation is too close to the appointment time
    const now = new Date();
    const appointmentTime = new Date(appointment.scheduledTime);
    const hoursDifference = (appointmentTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursDifference < 24) { // Example: 24-hour cancellation policy
      // You might want to just warn or apply a fee instead of throwing an error
      // For now, we'll allow it but you could change this logic
      console.warn(`Appointment ${appointment.appointmentNumber} cancelled less than 24 hours in advance.`);
    }

    appointment.status = 'cancelled';
    appointment.cancellationReason = 'Cancelled by patient'; // Or get from req.body
    await appointment.save();

    sendResponse(res, 200, appointment, 'Appointment cancelled successfully');
  })
);

module.exports = router;