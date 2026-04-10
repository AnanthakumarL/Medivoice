const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  // Reference to User model
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required'],
    unique: true
  },
  
  // Professional Information (matching your DemoDoctor interface)
  specialty: {
    type: String,
    required: [true, 'Specialty is required'],
    trim: true,
    enum: {
      values: [
        'Cardiology', 'Dermatology', 'Endocrinology', 'Gastroenterology',
        'Hematology', 'Infectious Disease', 'Nephrology', 'Neurology',
        'Oncology', 'Orthopedics', 'Pediatrics', 'Psychiatry',
        'Pulmonology', 'Radiology', 'Surgery', 'Urology',
        'Family Medicine', 'Internal Medicine', 'Emergency Medicine',
        'Anesthesiology', 'Pathology', 'Obstetrics and Gynecology',
        'Ophthalmology', 'ENT', 'Plastic Surgery', 'General Practice'
      ],
      message: 'Please select a valid specialty'
    }
  },
  
  hospital: {
    type: String,
    required: [true, 'Hospital/Clinic name is required'],
    trim: true,
    maxlength: [100, 'Hospital name cannot exceed 100 characters']
  },
  
  // Medical Credentials
  licenseNumber: {
    type: String,
    required: [true, 'Medical license number is required'],
    unique: true,
    trim: true
  },
  
  boardCertifications: [{
    certification: {
      type: String,
      required: true
    },
    issuingBoard: String,
    dateIssued: Date,
    expirationDate: Date,
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  
  // Education
  education: [{
    degree: {
      type: String,
      required: true
    },
    institution: {
      type: String,
      required: true
    },
    graduationYear: {
      type: Number,
      required: true
    },
    fieldOfStudy: String
  }],
  
  // Experience (matching your frontend)
  experience: {
    type: Number,
    required: [true, 'Years of experience is required'],
    min: [0, 'Experience cannot be negative'],
    max: [60, 'Experience cannot exceed 60 years']
  },
  
  // Consultation Details
  consultationFee: {
    type: Number,
    required: [true, 'Consultation fee is required'],
    min: [0, 'Consultation fee cannot be negative']
  },
  
  consultationDuration: {
    type: Number,
    default: 30, // minutes
    min: [15, 'Consultation duration must be at least 15 minutes'],
    max: [180, 'Consultation duration cannot exceed 3 hours']
  },
  
  // Rating System (matching your frontend)
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalReviews: {
      type: Number,
      default: 0
    },
    breakdown: {
      five: { type: Number, default: 0 },
      four: { type: Number, default: 0 },
      three: { type: Number, default: 0 },
      two: { type: Number, default: 0 },
      one: { type: Number, default: 0 }
    }
  },
  
  // Professional Status
  isVerified: {
    type: Boolean,
    default: false
  },
  
  verificationDate: Date,
  
  verificationDocuments: [{
    type: {
      type: String,
      enum: ['license', 'certification', 'degree', 'insurance', 'other']
    },
    filename: String,
    uploadDate: {
      type: Date,
      default: Date.now
    },
    verified: {
      type: Boolean,
      default: false
    }
  }],
  
  // Availability and Schedule
  availability: {
    monday: {
      isAvailable: { type: Boolean, default: true },
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '17:00' },
      breakStart: { type: String, default: '12:00' },
      breakEnd: { type: String, default: '13:00' }
    },
    tuesday: {
      isAvailable: { type: Boolean, default: true },
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '17:00' },
      breakStart: { type: String, default: '12:00' },
      breakEnd: { type: String, default: '13:00' }
    },
    wednesday: {
      isAvailable: { type: Boolean, default: true },
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '17:00' },
      breakStart: { type: String, default: '12:00' },
      breakEnd: { type: String, default: '13:00' }
    },
    thursday: {
      isAvailable: { type: Boolean, default: true },
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '17:00' },
      breakStart: { type: String, default: '12:00' },
      breakEnd: { type: String, default: '13:00' }
    },
    friday: {
      isAvailable: { type: Boolean, default: true },
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '17:00' },
      breakStart: { type: String, default: '12:00' },
      breakEnd: { type: String, default: '13:00' }
    },
    saturday: {
      isAvailable: { type: Boolean, default: false },
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '13:00' }
    },
    sunday: {
      isAvailable: { type: Boolean, default: false },
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '13:00' }
    }
  },
  
  // Services Offered
  services: [{
    name: {
      type: String,
      required: true
    },
    description: String,
    duration: Number, // in minutes
    fee: Number
  }],
  
  // Insurance and Payment
  acceptedInsurance: [{
    provider: String,
    planTypes: [String]
  }],
  
  paymentMethods: [{
    type: String,
    enum: ['cash', 'credit-card', 'debit-card', 'insurance', 'check', 'online-payment']
  }],
  
  // Office Information
  officeAddress: {
    street: String,
    suite: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'USA' }
  },
  
  officePhone: {
    type: String,
    match: [/^\+?[\d\s\-\(\)]{10,}$/, 'Please enter a valid office phone number']
  },
  
  officeFax: String,
  
  officeEmail: {
    type: String,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid office email']
  },
  
  // Professional Associations
  memberships: [{
    organization: String,
    membershipId: String,
    startDate: Date,
    endDate: Date,
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  
  // Languages
  languages: [{
    language: {
      type: String,
      required: true
    },
    proficiency: {
      type: String,
      enum: ['basic', 'conversational', 'fluent', 'native'],
      default: 'fluent'
    }
  }],
  
  // Statistics (for admin dashboard)
  statistics: {
    totalPatients: {
      type: Number,
      default: 0
    },
    totalAppointments: {
      type: Number,
      default: 0
    },
    completedAppointments: {
      type: Number,
      default: 0
    },
    canceledAppointments: {
      type: Number,
      default: 0
    },
    totalRevenue: {
      type: Number,
      default: 0
    },
    averageSessionDuration: {
      type: Number,
      default: 0
    }
  },
  
  // Status
  isAcceptingNewPatients: {
    type: Boolean,
    default: true
  },
  
  isOnlineConsultationAvailable: {
    type: Boolean,
    default: false
  },
  
  lastActiveDate: {
    type: Date,
    default: Date.now
  }
  
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for user details
doctorSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

// Virtual for full name (through user reference)
doctorSchema.virtual('fullName').get(function() {
  return this.user ? this.user.fullName : 'Unknown Doctor';
});

// Virtual for formatted consultation fee
doctorSchema.virtual('formattedConsultationFee').get(function() {
  return `$${this.consultationFee}`;
});

// Virtual for next available slot (simplified)
doctorSchema.virtual('nextAvailableSlot').get(function() {
  // This would need more complex logic in a real implementation
  return new Date(Date.now() + 24 * 60 * 60 * 1000); // Tomorrow
});

// Indexes (removing redundant unique indexes)
doctorSchema.index({ specialty: 1 });
doctorSchema.index({ hospital: 1 });
doctorSchema.index({ isVerified: 1 });
doctorSchema.index({ isAcceptingNewPatients: 1 });
doctorSchema.index({ 'rating.average': -1 });
doctorSchema.index({ experience: -1 });
doctorSchema.index({ consultationFee: 1 });
doctorSchema.index({ lastActiveDate: -1 });

// Pre-save middleware to populate user if not populated
doctorSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'userId',
    select: 'firstName lastName email phone avatar bio preferences'
  });
  next();
});

// Instance method to update rating
doctorSchema.methods.updateRating = function(newRating) {
  if (newRating < 1 || newRating > 5) {
    throw new Error('Rating must be between 1 and 5');
  }
  
  // Update breakdown
  const ratingKey = ['one', 'two', 'three', 'four', 'five'][newRating - 1];
  this.rating.breakdown[ratingKey] += 1;
  this.rating.totalReviews += 1;
  
  // Recalculate average
  const totalPoints = 
    (this.rating.breakdown.one * 1) +
    (this.rating.breakdown.two * 2) +
    (this.rating.breakdown.three * 3) +
    (this.rating.breakdown.four * 4) +
    (this.rating.breakdown.five * 5);
  
  this.rating.average = totalPoints / this.rating.totalReviews;
  
  return this.save();
};

// Instance method to check availability for a specific date and time
doctorSchema.methods.isAvailableAt = function(dateTime) {
  const date = new Date(dateTime);
  const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][date.getDay()];
  const timeString = date.toTimeString().substring(0, 5); // HH:MM format
  
  const dayAvailability = this.availability[dayOfWeek];
  
  if (!dayAvailability.isAvailable) {
    return false;
  }
  
  // Check if time is within working hours
  if (timeString < dayAvailability.startTime || timeString > dayAvailability.endTime) {
    return false;
  }
  
  // Check if time is during break
  if (dayAvailability.breakStart && dayAvailability.breakEnd) {
    if (timeString >= dayAvailability.breakStart && timeString <= dayAvailability.breakEnd) {
      return false;
    }
  }
  
  return true;
};

// Static method to find doctors by specialty
doctorSchema.statics.findBySpecialty = function(specialty) {
  return this.find({ 
    specialty: new RegExp(specialty, 'i'),
    isVerified: true 
  }).populate('userId', 'firstName lastName email phone avatar');
};

// Static method to find available doctors
doctorSchema.statics.findAvailable = function() {
  return this.find({ 
    isAcceptingNewPatients: true,
    isVerified: true 
  }).populate('userId', 'firstName lastName email phone avatar');
};

// Static method to get top-rated doctors
doctorSchema.statics.findTopRated = function(limit = 10) {
  return this.find({ isVerified: true })
    .sort({ 'rating.average': -1, 'rating.totalReviews': -1 })
    .limit(limit)
    .populate('userId', 'firstName lastName email phone avatar');
};

module.exports = mongoose.model('Doctor', doctorSchema);