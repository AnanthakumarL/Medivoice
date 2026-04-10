const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');

// Import middleware
const { globalErrorHandler } = require('./middleware/errorHandler');

// Import enhanced routes
const authRoutes = require('./routes/auth-enhanced');
const patientRoutes = require('./routes/patient');
const doctorRoutes = require('./routes/doctor');
const appointmentsRoutes = require('./routes/appointments-simple');

// Import models to ensure they're registered
require('./models/User-enhanced');
require('./models/Doctor-enhanced');
require('./models/Patient-enhanced');
require('./models/Laboratory-enhanced');
require('./models/Appointment-enhanced');

const createApp = () => {
  const app = express();

  // Trust proxy (important for rate limiting and IP detection)
  app.set('trust proxy', 1);

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false
  }));

  // CORS configuration (matching your frontend setup)
  const corsOptions = {
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      const allowedOrigins = [
        'http://localhost:3000',    // React development server
        'http://localhost:5173',    // Vite development server
        'http://localhost:8080',    // Your frontend server
        'http://localhost:8081',    // Alternate port for Vite/React
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:8080',
        'http://127.0.0.1:8081',
        'http://localhost:4173',    // Vite preview
        'https://your-frontend-domain.com' // Add your production domain
      ];
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin'
    ],
    exposedHeaders: ['X-Total-Count', 'X-Page-Count']
  };

  app.use(cors(corsOptions));

  // Compression
  app.use(compression());

  // Body parsing middleware
  app.use(express.json({ 
    limit: '10mb',
    verify: (req, res, buf) => {
      req.rawBody = buf;
    }
  }));
  app.use(express.urlencoded({ 
    extended: true, 
    limit: '10mb' 
  }));

  // Sanitize against NoSQL injection attacks
  app.use(mongoSanitize());

  // Rate limiting
  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // limit each IP to 1000 requests per windowMs
    message: {
      success: false,
      message: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // More strict rate limiting for auth routes
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // limit each IP to 50 auth requests per windowMs
    message: {
      success: false,
      message: 'Too many authentication requests, please try again later.'
    },
    skipSuccessfulRequests: true
  });

  app.use(globalLimiter);

  // Request logging
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`);
    next();
  });

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      success: true,
      message: 'Medi-Hub API is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    });
  });

  // Database status endpoint
  const { getConnectionStatus, healthCheck } = require('./config/database');
  app.get('/api/db/status', async (req, res) => {
    try {
      const status = getConnectionStatus();
      const health = await healthCheck();
      res.json({
        success: true,
        message: 'Database status retrieved',
        data: {
          connected: status.isConnected,
          readyState: status.readyState,
          collections: status.collections,
          models: status.models,
          health
        }
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch database status',
        error: err.message
      });
    }
  });

  // API routes with enhanced authentication
  app.use('/api/auth', authLimiter, authRoutes);
  app.use('/api/patient', patientRoutes);
  app.use('/api/doctors', doctorRoutes);
  app.use('/api/appointments', appointmentsRoutes);

  // Chatbot proxy (for local development / offline mode)
  try {
    const chatbotProxy = require('./routes/chatbot-proxy');
    app.use('/api/chatbot', chatbotProxy);
  } catch (err) {
    console.warn('Chatbot proxy route not loaded:', err.message || err);
  }

  // Test routes for development (matching your frontend structure)
  app.get('/api/test', (req, res) => {
    res.json({
      success: true,
      message: 'API test successful',
      data: {
        roles: ['patient', 'doctor', 'staff', 'laboratory', 'admin'],
        features: [
          'Role-based authentication',
          'Enhanced user profiles',
          'Appointment management',
          'Laboratory integration',
          'Admin dashboard',
          'Demo mode support'
        ]
      }
    });
  });

  // Demo data endpoints (matching your frontend demo system)
  app.get('/api/demo/doctors', (req, res) => {
    res.json({
      success: true,
      data: [
        {
          id: 'demo-doc-1',
          name: 'Dr. Sarah Johnson',
          specialty: 'Cardiology',
          hospital: 'City General Hospital',
          rating: 4.8,
          experience: 15,
          consultationFee: 200,
          avatar: '/placeholder.svg'
        },
        {
          id: 'demo-doc-2',
          name: 'Dr. Michael Chen',
          specialty: 'Neurology',
          hospital: 'Metro Medical Center',
          rating: 4.9,
          experience: 12,
          consultationFee: 250,
          avatar: '/placeholder.svg'
        }
      ]
    });
  });

  app.get('/api/demo/patients', (req, res) => {
    res.json({
      success: true,
      data: [
        {
          id: 'demo-patient-1',
          name: 'John Smith',
          age: 35,
          bloodType: 'O+',
          lastVisit: '2024-01-15',
          avatar: '/placeholder.svg'
        },
        {
          id: 'demo-patient-2',
          name: 'Emily Davis',
          age: 28,
          bloodType: 'A-',
          lastVisit: '2024-01-10',
          avatar: '/placeholder.svg'
        }
      ]
    });
  });

  app.get('/api/demo/laboratories', (req, res) => {
    res.json({
      success: true,
      data: [
        {
          id: 'demo-lab-1',
          name: 'Central Diagnostics',
          services: ['Blood Tests', 'Radiology', 'Pathology'],
          rating: 4.7,
          turnaroundTime: '24 hours',
          avatar: '/placeholder.svg'
        },
        {
          id: 'demo-lab-2',
          name: 'QuickTest Labs',
          services: ['Urgent Care', 'Molecular Diagnostics'],
          rating: 4.6,
          turnaroundTime: '2 hours',
          avatar: '/placeholder.svg'
        }
      ]
    });
  });

  // 404 handler for undefined routes
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      message: `Route ${req.originalUrl} not found`,
      availableRoutes: [
        'GET /health',
        'GET /api/test',
        'POST /api/auth/register',
        'POST /api/auth/login',
        'POST /api/auth/demo-login',
        'GET /api/auth/me',
        'PUT /api/auth/profile',
        'POST /api/auth/change-password',
        'POST /api/auth/logout',
        'GET /api/demo/doctors',
        'GET /api/demo/patients',
        'GET /api/demo/laboratories'
      ]
    });
  });

  // Error handling middleware (must be last)
  app.use(globalErrorHandler);

  return app;
};

module.exports = createApp;