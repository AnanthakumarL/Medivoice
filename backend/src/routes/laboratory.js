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

const router = express.Router();

// Apply auth and lab_tech authorization to all routes
router.use(auth);
router.use(authorize('lab_tech'));

/**
 * @route   GET /api/laboratory/dashboard
 * @desc    Get lab dashboard
 * @access  Private (Lab Tech only)
 */
router.get('/dashboard',
  catchAsync(async (req, res) => {
    // Get today's statistics
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // For demo purposes, we'll create mock lab data
    // In a real application, you would have lab-specific models
    const stats = {
      todayTests: Math.floor(Math.random() * 50) + 10,
      pendingTests: Math.floor(Math.random() * 25) + 5,
      completedTests: Math.floor(Math.random() * 100) + 50,
      totalOrders: Math.floor(Math.random() * 200) + 100
    };

    // Mock recent tests
    const recentTests = [
      {
        _id: '1',
        testType: 'Blood Sugar',
        patient: { patientId: 'PAT000001', user: { firstName: 'John', lastName: 'Doe' } },
        status: 'pending',
        orderedAt: new Date(),
        priority: 'normal'
      },
      {
        _id: '2',
        testType: 'Cholesterol',
        patient: { patientId: 'PAT000002', user: { firstName: 'Jane', lastName: 'Smith' } },
        status: 'in-progress',
        orderedAt: new Date(Date.now() - 60000),
        priority: 'urgent'
      }
    ];

    // Mock pending orders
    const pendingOrders = [
      {
        _id: '1',
        orderNumber: 'ORD001',
        patient: { patientId: 'PAT000003', user: { firstName: 'Bob', lastName: 'Johnson' } },
        tests: ['CBC', 'Liver Function'],
        orderedBy: { user: { firstName: 'Dr. Alice', lastName: 'Wilson' } },
        orderedAt: new Date(),
        priority: 'normal'
      }
    ];

    sendResponse(res, 200, {
      stats,
      recentTests,
      pendingOrders
    }, 'Lab dashboard data retrieved successfully');
  })
);

/**
 * @route   GET /api/laboratory/tests
 * @desc    Get lab tests
 * @access  Private (Lab Tech only)
 */
router.get('/tests',
  catchAsync(async (req, res) => {
    const { status, patient, testType, page = 1, limit = 20 } = req.query;

    // Mock tests data - in a real app, this would be from a LabTest model
    const mockTests = [];
    for (let i = 1; i <= 50; i++) {
      mockTests.push({
        _id: `test_${i}`,
        testType: ['Blood Sugar', 'Cholesterol', 'CBC', 'Liver Function', 'Kidney Function'][Math.floor(Math.random() * 5)],
        patient: {
          patientId: `PAT${String(i).padStart(6, '0')}`,
          user: {
            firstName: `Patient${i}`,
            lastName: 'Test'
          }
        },
        status: ['pending', 'in-progress', 'completed', 'cancelled'][Math.floor(Math.random() * 4)],
        orderedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        completedAt: Math.random() > 0.5 ? new Date() : null,
        results: Math.random() > 0.5 ? 'Normal ranges' : null,
        priority: ['normal', 'urgent', 'stat'][Math.floor(Math.random() * 3)]
      });
    }

    let filteredTests = mockTests;

    if (status) {
      filteredTests = filteredTests.filter(test => test.status === status);
    }

    if (testType) {
      filteredTests = filteredTests.filter(test => 
        test.testType.toLowerCase().includes(testType.toLowerCase())
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedTests = filteredTests.slice(startIndex, endIndex);

    sendResponse(res, 200, {
      tests: paginatedTests,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredTests.length,
        pages: Math.ceil(filteredTests.length / limit)
      }
    }, 'Lab tests retrieved successfully');
  })
);

/**
 * @route   POST /api/laboratory/tests
 * @desc    Create test
 * @access  Private (Lab Tech only)
 */
router.post('/tests',
  catchAsync(async (req, res) => {
    const { patientId, testType, orderedBy, priority, notes } = req.body;

    // Validate patient exists
    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      throw new AppError('Patient not found', 404);
    }

    // Mock test creation
    const newTest = {
      _id: `test_${Date.now()}`,
      testType,
      patient: {
        patientId: patient.patientId,
        user: patient.user
      },
      orderedBy,
      status: 'pending',
      priority: priority || 'normal',
      notes,
      orderedAt: new Date(),
      createdBy: req.user._id
    };

    sendResponse(res, 201, newTest, 'Test created successfully');
  })
);

/**
 * @route   PUT /api/laboratory/tests/:id
 * @desc    Update test results
 * @access  Private (Lab Tech only)
 */
router.put('/tests/:id',
  catchAsync(async (req, res) => {
    const { status, results, notes } = req.body;

    // Mock test update
    const updatedTest = {
      _id: req.params.id,
      status,
      results,
      notes,
      completedAt: status === 'completed' ? new Date() : null,
      updatedBy: req.user._id,
      updatedAt: new Date()
    };

    sendResponse(res, 200, updatedTest, 'Test updated successfully');
  })
);

/**
 * @route   GET /api/laboratory/orders
 * @desc    Get test orders
 * @access  Private (Lab Tech only)
 */
router.get('/orders',
  catchAsync(async (req, res) => {
    const { status, doctor, patient, page = 1, limit = 20 } = req.query;

    // Mock orders data
    const mockOrders = [];
    for (let i = 1; i <= 30; i++) {
      mockOrders.push({
        _id: `order_${i}`,
        orderNumber: `ORD${String(i).padStart(6, '0')}`,
        patient: {
          patientId: `PAT${String(i).padStart(6, '0')}`,
          user: {
            firstName: `Patient${i}`,
            lastName: 'Test'
          }
        },
        doctor: {
          user: {
            firstName: `Dr. ${i % 2 === 0 ? 'John' : 'Jane'}`,
            lastName: 'Smith'
          },
          specialization: 'Internal Medicine'
        },
        tests: ['Blood Sugar', 'Cholesterol', 'CBC'].slice(0, Math.ceil(Math.random() * 3)),
        status: ['pending', 'in-progress', 'completed', 'cancelled'][Math.floor(Math.random() * 4)],
        priority: ['normal', 'urgent', 'stat'][Math.floor(Math.random() * 3)],
        orderedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        notes: i % 3 === 0 ? 'Fasting required' : ''
      });
    }

    let filteredOrders = mockOrders;

    if (status) {
      filteredOrders = filteredOrders.filter(order => order.status === status);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    sendResponse(res, 200, {
      orders: paginatedOrders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredOrders.length,
        pages: Math.ceil(filteredOrders.length / limit)
      }
    }, 'Test orders retrieved successfully');
  })
);

/**
 * @route   POST /api/laboratory/orders/:id/process
 * @desc    Process order
 * @access  Private (Lab Tech only)
 */
router.post('/orders/:id/process',
  catchAsync(async (req, res) => {
    const { notes } = req.body;

    // Mock order processing
    const processedOrder = {
      _id: req.params.id,
      status: 'in-progress',
      processedAt: new Date(),
      processedBy: req.user._id,
      notes
    };

    sendResponse(res, 200, processedOrder, 'Order processed successfully');
  })
);

/**
 * @route   GET /api/laboratory/results
 * @desc    Get test results
 * @access  Private (Lab Tech only)
 */
router.get('/results',
  catchAsync(async (req, res) => {
    const { patient, testType, dateFrom, dateTo, page = 1, limit = 20 } = req.query;

    // Mock results data
    const mockResults = [];
    for (let i = 1; i <= 40; i++) {
      mockResults.push({
        _id: `result_${i}`,
        testType: ['Blood Sugar', 'Cholesterol', 'CBC', 'Liver Function'][Math.floor(Math.random() * 4)],
        patient: {
          patientId: `PAT${String(i).padStart(6, '0')}`,
          user: {
            firstName: `Patient${i}`,
            lastName: 'Test'
          }
        },
        results: {
          value: Math.floor(Math.random() * 200) + 50,
          unit: 'mg/dL',
          referenceRange: '70-140 mg/dL',
          status: ['normal', 'high', 'low'][Math.floor(Math.random() * 3)]
        },
        completedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        technician: req.user._id,
        isAbnormal: Math.random() > 0.7
      });
    }

    let filteredResults = mockResults;

    if (testType) {
      filteredResults = filteredResults.filter(result => 
        result.testType.toLowerCase().includes(testType.toLowerCase())
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedResults = filteredResults.slice(startIndex, endIndex);

    sendResponse(res, 200, {
      results: paginatedResults,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredResults.length,
        pages: Math.ceil(filteredResults.length / limit)
      }
    }, 'Test results retrieved successfully');
  })
);

/**
 * @route   POST /api/laboratory/results
 * @desc    Upload results
 * @access  Private (Lab Tech only)
 */
router.post('/results',
  catchAsync(async (req, res) => {
    const { testId, results, notes, isAbnormal } = req.body;

    // Mock result upload
    const newResult = {
      _id: `result_${Date.now()}`,
      testId,
      results,
      notes,
      isAbnormal,
      uploadedAt: new Date(),
      technician: req.user._id,
      status: 'completed'
    };

    sendResponse(res, 201, newResult, 'Results uploaded successfully');
  })
);

/**
 * @route   GET /api/laboratory/patients
 * @desc    Get patient lab history
 * @access  Private (Lab Tech only)
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
        .populate('user', 'firstName lastName email phone dateOfBirth')
        .sort({ createdAt: -1 }),
      page,
      limit
    );

    const patients = await paginatedQuery;
    const total = await Patient.countDocuments(query);

    // Add mock lab history for each patient
    const patientsWithLabHistory = patients.map(patient => ({
      ...patient.toObject(),
      labHistory: {
        totalTests: Math.floor(Math.random() * 20) + 1,
        lastTestDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
        recentTests: ['Blood Sugar', 'Cholesterol'].slice(0, Math.ceil(Math.random() * 2))
      }
    }));

    sendResponse(res, 200, {
      patients: patientsWithLabHistory,
      pagination: {
        ...pagination,
        total,
        pages: Math.ceil(total / pagination.limit)
      }
    }, 'Patients retrieved successfully');
  })
);

/**
 * @route   GET /api/laboratory/reports
 * @desc    Get lab reports
 * @access  Private (Lab Tech only)
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
      case 'productivity':
        // Mock productivity report
        report = {
          type: 'productivity',
          period: { startDate: start, endDate: end },
          summary: {
            totalTests: Math.floor(Math.random() * 500) + 100,
            completedTests: Math.floor(Math.random() * 400) + 80,
            pendingTests: Math.floor(Math.random() * 50) + 10,
            averageProcessingTime: Math.floor(Math.random() * 60) + 30 // minutes
          },
          dailyStats: Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            tests: Math.floor(Math.random() * 50) + 10
          }))
        };
        break;

      case 'quality':
        // Mock quality report
        report = {
          type: 'quality',
          period: { startDate: start, endDate: end },
          summary: {
            totalTests: Math.floor(Math.random() * 500) + 100,
            abnormalResults: Math.floor(Math.random() * 50) + 10,
            retests: Math.floor(Math.random() * 20) + 5,
            qualityScore: (Math.random() * 20 + 80).toFixed(1) // 80-100%
          }
        };
        break;

      case 'workload':
        // Mock workload report
        report = {
          type: 'workload',
          period: { startDate: start, endDate: end },
          summary: {
            totalOrders: Math.floor(Math.random() * 200) + 50,
            peakHours: ['09:00-11:00', '14:00-16:00'],
            averageOrdersPerDay: Math.floor(Math.random() * 30) + 10
          }
        };
        break;

      default:
        throw new AppError('Invalid report type', 400);
    }

    sendResponse(res, 200, report, 'Lab report generated successfully');
  })
);

module.exports = router;