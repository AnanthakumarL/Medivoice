const express = require('express');
const router = express.Router();

// Import models
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

// Import middleware
const { authenticate, authorize } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');
const logger = require('../config/logger');

/**
 * @route   GET /api/doctors
 * @desc    Get all doctors (public for browsing)
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      specialty,
      location,
      search,
      available,
      verified
    } = req.query;

    const query = { verificationStatus: verified === 'false' ? { $ne: 'verified' } : 'verified' };

    // Apply filters
    if (specialty) {
      query.specialties = { $in: [specialty] };
    }

    if (location) {
      query['contactInfo.address.city'] = { $regex: location, $options: 'i' };
    }

    if (search) {
      // We'll need to join with User model for name search
      const userIds = await User.find({
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } }
        ],
        role: 'doctor'
      }).distinct('_id');

      query.$or = [
        { userId: { $in: userIds } },
        { specialties: { $regex: search, $options: 'i' } }
      ];
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { 'ratings.average': -1, createdAt: -1 },
      populate: {
        path: 'userId',
        select: 'firstName lastName email phoneNumber'
      }
    };

    const doctors = await Doctor.paginate(query, options);

    // If available filter is specified, check current availability
    if (available === 'true') {
      const now = new Date();
      const currentDay = now.toLocaleLowerCase().slice(0, 3); // mon, tue, etc.
      const currentTime = now.getHours() * 60 + now.getMinutes();

      doctors.docs = doctors.docs.filter(doctor => {
        const todaySchedule = doctor.availability.weeklySchedule.find(
          schedule => schedule.day === currentDay
        );
        
        if (!todaySchedule || !todaySchedule.isAvailable) return false;

        return todaySchedule.timeSlots.some(slot => {
          const startTime = parseInt(slot.startTime.split(':')[0]) * 60 + 
                           parseInt(slot.startTime.split(':')[1]);
          const endTime = parseInt(slot.endTime.split(':')[0]) * 60 + 
                         parseInt(slot.endTime.split(':')[1]);
          
          return currentTime >= startTime && currentTime <= endTime;
        });
      });
    }

    res.json({
      success: true,
      data: doctors
    });

  } catch (error) {
    logger.error('Get doctors error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get doctors',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

/**
 * @route   GET /api/doctors/:id
 * @desc    Get doctor by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('userId', 'firstName lastName email phoneNumber');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
        error: 'DOCTOR_NOT_FOUND'
      });
    }

    // Get recent reviews (last 10)
    const recentReviews = doctor.reviews.slice(-10).reverse();

    res.json({
      success: true,
      data: {
        doctor: {
          ...doctor.toJSON(),
          reviews: recentReviews
        }
      }
    });

  } catch (error) {
    logger.error('Get doctor by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get doctor',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

/**
 * @route   PUT /api/doctors/profile
 * @desc    Update doctor profile
 * @access  Private (Doctor)
 */
router.put('/profile', authenticate, authorize(['doctor']), async (req, res) => {
  try {
    const updates = req.body;
    const allowedUpdates = [
      'medicalLicense',
      'specialties',
      'education',
      'experience',
      'hospitalAffiliations',
      'languages',
      'bio',
      'contactInfo',
      'availability',
      'consultationFee',
      'consultationTypes'
    ];

    const filteredUpdates = {};
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    const doctor = await Doctor.findOneAndUpdate(
      { userId: req.user.userId },
      filteredUpdates,
      { new: true, runValidators: true }
    ).populate('userId', 'firstName lastName email phoneNumber');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found',
        error: 'DOCTOR_NOT_FOUND'
      });
    }

    logger.info('Doctor profile updated', {
      doctorId: doctor._id,
      userId: req.user.userId,
      updates: Object.keys(filteredUpdates)
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { doctor }
    });

  } catch (error) {
    logger.error('Update doctor profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

/**
 * @route   GET /api/doctors/:id/availability
 * @desc    Get doctor availability
 * @access  Public
 */
router.get('/:id/availability', async (req, res) => {
  try {
    const { date, days = 7 } = req.query;
    
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
        error: 'DOCTOR_NOT_FOUND'
      });
    }

    const startDate = date ? new Date(date) : new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + parseInt(days));

    // Get existing appointments for the date range
    const existingAppointments = await Appointment.find({
      doctorId: req.params.id,
      appointmentDate: {
        $gte: startDate,
        $lte: endDate
      },
      status: { $in: ['scheduled', 'confirmed'] }
    });

    // Generate available slots
    const availableSlots = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase().slice(0, 3);
      const daySchedule = doctor.availability.weeklySchedule.find(s => s.day === dayName);
      
      if (daySchedule && daySchedule.isAvailable) {
        const daySlots = [];
        
        daySchedule.timeSlots.forEach(slot => {
          const slotStart = new Date(currentDate);
          const [startHour, startMin] = slot.startTime.split(':');
          slotStart.setHours(parseInt(startHour), parseInt(startMin), 0, 0);
          
          const slotEnd = new Date(currentDate);
          const [endHour, endMin] = slot.endTime.split(':');
          slotEnd.setHours(parseInt(endHour), parseInt(endMin), 0, 0);
          
          // Generate slots based on consultation duration
          const duration = doctor.consultationTypes.find(t => t.type === 'in-person')?.duration || 30;
          
          while (slotStart < slotEnd) {
            const slotEndTime = new Date(slotStart.getTime() + duration * 60000);
            
            // Check if this slot is already booked
            const isBooked = existingAppointments.some(apt => {
              const aptStart = new Date(apt.appointmentDate);
              return aptStart.getTime() === slotStart.getTime();
            });
            
            if (!isBooked && slotStart > new Date()) {
              daySlots.push({
                startTime: slotStart.toISOString(),
                endTime: slotEndTime.toISOString(),
                available: true
              });
            }
            
            slotStart.setTime(slotStart.getTime() + duration * 60000);
          }
        });
        
        if (daySlots.length > 0) {
          availableSlots.push({
            date: currentDate.toISOString().split('T')[0],
            day: dayName,
            slots: daySlots
          });
        }
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    res.json({
      success: true,
      data: {
        doctorId: req.params.id,
        availability: availableSlots,
        consultationTypes: doctor.consultationTypes
      }
    });

  } catch (error) {
    logger.error('Get doctor availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get availability',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

/**
 * @route   PUT /api/doctors/availability
 * @desc    Update doctor availability
 * @access  Private (Doctor)
 */
router.put('/availability', authenticate, authorize(['doctor']), async (req, res) => {
  try {
    const { weeklySchedule, timeOff, consultationTypes } = req.body;

    const updateData = {};
    if (weeklySchedule) updateData['availability.weeklySchedule'] = weeklySchedule;
    if (timeOff) updateData['availability.timeOff'] = timeOff;
    if (consultationTypes) updateData.consultationTypes = consultationTypes;

    const doctor = await Doctor.findOneAndUpdate(
      { userId: req.user.userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found',
        error: 'DOCTOR_NOT_FOUND'
      });
    }

    logger.info('Doctor availability updated', {
      doctorId: doctor._id,
      userId: req.user.userId
    });

    res.json({
      success: true,
      message: 'Availability updated successfully',
      data: {
        availability: doctor.availability,
        consultationTypes: doctor.consultationTypes
      }
    });

  } catch (error) {
    logger.error('Update doctor availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update availability',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

/**
 * @route   GET /api/doctors/my/appointments
 * @desc    Get doctor's appointments
 * @access  Private (Doctor)
 */
router.get('/my/appointments', authenticate, authorize(['doctor']), async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      date,
      upcoming = 'true'
    } = req.query;

    // Get doctor profile
    const doctor = await Doctor.findOne({ userId: req.user.userId });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found',
        error: 'DOCTOR_NOT_FOUND'
      });
    }

    const query = { doctorId: doctor._id };

    // Apply filters
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
      sort: { appointmentDate: 1 },
      populate: [
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
    logger.error('Get doctor appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get appointments',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

/**
 * @route   GET /api/doctors/specialties
 * @desc    Get all available specialties
 * @access  Public
 */
router.get('/specialties/list', async (req, res) => {
  try {
    const specialties = await Doctor.distinct('specialties');
    
    res.json({
      success: true,
      data: { specialties: specialties.filter(s => s) }
    });

  } catch (error) {
    logger.error('Get specialties error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get specialties',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

/**
 * @route   POST /api/doctors/:id/review
 * @desc    Add review for doctor
 * @access  Private (Patient)
 */
router.post('/:id/review', authenticate, authorize(['patient']), async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
        error: 'INVALID_RATING'
      });
    }

    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
        error: 'DOCTOR_NOT_FOUND'
      });
    }

    // Check if patient has an appointment with this doctor
    const hasAppointment = await Appointment.findOne({
      doctorId: req.params.id,
      patientId: req.user.patientProfile,
      status: 'completed'
    });

    if (!hasAppointment) {
      return res.status(403).json({
        success: false,
        message: 'You can only review doctors you have had appointments with',
        error: 'NO_APPOINTMENT_HISTORY'
      });
    }

    // Check if user already reviewed this doctor
    const existingReview = doctor.reviews.find(
      review => review.patientId.toString() === req.user.patientProfile
    );

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this doctor',
        error: 'ALREADY_REVIEWED'
      });
    }

    // Add review
    doctor.reviews.push({
      patientId: req.user.patientProfile,
      rating,
      comment,
      createdAt: new Date()
    });

    // Update average rating
    const totalRating = doctor.reviews.reduce((sum, review) => sum + review.rating, 0);
    doctor.ratings.average = totalRating / doctor.reviews.length;
    doctor.ratings.count = doctor.reviews.length;

    await doctor.save();

    logger.info('Doctor review added', {
      doctorId: doctor._id,
      patientId: req.user.patientProfile,
      rating
    });

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: {
        review: doctor.reviews[doctor.reviews.length - 1],
        newRating: doctor.ratings
      }
    });

  } catch (error) {
    logger.error('Add doctor review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add review',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

module.exports = router;
