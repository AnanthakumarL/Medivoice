const express = require('express');
const router = express.Router();

// Import models
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const MedicalRecord = require('../models/MedicalRecord');
const Prescription = require('../models/Prescription');

// Import middleware
const { authenticate, authorize } = require('../middleware/auth');
const logger = require('../config/logger');

/**
 * @route   GET /api/analytics/dashboard
 * @desc    Get dashboard analytics overview
 * @access  Private (Admin, Staff)
 */
router.get('/dashboard', authenticate, authorize('admin', 'staff'), async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    
    // Calculate date range based on period
    const now = new Date();
    let startDate = new Date();
    
    switch (period) {
      case '24h':
        startDate.setDate(now.getDate() - 1);
        break;
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    // User statistics
    const totalUsers = await User.countDocuments();
    const newUsers = await User.countDocuments({
      createdAt: { $gte: startDate }
    });
    const activeUsers = await User.countDocuments({
      isActive: true,
      lastLogin: { $gte: startDate }
    });

    // User breakdown by role
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
          active: { $sum: { $cond: ['$isActive', 1, 0] } }
        }
      }
    ]);

    // Appointment statistics
    const totalAppointments = await Appointment.countDocuments({
      appointmentDate: { $gte: startDate }
    });
    
    const appointmentsByStatus = await Appointment.aggregate([
      {
        $match: {
          appointmentDate: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Revenue statistics
    const revenueStats = await Appointment.aggregate([
      {
        $match: {
          status: 'completed',
          appointmentDate: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$billing.totalAmount' },
          averageRevenue: { $avg: '$billing.totalAmount' },
          completedAppointments: { $sum: 1 }
        }
      }
    ]);

    // Medical records statistics
    const medicalRecordsCount = await MedicalRecord.countDocuments({
      createdAt: { $gte: startDate }
    });

    // Prescription statistics
    const prescriptionStats = await Prescription.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Daily trends for the period
    const dailyTrends = await Appointment.aggregate([
      {
        $match: {
          appointmentDate: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$appointmentDate" }
          },
          appointments: { $sum: 1 },
          revenue: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'completed'] },
                '$billing.totalAmount',
                0
              ]
            }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const dashboard = {
      period,
      dateRange: {
        start: startDate,
        end: now
      },
      users: {
        total: totalUsers,
        new: newUsers,
        active: activeUsers,
        byRole: usersByRole
      },
      appointments: {
        total: totalAppointments,
        byStatus: appointmentsByStatus
      },
      revenue: revenueStats[0] || {
        totalRevenue: 0,
        averageRevenue: 0,
        completedAppointments: 0
      },
      medicalRecords: {
        count: medicalRecordsCount
      },
      prescriptions: {
        byStatus: prescriptionStats
      },
      trends: dailyTrends
    };

    res.json({
      success: true,
      data: dashboard
    });

  } catch (error) {
    logger.error('Get dashboard analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard analytics',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

/**
 * @route   GET /api/analytics/doctors/performance
 * @desc    Get doctor performance analytics
 * @access  Private (Admin, Staff)
 */
router.get('/doctors/performance', authenticate, authorize('admin', 'staff'), async (req, res) => {
  try {
    const { startDate, endDate, limit = 10 } = req.query;
    
    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter.appointmentDate = {};
      if (startDate) dateFilter.appointmentDate.$gte = new Date(startDate);
      if (endDate) dateFilter.appointmentDate.$lte = new Date(endDate);
    }

    // Doctor performance metrics
    const doctorPerformance = await Appointment.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$doctorId',
          totalAppointments: { $sum: 1 },
          completedAppointments: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          cancelledAppointments: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
          },
          noShowAppointments: {
            $sum: { $cond: [{ $eq: ['$status', 'no_show'] }, 1, 0] }
          },
          totalRevenue: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'completed'] },
                '$billing.totalAmount',
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'doctors',
          localField: '_id',
          foreignField: '_id',
          as: 'doctor'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'doctor.userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $addFields: {
          completionRate: {
            $multiply: [
              { $divide: ['$completedAppointments', '$totalAppointments'] },
              100
            ]
          },
          averageRevenue: {
            $cond: [
              { $gt: ['$completedAppointments', 0] },
              { $divide: ['$totalRevenue', '$completedAppointments'] },
              0
            ]
          }
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: parseInt(limit) }
    ]);

    // Get doctor ratings
    const doctorRatings = await Doctor.find({}, 'ratings reviews')
      .sort({ 'ratings.average': -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: {
        performance: doctorPerformance,
        topRated: doctorRatings
      }
    });

  } catch (error) {
    logger.error('Get doctor performance analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get doctor performance analytics',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

/**
 * @route   GET /api/analytics/patients/demographics
 * @desc    Get patient demographics analytics
 * @access  Private (Admin, Staff)
 */
router.get('/patients/demographics', authenticate, authorize('admin', 'staff'), async (req, res) => {
  try {
    // Age distribution
    const ageDistribution = await User.aggregate([
      {
        $match: {
          role: 'patient',
          dateOfBirth: { $exists: true, $ne: null }
        }
      },
      {
        $addFields: {
          age: {
            $floor: {
              $divide: [
                { $subtract: [new Date(), '$dateOfBirth'] },
                365.25 * 24 * 60 * 60 * 1000
              ]
            }
          }
        }
      },
      {
        $bucket: {
          groupBy: '$age',
          boundaries: [0, 18, 30, 40, 50, 60, 70, 80, 100],
          default: 'Unknown',
          output: {
            count: { $sum: 1 }
          }
        }
      }
    ]);

    // Gender distribution (if available)
    const genderDistribution = await Patient.aggregate([
      {
        $match: {
          'medicalInfo.gender': { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: '$medicalInfo.gender',
          count: { $sum: 1 }
        }
      }
    ]);

    // Blood type distribution
    const bloodTypeDistribution = await Patient.aggregate([
      {
        $match: {
          'medicalInfo.bloodType': { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: '$medicalInfo.bloodType',
          count: { $sum: 1 }
        }
      }
    ]);

    // Top chronic conditions
    const chronicConditions = await Patient.aggregate([
      {
        $match: {
          'medicalInfo.chronicConditions': { $exists: true, $ne: [] }
        }
      },
      { $unwind: '$medicalInfo.chronicConditions' },
      {
        $group: {
          _id: '$medicalInfo.chronicConditions',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Insurance status
    const insuranceStatus = await Patient.aggregate([
      {
        $group: {
          _id: {
            $cond: [
              { $ifNull: ['$insuranceInfo.provider', false] },
              'Insured',
              'Uninsured'
            ]
          },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        ageDistribution,
        genderDistribution,
        bloodTypeDistribution,
        chronicConditions,
        insuranceStatus
      }
    });

  } catch (error) {
    logger.error('Get patient demographics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get patient demographics',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

/**
 * @route   GET /api/analytics/appointments/trends
 * @desc    Get appointment trends analytics
 * @access  Private (Admin, Staff)
 */
router.get('/appointments/trends', authenticate, authorize('admin', 'staff'), async (req, res) => {
  try {
    const { period = 'month', months = 12 } = req.query;

    // Monthly appointment trends
    const monthlyTrends = await Appointment.aggregate([
      {
        $match: {
          appointmentDate: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - parseInt(months)))
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$appointmentDate' },
            month: { $month: '$appointmentDate' }
          },
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          cancelled: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
          },
          noShow: {
            $sum: { $cond: [{ $eq: ['$status', 'no_show'] }, 1, 0] }
          },
          revenue: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'completed'] },
                '$billing.totalAmount',
                0
              ]
            }
          }
        }
      },
      {
        $addFields: {
          completionRate: {
            $multiply: [
              { $divide: ['$completed', '$total'] },
              100
            ]
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Appointment distribution by day of week
    const dayOfWeekDistribution = await Appointment.aggregate([
      {
        $addFields: {
          dayOfWeek: { $dayOfWeek: '$appointmentDate' }
        }
      },
      {
        $group: {
          _id: '$dayOfWeek',
          count: { $sum: 1 }
        }
      },
      {
        $addFields: {
          dayName: {
            $switch: {
              branches: [
                { case: { $eq: ['$_id', 1] }, then: 'Sunday' },
                { case: { $eq: ['$_id', 2] }, then: 'Monday' },
                { case: { $eq: ['$_id', 3] }, then: 'Tuesday' },
                { case: { $eq: ['$_id', 4] }, then: 'Wednesday' },
                { case: { $eq: ['$_id', 5] }, then: 'Thursday' },
                { case: { $eq: ['$_id', 6] }, then: 'Friday' },
                { case: { $eq: ['$_id', 7] }, then: 'Saturday' }
              ],
              default: 'Unknown'
            }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Appointment distribution by hour
    const hourlyDistribution = await Appointment.aggregate([
      {
        $addFields: {
          hour: { $hour: '$appointmentDate' }
        }
      },
      {
        $group: {
          _id: '$hour',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Consultation type distribution
    const consultationTypeDistribution = await Appointment.aggregate([
      {
        $group: {
          _id: '$consultationType',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        monthlyTrends,
        dayOfWeekDistribution,
        hourlyDistribution,
        consultationTypeDistribution
      }
    });

  } catch (error) {
    logger.error('Get appointment trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get appointment trends',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

/**
 * @route   GET /api/analytics/medical-records/insights
 * @desc    Get medical records insights
 * @access  Private (Admin, Staff)
 */
router.get('/medical-records/insights', authenticate, authorize('admin', 'staff'), async (req, res) => {
  try {
    // Top diagnoses
    const topDiagnoses = await MedicalRecord.aggregate([
      {
        $match: {
          'diagnosis.primaryDiagnosis': { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: '$diagnosis.primaryDiagnosis',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 15 }
    ]);

    // Most prescribed medications
    const topMedications = await Prescription.aggregate([
      { $unwind: '$medications' },
      {
        $group: {
          _id: '$medications.name',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 15 }
    ]);

    // Common procedures
    const commonProcedures = await MedicalRecord.aggregate([
      {
        $match: {
          procedures: { $exists: true, $ne: [] }
        }
      },
      { $unwind: '$procedures' },
      {
        $group: {
          _id: '$procedures.name',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Average vital signs trends
    const vitalSignsTrends = await MedicalRecord.aggregate([
      {
        $match: {
          'vitalSigns.bloodPressure.systolic': { $exists: true },
          createdAt: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m", date: "$createdAt" }
          },
          avgSystolic: { $avg: '$vitalSigns.bloodPressure.systolic' },
          avgDiastolic: { $avg: '$vitalSigns.bloodPressure.diastolic' },
          avgHeartRate: { $avg: '$vitalSigns.heartRate' },
          avgTemperature: { $avg: '$vitalSigns.temperature' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: {
        topDiagnoses,
        topMedications,
        commonProcedures,
        vitalSignsTrends
      }
    });

  } catch (error) {
    logger.error('Get medical records insights error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get medical records insights',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

/**
 * @route   GET /api/analytics/financial/summary
 * @desc    Get financial analytics summary
 * @access  Private (Admin, Staff)
 */
router.get('/financial/summary', authenticate, authorize('admin', 'staff'), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter.appointmentDate = {};
      if (startDate) dateFilter.appointmentDate.$gte = new Date(startDate);
      if (endDate) dateFilter.appointmentDate.$lte = new Date(endDate);
    }

    // Revenue by period
    const revenueByMonth = await Appointment.aggregate([
      {
        $match: {
          status: 'completed',
          ...dateFilter
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$appointmentDate' },
            month: { $month: '$appointmentDate' }
          },
          revenue: { $sum: '$billing.totalAmount' },
          appointments: { $sum: 1 },
          averageRevenue: { $avg: '$billing.totalAmount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Revenue by consultation type
    const revenueByType = await Appointment.aggregate([
      {
        $match: {
          status: 'completed',
          ...dateFilter
        }
      },
      {
        $group: {
          _id: '$consultationType',
          revenue: { $sum: '$billing.totalAmount' },
          appointments: { $sum: 1 }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    // Top revenue generating doctors
    const topDoctorsByRevenue = await Appointment.aggregate([
      {
        $match: {
          status: 'completed',
          ...dateFilter
        }
      },
      {
        $group: {
          _id: '$doctorId',
          revenue: { $sum: '$billing.totalAmount' },
          appointments: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'doctors',
          localField: '_id',
          foreignField: '_id',
          as: 'doctor'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'doctor.userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 10 }
    ]);

    // Total revenue summary
    const totalRevenue = await Appointment.aggregate([
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
          totalAppointments: { $sum: 1 },
          averageRevenue: { $avg: '$billing.totalAmount' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        summary: totalRevenue[0] || {
          totalRevenue: 0,
          totalAppointments: 0,
          averageRevenue: 0
        },
        revenueByMonth,
        revenueByType,
        topDoctorsByRevenue
      }
    });

  } catch (error) {
    logger.error('Get financial analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get financial analytics',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

module.exports = router;
