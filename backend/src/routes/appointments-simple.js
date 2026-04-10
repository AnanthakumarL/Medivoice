const express = require('express');
const router = express.Router();
const { getConnectionStatus, mongoose } = require('../config/database');

// @route   POST /api/appointments/book
// @desc    Create a new appointment
// @access  Public (for now)
router.post('/book', async (req, res) => {
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
      patientName,
      patientEmail,
      patientPhone,
      doctorId,
      doctorName,
      doctorSpecialty,
      hospital,
      appointmentDate,
      appointmentTime,
      appointmentType,
      reasonForVisit,
      symptoms,
      additionalNotes,
      consultationFee,
      platformFee,
      totalAmount
    } = req.body;

    // Validate required fields
    if (!patientName || !patientEmail || !patientPhone || !doctorName || !appointmentDate || !appointmentTime) {
      console.log('Missing required fields:', {
        patientName: !!patientName,
        patientEmail: !!patientEmail,
        patientPhone: !!patientPhone,
        doctorName: !!doctorName,
        appointmentDate: !!appointmentDate,
        appointmentTime: !!appointmentTime
      });
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const db = mongoose.connection.db;
    
    if (!db) {
      console.error('Database connection not available');
      return res.status(503).json({
        success: false,
        message: 'Database connection not available'
      });
    }
    
    const appointmentsCollection = db.collection('appointments');

    // Generate unique appointment number
    const appointmentCount = await appointmentsCollection.countDocuments();
    const appointmentNumber = `APT-${new Date().getFullYear()}-${String(appointmentCount + 1).padStart(6, '0')}`;

    // Parse and validate date
    let parsedDate;
    try {
      parsedDate = new Date(appointmentDate);
      if (isNaN(parsedDate.getTime())) {
        throw new Error('Invalid date format');
      }
    } catch (dateError) {
      console.error('Date parsing error:', dateError);
      return res.status(400).json({
        success: false,
        message: 'Invalid appointment date format'
      });
    }

    // Create appointment document
    const appointmentData = {
      appointmentNumber,
      patientName,
      patientEmail: patientEmail.toLowerCase(),
      patientPhone,
      doctorId: doctorId || null,
      doctorName,
      doctorSpecialty: doctorSpecialty || '',
      hospital: hospital || '',
      appointmentDate: parsedDate,
      appointmentTime,
      appointmentType: appointmentType || 'consultation',
      reasonForVisit: reasonForVisit || '',
      symptoms: symptoms || '',
      additionalNotes: additionalNotes || '',
      consultationFee: consultationFee || 0,
      platformFee: platformFee || 50,
      totalAmount: totalAmount || (consultationFee + 50),
      status: 'scheduled', // scheduled, confirmed, completed, cancelled
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('Attempting to insert appointment:', appointmentData);

    // Insert appointment
    const result = await appointmentsCollection.insertOne(appointmentData);
    const insertedAppointment = await appointmentsCollection.findOne({ _id: result.insertedId });

    console.log('Appointment created:', {
      id: insertedAppointment._id,
      appointmentNumber: insertedAppointment.appointmentNumber,
      patient: insertedAppointment.patientName,
      doctor: insertedAppointment.doctorName,
      date: insertedAppointment.appointmentDate,
      time: insertedAppointment.appointmentTime
    });

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: {
        appointment: {
          id: insertedAppointment._id.toString(),
          appointmentNumber: insertedAppointment.appointmentNumber,
          patientName: insertedAppointment.patientName,
          patientEmail: insertedAppointment.patientEmail,
          patientPhone: insertedAppointment.patientPhone,
          doctorName: insertedAppointment.doctorName,
          doctorSpecialty: insertedAppointment.doctorSpecialty,
          hospital: insertedAppointment.hospital,
          appointmentDate: insertedAppointment.appointmentDate,
          appointmentTime: insertedAppointment.appointmentTime,
          appointmentType: insertedAppointment.appointmentType,
          reasonForVisit: insertedAppointment.reasonForVisit,
          totalAmount: insertedAppointment.totalAmount,
          status: insertedAppointment.status
        }
      }
    });

  } catch (error) {
    console.error('Appointment creation error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error message:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error during appointment booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/appointments/patient/:email
// @desc    Get all appointments for a patient by email
// @access  Public (for now)
router.get('/patient/:email', async (req, res) => {
  try {
    const status = getConnectionStatus();
    if (!status.isConnected || status.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database not connected. Please try again in a moment.'
      });
    }

    const { email } = req.params;
    
    const db = mongoose.connection.db;
    const appointmentsCollection = db.collection('appointments');

    // Find all appointments for this patient
    const appointments = await appointmentsCollection
      .find({ patientEmail: email.toLowerCase() })
      .sort({ appointmentDate: -1, createdAt: -1 })
      .toArray();

    console.log(`Found ${appointments.length} appointments for ${email}`);

    res.json({
      success: true,
      data: {
        appointments: appointments.map(apt => ({
          id: apt._id.toString(),
          patientName: apt.patientName,
          patientEmail: apt.patientEmail,
          patientPhone: apt.patientPhone,
          doctorName: apt.doctorName,
          doctorSpecialty: apt.doctorSpecialty,
          hospital: apt.hospital,
          appointmentDate: apt.appointmentDate,
          appointmentTime: apt.appointmentTime,
          appointmentType: apt.appointmentType,
          reasonForVisit: apt.reasonForVisit,
          symptoms: apt.symptoms,
          additionalNotes: apt.additionalNotes,
          consultationFee: apt.consultationFee,
          platformFee: apt.platformFee,
          totalAmount: apt.totalAmount,
          status: apt.status,
          createdAt: apt.createdAt
        }))
      }
    });

  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching appointments'
    });
  }
});

module.exports = router;
