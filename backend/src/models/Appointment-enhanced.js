const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  // Appointment Identification
  appointmentNumber: {
    type: String,
    unique: true,
    required: [true, 'Appointment number is required']
  },
  
  // Participants
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Patient reference is required']
  },
  
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: [true, 'Doctor reference is required']
  },
  
  // Scheduling Information
  scheduledDate: {
    type: Date,
    required: [true, 'Scheduled date is required'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Scheduled date must be in the future'
    }
  },
  
  scheduledTime: {
    type: String,
    required: [true, 'Scheduled time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format']
  },
  
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [15, 'Duration must be at least 15 minutes'],
    max: [180, 'Duration cannot exceed 3 hours'],
    default: 30
  },
  
  // Appointment Details
  type: {
    type: String,
    required: [true, 'Appointment type is required'],
    enum: {
      values: [
        'consultation', 'follow-up', 'check-up', 'procedure', 'surgery',
        'diagnostic', 'therapy', 'vaccination', 'screening', 'emergency',
        'telemedicine', 'second-opinion', 'pre-operative', 'post-operative'
      ],
      message: 'Invalid appointment type'
    }
  },
  
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent', 'emergency'],
    default: 'normal'
  },
  
  reason: {
    type: String,
    required: [true, 'Reason for appointment is required'],
    maxlength: [500, 'Reason cannot exceed 500 characters']
  },
  
  symptoms: [String],
  
  // Status Management
  status: {
    type: String,
    enum: {
      values: [
        'scheduled', 'confirmed', 'checked-in', 'in-progress', 
        'completed', 'cancelled', 'no-show', 'rescheduled'
      ],
      message: 'Invalid appointment status'
    },
    default: 'scheduled'
  },
  
  statusHistory: [{
    status: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: String
  }],
  
  // Location and Mode
  location: {
    type: {
      type: String,
      enum: ['in-person', 'telemedicine', 'home-visit'],
      default: 'in-person'
    },
    address: {
      street: String,
      suite: String,
      city: String,
      state: String,
      zipCode: String
    },
    room: String,
    floor: String,
    meetingLink: String, // For telemedicine
    meetingId: String,
    accessCode: String
  },
  
  // Payment and Insurance
  payment: {
    method: {
      type: String,
      enum: ['insurance', 'cash', 'credit-card', 'debit-card', 'check', 'online'],
      default: 'insurance'
    },
    amount: {
      type: Number,
      min: 0
    },
    copayAmount: {
      type: Number,
      min: 0
    },
    insuranceClaim: {
      claimNumber: String,
      status: {
        type: String,
        enum: ['pending', 'approved', 'denied', 'processed']
      },
      approvalCode: String
    },
    isPaid: {
      type: Boolean,
      default: false
    },
    paymentDate: Date,
    transactionId: String
  },
  
  // Reminders and Notifications
  reminders: {
    patient: {
      sent24h: { type: Boolean, default: false },
      sent2h: { type: Boolean, default: false },
      sentAt24h: Date,
      sentAt2h: Date
    },
    doctor: {
      sent24h: { type: Boolean, default: false },
      sent1h: { type: Boolean, default: false },
      sentAt24h: Date,
      sentAt1h: Date
    }
  },
  
  // Check-in Information
  checkIn: {
    timestamp: Date,
    method: {
      type: String,
      enum: ['front-desk', 'kiosk', 'mobile-app', 'online']
    },
    checkedInBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    waitingTime: Number, // in minutes
    vitalSigns: {
      bloodPressure: {
        systolic: Number,
        diastolic: Number
      },
      heartRate: Number,
      temperature: Number,
      weight: Number,
      height: Number,
      oxygenSaturation: Number
    }
  },
  
  // Appointment Outcome
  outcome: {
    actualStartTime: Date,
    actualEndTime: Date,
    actualDuration: Number, // in minutes
    diagnosis: [String],
    treatmentPlan: String,
    prescriptions: [{
      medication: String,
      dosage: String,
      frequency: String,
      duration: String,
      instructions: String
    }],
    followUpRequired: {
      type: Boolean,
      default: false
    },
    followUpDate: Date,
    followUpInstructions: String,
    labTestsOrdered: [{
      testName: String,
      testCode: String,
      laboratory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Laboratory'
      },
      urgency: {
        type: String,
        enum: ['routine', 'urgent', 'stat'],
        default: 'routine'
      }
    }],
    referrals: [{
      specialist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
      },
      specialty: String,
      reason: String,
      priority: {
        type: String,
        enum: ['routine', 'urgent', 'emergency'],
        default: 'routine'
      }
    }],
    doctorNotes: {
      type: String,
      maxlength: [2000, 'Doctor notes cannot exceed 2000 characters']
    },
    patientInstructions: String
  },
  
  // Cancellation Information
  cancellation: {
    cancelledAt: Date,
    cancelledBy: {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      role: {
        type: String,
        enum: ['patient', 'doctor', 'staff', 'admin']
      }
    },
    reason: {
      type: String,
      enum: [
        'patient-request', 'doctor-unavailable', 'emergency', 'illness',
        'scheduling-conflict', 'weather', 'technical-issues', 'other'
      ]
    },
    notes: String,
    refundAmount: Number,
    refundStatus: {
      type: String,
      enum: ['not-applicable', 'pending', 'processed', 'denied']
    }
  },
  
  // Rescheduling Information
  rescheduling: {
    originalDate: Date,
    originalTime: String,
    rescheduledAt: Date,
    rescheduledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String,
    rescheduleCount: {
      type: Number,
      default: 0
    }
  },
  
  // Quality and Feedback
  feedback: {
    patientSatisfaction: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comments: String,
      submittedAt: Date
    },
    doctorFeedback: {
      patientCompliance: {
        type: String,
        enum: ['excellent', 'good', 'fair', 'poor']
      },
      appointmentNotes: String
    }
  },
  
  // Technical Information
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Flags and Alerts
  flags: [{
    type: {
      type: String,
      enum: ['high-priority', 'special-needs', 'infection-control', 'allergy-alert', 'vip']
    },
    description: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Integration Data
  externalIds: {
    emrId: String,
    hospitalSystemId: String,
    insuranceReferenceId: String
  }
  
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full appointment datetime
appointmentSchema.virtual('appointmentDateTime').get(function() {
  if (this.scheduledDate && this.scheduledTime) {
    const [hours, minutes] = this.scheduledTime.split(':');
    const dateTime = new Date(this.scheduledDate);
    dateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return dateTime;
  }
  return null;
});

// Virtual for time until appointment
appointmentSchema.virtual('timeUntilAppointment').get(function() {
  const appointmentTime = this.appointmentDateTime;
  if (!appointmentTime) return null;
  
  const now = new Date();
  const diffMs = appointmentTime.getTime() - now.getTime();
  
  if (diffMs < 0) return 'Past';
  
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays > 0) return `${diffDays} days`;
  if (diffHours > 0) return `${diffHours} hours`;
  
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  return `${diffMinutes} minutes`;
});

// Virtual for formatted date and time
appointmentSchema.virtual('formattedDateTime').get(function() {
  if (this.scheduledDate && this.scheduledTime) {
    const date = new Date(this.scheduledDate);
    const formattedDate = date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const [hours, minutes] = this.scheduledTime.split(':');
    const time = new Date();
    time.setHours(parseInt(hours), parseInt(minutes));
    const formattedTime = time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    
    return `${formattedDate} at ${formattedTime}`;
  }
  return 'Not scheduled';
});

// Virtual for actual duration
appointmentSchema.virtual('actualDurationMinutes').get(function() {
  if (this.outcome?.actualStartTime && this.outcome?.actualEndTime) {
    const diffMs = this.outcome.actualEndTime.getTime() - this.outcome.actualStartTime.getTime();
    return Math.floor(diffMs / (1000 * 60));
  }
  return null;
});

// Virtual for wait time
appointmentSchema.virtual('waitTimeMinutes').get(function() {
  if (this.outcome?.actualStartTime && this.appointmentDateTime) {
    const diffMs = this.outcome.actualStartTime.getTime() - this.appointmentDateTime.getTime();
    return Math.max(0, Math.floor(diffMs / (1000 * 60)));
  }
  return null;
});

// Indexes (removing redundant unique indexes)
appointmentSchema.index({ patient: 1, scheduledDate: 1 });
appointmentSchema.index({ doctor: 1, scheduledDate: 1 });
appointmentSchema.index({ scheduledDate: 1, scheduledTime: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ type: 1 });
appointmentSchema.index({ priority: 1 });
appointmentSchema.index({ createdAt: -1 });
appointmentSchema.index({ 'location.type': 1 });

// Compound indexes for common queries
appointmentSchema.index({ doctor: 1, status: 1, scheduledDate: 1 });
appointmentSchema.index({ patient: 1, status: 1, scheduledDate: 1 });
appointmentSchema.index({ scheduledDate: 1, status: 1 });

// Pre-save middleware to generate appointment number
appointmentSchema.pre('save', async function(next) {
  if (this.isNew && !this.appointmentNumber) {
    const today = new Date();
    const datePrefix = today.toISOString().slice(0, 10).replace(/-/g, '');
    const count = await this.constructor.countDocuments({
      createdAt: {
        $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
        $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
      }
    });
    this.appointmentNumber = `APT${datePrefix}${String(count + 1).padStart(3, '0')}`;
  }
  
  // Update status history
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      updatedBy: this.lastModifiedBy
    });
  }
  
  next();
});

// Pre-find middleware to populate references
appointmentSchema.pre(/^find/, function(next) {
  this.populate([
    {
      path: 'patient',
      populate: {
        path: 'userId',
        select: 'firstName lastName email phone dateOfBirth'
      }
    },
    {
      path: 'doctor',
      populate: {
        path: 'userId',
        select: 'firstName lastName email phone'
      }
    }
  ]);
  next();
});

// Instance method to check if appointment can be cancelled
appointmentSchema.methods.canBeCancelled = function() {
  const now = new Date();
  const appointmentTime = this.appointmentDateTime;
  
  if (!appointmentTime) return false;
  
  // Can't cancel if appointment is in the past
  if (appointmentTime <= now) return false;
  
  // Can't cancel if already cancelled, completed, or no-show
  if (['cancelled', 'completed', 'no-show'].includes(this.status)) return false;
  
  // Check if within cancellation window (e.g., 24 hours)
  const hoursUntilAppointment = (appointmentTime.getTime() - now.getTime()) / (1000 * 60 * 60);
  return hoursUntilAppointment >= 24;
};

// Instance method to check if appointment can be rescheduled
appointmentSchema.methods.canBeRescheduled = function() {
  const rescheduleLimit = 3;
  return this.canBeCancelled() && 
         (this.rescheduling?.rescheduleCount || 0) < rescheduleLimit;
};

// Instance method to mark as completed
appointmentSchema.methods.markCompleted = function(outcomeData, userId) {
  this.status = 'completed';
  this.lastModifiedBy = userId;
  
  if (outcomeData) {
    this.outcome = { ...this.outcome, ...outcomeData };
    
    if (!this.outcome.actualEndTime) {
      this.outcome.actualEndTime = new Date();
    }
    
    if (this.outcome.actualStartTime && this.outcome.actualEndTime) {
      const diffMs = this.outcome.actualEndTime.getTime() - this.outcome.actualStartTime.getTime();
      this.outcome.actualDuration = Math.floor(diffMs / (1000 * 60));
    }
  }
  
  return this.save();
};

// Instance method to cancel appointment
appointmentSchema.methods.cancel = function(cancellationData, userId) {
  if (!this.canBeCancelled()) {
    throw new Error('Appointment cannot be cancelled');
  }
  
  this.status = 'cancelled';
  this.lastModifiedBy = userId;
  this.cancellation = {
    ...cancellationData,
    cancelledAt: new Date(),
    cancelledBy: {
      user: userId,
      role: cancellationData.role
    }
  };
  
  return this.save();
};

// Instance method to reschedule appointment
appointmentSchema.methods.reschedule = function(newDate, newTime, reason, userId) {
  if (!this.canBeRescheduled()) {
    throw new Error('Appointment cannot be rescheduled');
  }
  
  // Store original scheduling info
  this.rescheduling = {
    originalDate: this.scheduledDate,
    originalTime: this.scheduledTime,
    rescheduledAt: new Date(),
    rescheduledBy: userId,
    reason: reason,
    rescheduleCount: (this.rescheduling?.rescheduleCount || 0) + 1
  };
  
  // Update to new schedule
  this.scheduledDate = newDate;
  this.scheduledTime = newTime;
  this.status = 'rescheduled';
  this.lastModifiedBy = userId;
  
  return this.save();
};

// Static method to find appointments by date range
appointmentSchema.statics.findByDateRange = function(startDate, endDate, filters = {}) {
  const query = {
    scheduledDate: {
      $gte: startDate,
      $lte: endDate
    },
    ...filters
  };
  
  return this.find(query).sort({ scheduledDate: 1, scheduledTime: 1 });
};

// Static method to find doctor's appointments
appointmentSchema.statics.findByDoctor = function(doctorId, date = null) {
  const query = { doctor: doctorId };
  
  if (date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    query.scheduledDate = {
      $gte: startOfDay,
      $lte: endOfDay
    };
  }
  
  return this.find(query).sort({ scheduledDate: 1, scheduledTime: 1 });
};

// Static method to find patient's appointments
appointmentSchema.statics.findByPatient = function(patientId) {
  return this.find({ patient: patientId })
    .sort({ scheduledDate: -1, scheduledTime: -1 });
};

// Static method to find upcoming appointments
appointmentSchema.statics.findUpcoming = function(filters = {}) {
  const now = new Date();
  const query = {
    scheduledDate: { $gte: now },
    status: { $nin: ['cancelled', 'completed', 'no-show'] },
    ...filters
  };
  
  return this.find(query).sort({ scheduledDate: 1, scheduledTime: 1 });
};

module.exports = mongoose.model('Appointment', appointmentSchema);