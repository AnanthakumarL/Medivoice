const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Patient is required']
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: [true, 'Doctor is required']
  },
  appointmentType: {
    type: String,
    required: [true, 'Appointment type is required'],
    enum: ['consultation', 'follow-up', 'emergency', 'routine-checkup', 'procedure', 'lab-review', 'medication-review'],
    default: 'consultation'
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show', 'rescheduled'],
    default: 'scheduled'
  },
  scheduledTime: {
    type: Date,
    required: [true, 'Scheduled time is required'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Scheduled time must be in the future'
    }
  },
  actualStartTime: {
    type: Date,
    default: null
  },
  actualEndTime: {
    type: Date,
    default: null
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [15, 'Duration must be at least 15 minutes'],
    max: [180, 'Duration cannot exceed 3 hours'],
    default: 30
  },
  reasonForVisit: {
    type: String,
    required: [true, 'Reason for visit is required'],
    trim: true,
    maxlength: [500, 'Reason for visit cannot exceed 500 characters']
  },
  symptoms: [{
    symptom: {
      type: String,
      required: true,
      trim: true
    },
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe'],
      required: true
    },
    duration: String,
    notes: String
  }],
  vitals: {
    bloodPressure: {
      systolic: Number,
      diastolic: Number,
      measuredAt: Date
    },
    heartRate: {
      value: Number,
      measuredAt: Date
    },
    temperature: {
      value: Number,
      unit: {
        type: String,
        enum: ['celsius', 'fahrenheit'],
        default: 'celsius'
      },
      measuredAt: Date
    },
    respiratoryRate: {
      value: Number,
      measuredAt: Date
    },
    oxygenSaturation: {
      value: Number,
      measuredAt: Date
    },
    weight: {
      value: Number,
      unit: {
        type: String,
        default: 'kg'
      },
      measuredAt: Date
    },
    height: {
      value: Number,
      unit: {
        type: String,
        default: 'cm'
      },
      measuredAt: Date
    }
  },
  consultationNotes: {
    chiefComplaint: String,
    historyOfPresentIllness: String,
    physicalExamination: String,
    assessment: String,
    plan: String,
    doctorNotes: String
  },
  diagnosis: [{
    condition: {
      type: String,
      required: true,
      trim: true
    },
    icdCode: String,
    type: {
      type: String,
      enum: ['primary', 'secondary', 'differential'],
      default: 'primary'
    },
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe']
    },
    notes: String
  }],
  prescriptions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prescription'
  }],
  labOrders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LabTest'
  }],
  followUpInstructions: {
    instructions: String,
    followUpDate: Date,
    followUpType: {
      type: String,
      enum: ['in-person', 'telemedicine', 'phone', 'as-needed']
    }
  },
  patientNotes: {
    type: String,
    maxlength: [1000, 'Patient notes cannot exceed 1000 characters']
  },
  consultationFee: {
    type: Number,
    required: [true, 'Consultation fee is required'],
    min: [0, 'Consultation fee cannot be negative']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'partially-paid', 'insurance-pending', 'waived'],
    default: 'pending'
  },
  insuranceClaim: {
    claimNumber: String,
    status: {
      type: String,
      enum: ['submitted', 'approved', 'denied', 'pending']
    },
    amountCovered: Number,
    patientResponsibility: Number
  },
  cancellationReason: {
    type: String,
    trim: true
  },
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cancelledAt: {
    type: Date
  },
  isFollowUp: {
    type: Boolean,
    default: false
  },
  parentAppointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  roomNumber: {
    type: String,
    trim: true
  },
  remindersSent: {
    email: {
      sent: { type: Boolean, default: false },
      sentAt: Date
    },
    sms: {
      sent: { type: Boolean, default: false },
      sentAt: Date
    },
    push: {
      sent: { type: Boolean, default: false },
      sentAt: Date
    }
  },
  rating: {
    patientRating: {
      type: Number,
      min: 1,
      max: 5
    },
    patientFeedback: String,
    ratedAt: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for appointment duration in minutes
appointmentSchema.virtual('actualDuration').get(function() {
  if (this.actualStartTime && this.actualEndTime) {
    return Math.round((this.actualEndTime - this.actualStartTime) / (1000 * 60));
  }
  return null;
});

// Virtual for BMI calculation from vitals
appointmentSchema.virtual('bmi').get(function() {
  if (this.vitals.height?.value && this.vitals.weight?.value) {
    const heightInMeters = this.vitals.height.value / 100;
    return (this.vitals.weight.value / (heightInMeters * heightInMeters)).toFixed(1);
  }
  return null;
});

// Virtual for appointment date
appointmentSchema.virtual('appointmentDate').get(function() {
  return this.scheduledTime.toDateString();
});

// Virtual for appointment time
appointmentSchema.virtual('appointmentTime').get(function() {
  return this.scheduledTime.toTimeString().slice(0, 5);
});

// Indexes
appointmentSchema.index({ patient: 1 });
appointmentSchema.index({ doctor: 1 });
appointmentSchema.index({ scheduledTime: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ appointmentType: 1 });
appointmentSchema.index({ paymentStatus: 1 });
appointmentSchema.index({ createdAt: -1 });

// Compound indexes for common queries
appointmentSchema.index({ doctor: 1, scheduledTime: 1 });
appointmentSchema.index({ patient: 1, scheduledTime: -1 });
appointmentSchema.index({ doctor: 1, status: 1, scheduledTime: 1 });
appointmentSchema.index({ scheduledTime: 1, status: 1 });

// Static method to find appointments by doctor
appointmentSchema.statics.findByDoctor = function(doctorId, options = {}) {
  let query = this.find({ doctor: doctorId })
    .populate('patient', 'patientId user')
    .populate({
      path: 'patient',
      populate: {
        path: 'user',
        select: 'firstName lastName email phone dateOfBirth gender'
      }
    });

  if (options.status) {
    query = query.where({ status: options.status });
  }

  if (options.startDate && options.endDate) {
    query = query.where({
      scheduledTime: {
        $gte: new Date(options.startDate),
        $lte: new Date(options.endDate)
      }
    });
  }

  if (options.appointmentType) {
    query = query.where({ appointmentType: options.appointmentType });
  }

  if (options.sort) {
    query = query.sort(options.sort);
  } else {
    query = query.sort({ scheduledTime: 1 });
  }

  if (options.limit) query.limit(options.limit);
  if (options.skip) query.skip(options.skip);

  return query;
};

// Static method to find appointments by patient
appointmentSchema.statics.findByPatient = function(patientId, options = {}) {
  let query = this.find({ patient: patientId })
    .populate('doctor', 'user specialization department')
    .populate({
      path: 'doctor',
      populate: {
        path: 'user',
        select: 'firstName lastName email phone'
      }
    });

  if (options.status) {
    query = query.where({ status: options.status });
  }

  if (options.startDate && options.endDate) {
    query = query.where({
      scheduledTime: {
        $gte: new Date(options.startDate),
        $lte: new Date(options.endDate)
      }
    });
  }

  return query.sort({ scheduledTime: -1 });
};

// Static method to check for scheduling conflicts
appointmentSchema.statics.checkConflict = async function(doctorId, scheduledTime, duration, excludeId = null) {
  const startTime = new Date(scheduledTime);
  const endTime = new Date(startTime.getTime() + duration * 60000);

  const query = {
    doctor: doctorId,
    status: { $in: ['scheduled', 'confirmed', 'in-progress'] },
    $or: [
      {
        // Appointment starts during this slot
        scheduledTime: {
          $gte: startTime,
          $lt: endTime
        }
      },
      {
        // Appointment ends during this slot
        $expr: {
          $and: [
            { $lt: ['$scheduledTime', endTime] },
            { $gt: [{ $add: ['$scheduledTime', { $multiply: ['$duration', 60000] }] }, startTime] }
          ]
        }
      }
    ]
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const conflicts = await this.find(query);
  return conflicts.length > 0;
};

// Instance method to start appointment
appointmentSchema.methods.startAppointment = function() {
  this.status = 'in-progress';
  this.actualStartTime = new Date();
  return this.save();
};

// Instance method to complete appointment
appointmentSchema.methods.completeAppointment = function(consultationData = {}) {
  this.status = 'completed';
  this.actualEndTime = new Date();
  
  if (consultationData.consultationNotes) {
    this.consultationNotes = { ...this.consultationNotes, ...consultationData.consultationNotes };
  }
  
  if (consultationData.diagnosis) {
    this.diagnosis = consultationData.diagnosis;
  }
  
  if (consultationData.followUpInstructions) {
    this.followUpInstructions = consultationData.followUpInstructions;
  }
  
  return this.save();
};

// Instance method to cancel appointment
appointmentSchema.methods.cancelAppointment = function(reason, cancelledBy) {
  this.status = 'cancelled';
  this.cancellationReason = reason;
  this.cancelledBy = cancelledBy;
  this.cancelledAt = new Date();
  return this.save();
};

// Instance method to reschedule appointment
appointmentSchema.methods.rescheduleAppointment = function(newDateTime, newDuration = null) {
  this.status = 'rescheduled';
  this.scheduledTime = new Date(newDateTime);
  if (newDuration) {
    this.duration = newDuration;
  }
  return this.save();
};

// Pre-save middleware for validation
appointmentSchema.pre('save', async function(next) {
  // Check for scheduling conflicts only if scheduledTime or duration is modified
  if (this.isModified('scheduledTime') || this.isModified('duration')) {
    const hasConflict = await this.constructor.checkConflict(
      this.doctor,
      this.scheduledTime,
      this.duration,
      this._id
    );
    
    if (hasConflict) {
      const error = new Error('Scheduling conflict: Doctor is not available at this time');
      error.name = 'SchedulingConflictError';
      return next(error);
    }
  }
  
  next();
});

module.exports = mongoose.model('Appointment', appointmentSchema);