const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  licenseNumber: {
    type: String,
    required: [true, 'License number is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  specialization: {
    type: String,
    required: [true, 'Specialization is required'],
    trim: true
  },
  subSpecialties: [{
    type: String,
    trim: true
  }],
  qualifications: [{
    degree: {
      type: String,
      required: true
    },
    institution: {
      type: String,
      required: true
    },
    year: {
      type: Number,
      required: true
    },
    country: String
  }],
  yearsOfExperience: {
    type: Number,
    required: [true, 'Years of experience is required'],
    min: [0, 'Years of experience cannot be negative']
  },
  bio: {
    type: String,
    maxlength: [1000, 'Bio cannot exceed 1000 characters']
  },
  languages: [{
    type: String,
    trim: true
  }],
  consultationFee: {
    type: Number,
    required: [true, 'Consultation fee is required'],
    min: [0, 'Consultation fee cannot be negative']
  },
  consultationDuration: {
    type: Number,
    default: 30,
    min: [15, 'Consultation duration must be at least 15 minutes'],
    max: [180, 'Consultation duration cannot exceed 3 hours']
  },
  workingHours: {
    monday: {
      isWorking: { type: Boolean, default: false },
      startTime: String,
      endTime: String,
      breakStart: String,
      breakEnd: String
    },
    tuesday: {
      isWorking: { type: Boolean, default: false },
      startTime: String,
      endTime: String,
      breakStart: String,
      breakEnd: String
    },
    wednesday: {
      isWorking: { type: Boolean, default: false },
      startTime: String,
      endTime: String,
      breakStart: String,
      breakEnd: String
    },
    thursday: {
      isWorking: { type: Boolean, default: false },
      startTime: String,
      endTime: String,
      breakStart: String,
      breakEnd: String
    },
    friday: {
      isWorking: { type: Boolean, default: false },
      startTime: String,
      endTime: String,
      breakStart: String,
      breakEnd: String
    },
    saturday: {
      isWorking: { type: Boolean, default: false },
      startTime: String,
      endTime: String,
      breakStart: String,
      breakEnd: String
    },
    sunday: {
      isWorking: { type: Boolean, default: false },
      startTime: String,
      endTime: String,
      breakStart: String,
      breakEnd: String
    }
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  acceptsNewPatients: {
    type: Boolean,
    default: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  roomNumber: {
    type: String,
    trim: true
  },
  hospitalAffiliations: [{
    hospitalName: String,
    position: String,
    startDate: Date,
    endDate: Date,
    isCurrent: { type: Boolean, default: false }
  }],
  awards: [{
    title: String,
    organization: String,
    year: Number,
    description: String
  }],
  publications: [{
    title: String,
    journal: String,
    year: Number,
    doi: String,
    url: String
  }],
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
    }
  },
  totalPatients: {
    type: Number,
    default: 0
  },
  totalAppointments: {
    type: Number,
    default: 0
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  verifiedAt: Date,
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String,
    email: String
  },
  unavailableDates: [{
    date: {
      type: Date,
      required: true
    },
    reason: String,
    isFullDay: {
      type: Boolean,
      default: true
    },
    startTime: String,
    endTime: String
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for patient count
doctorSchema.virtual('patientCount', {
  ref: 'Patient',
  localField: '_id',
  foreignField: 'primaryDoctor',
  count: true
});

// Virtual for upcoming appointments count
doctorSchema.virtual('upcomingAppointments', {
  ref: 'Appointment',
  localField: '_id',
  foreignField: 'doctor',
  count: true,
  match: { 
    scheduledTime: { $gte: new Date() },
    status: { $in: ['scheduled', 'confirmed'] }
  }
});

// Indexes
doctorSchema.index({ user: 1 });
doctorSchema.index({ licenseNumber: 1 });
doctorSchema.index({ specialization: 1 });
doctorSchema.index({ department: 1 });
doctorSchema.index({ isAvailable: 1 });
doctorSchema.index({ acceptsNewPatients: 1 });
doctorSchema.index({ verificationStatus: 1 });
doctorSchema.index({ 'rating.average': -1 });
doctorSchema.index({ createdAt: -1 });

// Compound indexes for common queries
doctorSchema.index({ specialization: 1, isAvailable: 1, acceptsNewPatients: 1 });
doctorSchema.index({ department: 1, isAvailable: 1 });

// Static method to find available doctors
doctorSchema.statics.findAvailable = function(filters = {}) {
  const query = { isAvailable: true, verificationStatus: 'verified' };
  
  if (filters.specialization) {
    query.specialization = new RegExp(filters.specialization, 'i');
  }
  
  if (filters.department) {
    query.department = new RegExp(filters.department, 'i');
  }
  
  if (filters.acceptsNewPatients !== undefined) {
    query.acceptsNewPatients = filters.acceptsNewPatients;
  }
  
  return this.find(query).populate('user', 'firstName lastName email phone profileImageUrl');
};

// Static method to search doctors
doctorSchema.statics.searchDoctors = function(searchTerm, filters = {}) {
  const pipeline = [
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'userInfo'
      }
    },
    {
      $unwind: '$userInfo'
    },
    {
      $match: {
        $and: [
          { verificationStatus: 'verified' },
          { isAvailable: true },
          {
            $or: [
              { 'userInfo.firstName': new RegExp(searchTerm, 'i') },
              { 'userInfo.lastName': new RegExp(searchTerm, 'i') },
              { specialization: new RegExp(searchTerm, 'i') },
              { department: new RegExp(searchTerm, 'i') },
              { licenseNumber: new RegExp(searchTerm, 'i') }
            ]
          }
        ]
      }
    }
  ];
  
  // Add additional filters
  if (filters.specialization) {
    pipeline[2].$match.$and.push({ specialization: new RegExp(filters.specialization, 'i') });
  }
  
  if (filters.department) {
    pipeline[2].$match.$and.push({ department: new RegExp(filters.department, 'i') });
  }
  
  return this.aggregate(pipeline);
};

// Instance method to check availability for a specific date and time
doctorSchema.methods.isAvailableAt = function(date, time) {
  const dayOfWeek = date.toLocaleLowerCase();
  const workingDay = this.workingHours[dayOfWeek];
  
  if (!workingDay.isWorking) {
    return false;
  }
  
  // Check if the date is in unavailable dates
  const unavailableDate = this.unavailableDates.find(ud => 
    ud.date.toDateString() === date.toDateString()
  );
  
  if (unavailableDate) {
    if (unavailableDate.isFullDay) {
      return false;
    }
    // Check if time conflicts with partial unavailability
    // Implementation depends on time format and comparison logic
  }
  
  // Check working hours
  // Implementation depends on time format and comparison logic
  
  return true;
};

// Instance method to update statistics
doctorSchema.methods.updateStats = async function() {
  const Patient = require('./Patient');
  const Appointment = require('./Appointment');
  
  const patientCount = await Patient.countDocuments({ primaryDoctor: this._id });
  const appointmentCount = await Appointment.countDocuments({ doctor: this._id });
  
  this.totalPatients = patientCount;
  this.totalAppointments = appointmentCount;
  
  return this.save();
};

module.exports = mongoose.model('Doctor', doctorSchema);