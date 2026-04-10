const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Import models
const User = require('../models/User-enhanced');

// Basic register route
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create user
    const user = new User({
      email: email.toLowerCase(),
      password,
      firstName,
      lastName,
      role: role || 'patient'
    });

    await user.save();

    // If patient, create Patient profile
    if ((role || 'patient') === 'patient') {
      const Patient = require('../models/Patient-enhanced');
      const medicalRecordNumber = `MRN-${Date.now()}`;
      await Patient.create({
        userId: user._id,
        medicalRecordNumber,
        gender: 'not-specified',
        bloodType: 'Unknown',
        emergencyContact: {
          name: 'Not provided',
          relationship: 'Not provided',
          phone: 'Not provided'
        }
      });
    }

    // If doctor, create Doctor profile
    if (role === 'doctor') {
      const Doctor = require('../models/Doctor-enhanced');
      const licenseNumber = `LIC-${Date.now()}`;
      await Doctor.create({
        userId: user._id,
        specialty: 'General Practice', // Default specialty
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
    }

    // Generate token
    const token = user.generateAuthToken();

    // Reload user to get all fields
    const savedUser = await User.findById(user._id);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: savedUser._id,
          email: savedUser.email,
          firstName: savedUser.firstName,
          lastName: savedUser.lastName,
          role: savedUser.role
        },
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Basic login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = user.generateAuthToken();

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
