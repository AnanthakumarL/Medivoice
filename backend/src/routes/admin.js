const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// Import models
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const MedicalRecord = require('../models/MedicalRecord');
const Prescription = require('../models/Prescription');

// Import middleware
const { authenticate, authorize } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const logger = require('../config/logger');

/**
 * @route   GET /api/admin/dashboard
 * @desc    Get admin dashboard overview
 * @access  Private (Admin only)
 */
router.get('/dashboard', authenticate, authorize('admin'), async (req, res) => {
  try {
    // System overview statistics
    const stats = await Promise.all([
      User.countDocuments(),
      Doctor.countDocuments(),
      Patient.countDocuments(),
      Appointment.countDocuments(),
      MedicalRecord.countDocuments(),
      Prescription.countDocuments()
    ]);

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    const recentActivity = await Promise.all([
      User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      Appointment.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      MedicalRecord.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      Prescription.countDocuments({ createdAt: { $gte: sevenDaysAgo } })
    ]);

    // System health metrics
    const systemHealth = {
      activeUsers: await User.countDocuments({ isActive: true }),
      pendingAppointments: await Appointment.countDocuments({ status: 'scheduled' }),
      overdueAppointments: await Appointment.countDocuments({
        status: 'scheduled',
        appointmentDate: { $lt: new Date() }
      }),
      unverifiedUsers: await User.countDocuments({ isEmailVerified: false })
    };

    // Revenue overview
    const revenueData = await Appointment.aggregate([
      {
        $match: {
          status: 'completed',
          appointmentDate: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$billing.totalAmount' },
          avgRevenue: { $avg: '$billing.totalAmount' },
          appointmentCount: { $sum: 1 }
        }
      }
    ]);

    const dashboard = {
      overview: {
        totalUsers: stats[0],
        totalDoctors: stats[1],
        totalPatients: stats[2],
        totalAppointments: stats[3],
        totalMedicalRecords: stats[4],
        totalPrescriptions: stats[5]
      },
      recentActivity: {
        newUsers: recentActivity[0],
        newAppointments: recentActivity[1],
        newMedicalRecords: recentActivity[2],
        newPrescriptions: recentActivity[3]
      },
      systemHealth,
      revenue: revenueData[0] || {
        totalRevenue: 0,
        avgRevenue: 0,
        appointmentCount: 0
      }
    };

    res.json({
      success: true,
      data: dashboard
    });

  } catch (error) {
    logger.error('Admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load admin dashboard',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

/**
 * @route   GET /api/admin/users
 * @desc    Get all users with advanced filtering and management
 * @access  Private (Admin only)
 */
router.get('/users', authenticate, authorize('admin'), async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      role,
      status,
      verified,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (role) filter.role = role;
    if (status === 'active') filter.isActive = true;
    if (status === 'inactive') filter.isActive = false;
    if (verified === 'true') filter.isEmailVerified = true;
    if (verified === 'false') filter.isEmailVerified = false;
    
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    // Get users with pagination
    const users = await User.find(filter)
      .select('-password -refreshTokens')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const total = await User.countDocuments(filter);

    // Get additional profile data for each user
    const enrichedUsers = await Promise.all(
      users.map(async (user) => {
        let profileData = {};
        
        if (user.role === 'doctor') {
          profileData = await Doctor.findOne({ userId: user._id })
            .select('specialization department ratings availability')
            .lean();
        } else if (user.role === 'patient') {
          profileData = await Patient.findOne({ userId: user._id })
            .select('medicalInfo emergencyContact')
            .lean();
        }

        return {
          ...user,
          profile: profileData
        };
      })
    );

    const pagination = {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalItems: total,
      itemsPerPage: parseInt(limit),
      hasNext: parseInt(page) < Math.ceil(total / parseInt(limit)),
      hasPrev: parseInt(page) > 1
    };

    res.json({
      success: true,
      data: enrichedUsers,
      pagination
    });

  } catch (error) {
    logger.error('Admin get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get users',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

/**
 * @route   POST /api/admin/users
 * @desc    Create new user (any role)
 * @access  Private (Admin only)
 */
router.post('/users', [
  authenticate,
  authorize('admin'),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('firstName').trim().isLength({ min: 2 }),
  body('lastName').trim().isLength({ min: 2 }),
  body('role').isIn(['patient', 'doctor', 'staff', 'admin']),
  body('phone').optional().isMobilePhone()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      email,
      password,
      firstName,
      lastName,
      role,
      phone,
      dateOfBirth,
      address,
      isActive = true,
      isEmailVerified = true // Admin can create pre-verified accounts
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
        error: 'USER_EXISTS'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const userData = {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
      phone,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      address,
      isActive,
      isEmailVerified,
      createdBy: req.user.id
    };

    const user = new User(userData);
    await user.save();

    // Create role-specific profile
    if (role === 'doctor') {
      const doctorData = {
        userId: user._id,
        specialization: req.body.specialization || 'General Medicine',
        department: req.body.department || 'General',
        licenseNumber: req.body.licenseNumber,
        experience: req.body.experience || 0,
        education: req.body.education || [],
        availability: req.body.availability || []
      };
      
      const doctor = new Doctor(doctorData);
      await doctor.save();
    } else if (role === 'patient') {
      const patientData = {
        userId: user._id,
        medicalInfo: {
          bloodType: req.body.bloodType,
          allergies: req.body.allergies || [],
          chronicConditions: req.body.chronicConditions || [],
          medications: req.body.medications || []
        },
        emergencyContact: req.body.emergencyContact,
        insuranceInfo: req.body.insuranceInfo
      };
      
      const patient = new Patient(patientData);
      await patient.save();
    }

    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshTokens;

    logger.info(`Admin ${req.user.id} created new user ${user._id} with role ${role}`);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: userResponse
    });

  } catch (error) {
    logger.error('Admin create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

/**
 * @route   PUT /api/admin/users/:id/status
 * @desc    Update user status (activate/deactivate)
 * @access  Private (Admin only)
 */
router.put('/users/:id/status', [
  authenticate,
  authorize('admin'),
  body('isActive').isBoolean(),
  body('reason').optional().trim().isLength({ min: 3 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { isActive, reason } = req.body;

    // Find user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    // Prevent admin from deactivating themselves
    if (id === req.user.id && !isActive) {
      return res.status(400).json({
        success: false,
        message: 'You cannot deactivate your own account',
        error: 'SELF_DEACTIVATION_PROHIBITED'
      });
    }

    // Update user status
    user.isActive = isActive;
    user.lastModifiedBy = req.user.id;
    
    // Add status change to user's activity log
    if (!user.activityLog) user.activityLog = [];
    user.activityLog.push({
      action: isActive ? 'ACTIVATED' : 'DEACTIVATED',
      performedBy: req.user.id,
      timestamp: new Date(),
      reason: reason || 'No reason provided'
    });

    await user.save();

    logger.info(`Admin ${req.user.id} ${isActive ? 'activated' : 'deactivated'} user ${id}. Reason: ${reason || 'None'}`);

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        userId: user._id,
        isActive: user.isActive
      }
    });

  } catch (error) {
    logger.error('Admin update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete user and all associated data
 * @access  Private (Admin only)
 */
router.delete('/users/:id', [
  authenticate,
  authorize('admin'),
  body('confirmDelete').equals('true'),
  body('reason').trim().isLength({ min: 5 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { reason } = req.body;

    // Find user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    // Prevent admin from deleting themselves
    if (id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account',
        error: 'SELF_DELETION_PROHIBITED'
      });
    }

    // Delete associated data based on role
    if (user.role === 'doctor') {
      await Doctor.findOneAndDelete({ userId: id });
      // Cancel future appointments
      await Appointment.updateMany(
        { doctorId: id, status: 'scheduled', appointmentDate: { $gt: new Date() } },
        { status: 'cancelled', cancellationReason: 'Doctor account deleted' }
      );
    } else if (user.role === 'patient') {
      await Patient.findOneAndDelete({ userId: id });
      // Cancel future appointments
      await Appointment.updateMany(
        { patientId: id, status: 'scheduled', appointmentDate: { $gt: new Date() } },
        { status: 'cancelled', cancellationReason: 'Patient account deleted' }
      );
    }

    // Log deletion before deleting user
    logger.warn(`Admin ${req.user.id} deleted user ${id} (${user.email}). Reason: ${reason}`);

    // Delete user
    await User.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'User and associated data deleted successfully'
    });

  } catch (error) {
    logger.error('Admin delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

/**
 * @route   GET /api/admin/system/health
 * @desc    Get system health status
 * @access  Private (Admin only)
 */
router.get('/system/health', authenticate, authorize('admin'), async (req, res) => {
  try {
    // Database connection status
    const mongoose = require('mongoose');
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

    // Performance metrics
    const performanceMetrics = {
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage()
    };

    // Database statistics
    const dbStats = await Promise.all([
      User.estimatedDocumentCount(),
      Appointment.estimatedDocumentCount(),
      MedicalRecord.estimatedDocumentCount(),
      Prescription.estimatedDocumentCount()
    ]);

    // Check for potential issues
    const issues = [];
    
    // Check for high memory usage (> 500MB)
    if (performanceMetrics.memoryUsage.heapUsed > 500 * 1024 * 1024) {
      issues.push({
        type: 'performance',
        severity: 'warning',
        message: 'High memory usage detected'
      });
    }

    // Check for unverified users
    const unverifiedCount = await User.countDocuments({ isEmailVerified: false });
    if (unverifiedCount > 100) {
      issues.push({
        type: 'security',
        severity: 'info',
        message: `${unverifiedCount} unverified users found`
      });
    }

    // Check for overdue appointments
    const overdueCount = await Appointment.countDocuments({
      status: 'scheduled',
      appointmentDate: { $lt: new Date() }
    });
    if (overdueCount > 0) {
      issues.push({
        type: 'business',
        severity: 'warning',
        message: `${overdueCount} overdue appointments found`
      });
    }

    const healthStatus = {
      status: issues.some(i => i.severity === 'critical') ? 'critical' : 
              issues.some(i => i.severity === 'warning') ? 'warning' : 'healthy',
      timestamp: new Date(),
      database: {
        status: dbStatus,
        collections: {
          users: dbStats[0],
          appointments: dbStats[1],
          medicalRecords: dbStats[2],
          prescriptions: dbStats[3]
        }
      },
      performance: performanceMetrics,
      issues
    };

    res.json({
      success: true,
      data: healthStatus
    });

  } catch (error) {
    logger.error('System health check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get system health status',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

/**
 * @route   GET /api/admin/system/logs
 * @desc    Get system logs
 * @access  Private (Admin only)
 */
router.get('/system/logs', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { level = 'all', limit = 100, page = 1 } = req.query;

    // This would typically read from your logging system
    // For now, we'll return a sample response
    const logs = [
      {
        timestamp: new Date(),
        level: 'info',
        message: 'System health check completed',
        source: 'admin'
      },
      {
        timestamp: new Date(Date.now() - 60000),
        level: 'warn',
        message: 'High memory usage detected',
        source: 'performance'
      }
    ];

    res.json({
      success: true,
      data: logs,
      pagination: {
        currentPage: parseInt(page),
        totalItems: logs.length,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    logger.error('Get system logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get system logs',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

/**
 * @route   POST /api/admin/system/maintenance
 * @desc    Perform system maintenance tasks
 * @access  Private (Admin only)
 */
router.post('/system/maintenance', [
  authenticate,
  authorize('admin'),
  body('task').isIn(['cleanup_expired_tokens', 'update_appointment_status', 'generate_reports'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { task } = req.body;
    let result = {};

    switch (task) {
      case 'cleanup_expired_tokens':
        // Clean up expired refresh tokens
        const tokensDeleted = await User.updateMany(
          {},
          { $pull: { refreshTokens: { expiresAt: { $lt: new Date() } } } }
        );
        result = { tokensDeleted: tokensDeleted.modifiedCount };
        break;

      case 'update_appointment_status':
        // Update overdue appointments
        const overdueUpdated = await Appointment.updateMany(
          {
            status: 'scheduled',
            appointmentDate: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
          },
          { status: 'no_show' }
        );
        result = { appointmentsUpdated: overdueUpdated.modifiedCount };
        break;

      case 'generate_reports':
        // Generate system reports
        result = { message: 'Report generation initiated' };
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid maintenance task',
          error: 'INVALID_TASK'
        });
    }

    logger.info(`Admin ${req.user.id} performed maintenance task: ${task}`, result);

    res.json({
      success: true,
      message: `Maintenance task '${task}' completed successfully`,
      data: result
    });

  } catch (error) {
    logger.error('System maintenance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to perform maintenance task',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

module.exports = router;
