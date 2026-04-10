const express = require('express');
const jwt = require('jsonwebtoken');
const { auth } = require('../middleware/auth-patient');
const { authenticate } = require('../middleware/auth');
const router = express.Router();
const { getConnectionStatus, mongoose } = require('../config/database');

// @route   POST /api/auth/register
// @desc    Register a new patient (only patients can register)
// @access  Public
router.post('/register', async (req, res) => {
  try {
    // Ensure DB connection ready
    const status = getConnectionStatus();
    if (!status.isConnected || status.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database not connected. Please try again in a moment.'
      });
    }

    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      role
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Full name, email, and password are required'
      });
    }

    // Normalize and validate role (default to patient)
    const allowedRoles = ['patient', 'doctor', 'staff', 'laboratory', 'admin'];
    const normalizedRole = (role || 'patient').toLowerCase();
    if (!allowedRoles.includes(normalizedRole)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Allowed: patient, doctor, staff, laboratory, admin'
      });
    }

    // Determine which collection to use based on role
    let collectionName;
    switch (normalizedRole) {
      case 'patient':
        collectionName = 'patientsusers';
        break;
      case 'doctor':
        collectionName = 'medicalusers';
        break;
      case 'staff':
        collectionName = 'hospitalusers';
        break;
      case 'laboratory':
        collectionName = 'laboratoriesusers';
        break;
      case 'admin':
        collectionName = 'hospitalusers';
        break;
      default:
        collectionName = 'patientsusers';
    }

    const db = mongoose.connection.db;
    const collection = db.collection(collectionName);

    // Check if user already exists
    const existingUser = await collection.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create simple user document - NO HASHING
    const fullName = `${firstName} ${lastName}`;
    const userData = {
      fullName: fullName,
      phoneNumber: phone || '',
      email: email.toLowerCase(),
      password: password, // Store plain text password (as requested)
      createdAt: new Date()
    };

    // Insert user into appropriate collection
    const result = await collection.insertOne(userData);
    const insertedUser = await collection.findOne({ _id: result.insertedId });

    console.log(`User created in ${collectionName}:`, { email: insertedUser.email, fullName: insertedUser.fullName });

    // If doctor, create Doctor profile in doctors collection
    if (normalizedRole === 'doctor') {
      try {
        const Doctor = require('../models/Doctor-enhanced');
        const licenseNumber = `LIC-${Date.now()}`;
        await Doctor.create({
          userId: insertedUser._id,
          specialty: 'General Practice',
          hospital: 'To be updated',
          licenseNumber: licenseNumber,
          experience: 0,
          consultationFee: 500,
          rating: 0,
          reviewCount: 0,
          totalPatients: 0,
          availability: {
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: [],
            sunday: []
          },
          languages: ['English'],
          education: [],
          boardCertifications: []
        });
        console.log(`Doctor profile created for ${insertedUser.email} with license ${licenseNumber}`);
      } catch (docError) {
        console.error('Error creating doctor profile:', docError);
        // Continue anyway - user is created, profile can be created later
      }
    }

    // If patient, create Patient profile in patients collection
    if (normalizedRole === 'patient') {
      try {
        const Patient = require('../models/Patient-enhanced');
        const medicalRecordNumber = `MRN-${Date.now()}`;
        await Patient.create({
          userId: insertedUser._id,
          medicalRecordNumber,
          gender: 'not-specified',
          bloodType: 'Unknown',
          emergencyContact: {
            name: 'Not provided',
            relationship: 'Not provided',
            phone: 'Not provided'
          }
        });
        console.log(`Patient profile created for ${insertedUser.email} with MRN ${medicalRecordNumber}`);
      } catch (patError) {
        console.error('Error creating patient profile:', patError);
        // Continue anyway
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: insertedUser._id.toString(),
        email: insertedUser.email,
        fullName: insertedUser.fullName,
        role: normalizedRole
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          id: insertedUser._id.toString(),
          fullName: insertedUser.fullName,
          email: insertedUser.email,
          phoneNumber: insertedUser.phoneNumber,
          role: normalizedRole,
          firstName: firstName,
          lastName: lastName
        },
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    // Common DB connectivity issues → return 503 to be explicit
    if (
      error?.name === 'MongoServerSelectionError' ||
      /ECONNREFUSED|failed to connect|Topology/.test(error?.message || '')
    ) {
      return res.status(503).json({
        success: false,
        message: 'Database unavailable. Please start MongoDB locally and try again.'
      });
    }

    if (error.errors) {
      for (const key in error.errors) {
        console.error(`Validation error for ${key}:`, error.errors[key].message);
      }
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user (supports all roles)
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const status = getConnectionStatus();
    if (!status.isConnected || status.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database not connected. Please try again in a moment.'
      });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const db = mongoose.connection.db;
    
    // Search for user in all collections
    const collections = ['patientsusers', 'medicalusers', 'hospitalusers', 'laboratoriesusers'];
    let user = null;
    let userCollection = null;

    for (const collectionName of collections) {
      const collection = db.collection(collectionName);
      const foundUser = await collection.findOne({ email: email.toLowerCase() });
      if (foundUser) {
        user = foundUser;
        userCollection = collectionName;
        break;
      }
    }
    
    if (!user) {
      console.log('Login attempt failed: user not found for email', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    console.log('Login attempt: found user in', userCollection, { email: user.email });

    // Check password - PLAIN TEXT COMPARISON (no hashing)
    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Direct password comparison (plain text)
    if (password !== user.password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Determine role from collection name
    let role = 'patient';
    if (userCollection === 'medicalusers') role = 'doctor';
    else if (userCollection === 'hospitalusers') role = 'staff';
    else if (userCollection === 'laboratoriesusers') role = 'laboratory';
    else if (userCollection === 'patientsusers') role = 'patient';

    // Parse fullName to get firstName and lastName
    const nameParts = (user.fullName || '').split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id.toString(),
        email: user.email,
        fullName: user.fullName,
        role: role
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id.toString(),
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: role,
          firstName: firstName,
          lastName: lastName
        },
        token,
        dashboardRoute: role === 'doctor' ? '/doctor-dashboard' : '/dashboard'
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile (any role)
// @access  Private
router.get('/me', authenticate, async (req, res) => {
  try {
    // The authenticate middleware already sets req.user with user data
    const user = req.user;
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // If it's a patient, also get patient data
    let patientData = null;
    if (user.role === 'patient') {
      patientData = await Patient.findOne({ userId: user._id });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role
        },
        patient: patientData ? {
          id: patientData._id,
          patientId: patientData.patientId,
          medicalRecordNumber: patientData.medicalRecordNumber,
          bloodType: patientData.bloodType,
          gender: patientData.gender,
          status: patientData.status
        } : null
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile'
    });
  }
});

module.exports = router;