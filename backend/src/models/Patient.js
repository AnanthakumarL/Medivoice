const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  patientId: {
    type: String,
    required: [true, 'Patient ID is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  primaryDoctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: false
  },
  emergencyContact: {
    name: {
      type: String,
      required: [true, 'Emergency contact name is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Emergency contact phone is required'],
      trim: true
    },
    relationship: {
      type: String,
      required: [true, 'Emergency contact relationship is required'],
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    }
  },
  insurance: {
    provider: {
      type: String,
      trim: true
    },
    policyNumber: {
      type: String,
      trim: true
    },
    groupNumber: {
      type: String,
      trim: true
    },
    expiryDate: Date,
    copayAmount: Number,
    deductible: Number,
    isActive: {
      type: Boolean,
      default: true
    }
  },
  medicalHistory: {
    allergies: [{
      allergen: {
        type: String,
        required: true,
        trim: true
      },
      severity: {
        type: String,
        enum: ['mild', 'moderate', 'severe', 'life-threatening'],
        required: true
      },
      reaction: String,
      diagnosedDate: Date
    }],
    chronicConditions: [{
      condition: {
        type: String,
        required: true,
        trim: true
      },
      diagnosedDate: Date,
      status: {
        type: String,
        enum: ['active', 'controlled', 'resolved', 'in-remission'],
        default: 'active'
      },
      notes: String
    }],
    currentMedications: [{
      name: {
        type: String,
        required: true,
        trim: true
      },
      dosage: {
        type: String,
        required: true
      },
      frequency: {
        type: String,
        required: true
      },
      startDate: Date,
      endDate: Date,
      prescribedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
      },
      isActive: {
        type: Boolean,
        default: true
      },
      notes: String
    }],
    pastSurgeries: [{
      procedure: {
        type: String,
        required: true,
        trim: true
      },
      date: Date,
      surgeon: String,
      hospital: String,
      complications: String,
      notes: String
    }],
    familyHistory: [{
      relation: {
        type: String,
        required: true,
        trim: true
      },
      condition: {
        type: String,
        required: true,
        trim: true
      },
      ageOfOnset: Number,
      notes: String
    }]
  },
  vitals: {
    bloodType: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      uppercase: true
    },
    height: {
      value: Number, // in cm
      unit: {
        type: String,
        default: 'cm'
      },
      lastUpdated: Date
    },
    weight: {
      value: Number, // in kg
      unit: {
        type: String,
        default: 'kg'
      },
      lastUpdated: Date
    }
  },
  lifestyle: {
    smokingStatus: {
      type: String,
      enum: ['never', 'former', 'current'],
      default: 'never'
    },
    alcoholConsumption: {
      type: String,
      enum: ['none', 'occasional', 'moderate', 'heavy']
    },
    exerciseFrequency: {
      type: String,
      enum: ['none', 'rare', 'weekly', 'daily']
    },
    dietType: {
      type: String,
      enum: ['regular', 'vegetarian', 'vegan', 'kosher', 'halal', 'other']
    },
    occupation: {
      type: String,
      trim: true
    }
  },
  preferences: {
    language: {
      type: String,
      default: 'english'
    },
    communicationMethod: {
      type: String,
      enum: ['email', 'sms', 'phone', 'portal'],
      default: 'email'
    },
    appointmentReminders: {
      type: Boolean,
      default: true
    },
    labResultNotifications: {
      type: Boolean,
      default: true
    }
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  lastVisit: {
    type: Date,
    default: null
  },
  totalVisits: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'deceased', 'transferred'],
    default: 'active'
  },
  notes: {
    type: String,
    maxlength: [2000, 'Notes cannot exceed 2000 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for BMI calculation
patientSchema.virtual('bmi').get(function() {
  if (this.vitals.height?.value && this.vitals.weight?.value) {
    const heightInMeters = this.vitals.height.value / 100;
    return (this.vitals.weight.value / (heightInMeters * heightInMeters)).toFixed(1);
  }
  return null;
});

// Virtual for age calculation
patientSchema.virtual('age').get(function() {
  if (this.user?.dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(this.user.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
  return null;
});

// Virtual for upcoming appointments
patientSchema.virtual('upcomingAppointments', {
  ref: 'Appointment',
  localField: '_id',
  foreignField: 'patient',
  count: true,
  match: { 
    scheduledTime: { $gte: new Date() },
    status: { $in: ['scheduled', 'confirmed'] }
  }
});

// Virtual for total appointments
patientSchema.virtual('totalAppointments', {
  ref: 'Appointment',
  localField: '_id',
  foreignField: 'patient',
  count: true
});

// Indexes
patientSchema.index({ user: 1 });
patientSchema.index({ patientId: 1 });
patientSchema.index({ primaryDoctor: 1 });
patientSchema.index({ status: 1 });
patientSchema.index({ registrationDate: -1 });
patientSchema.index({ lastVisit: -1 });
patientSchema.index({ 'medicalHistory.allergies.allergen': 1 });
patientSchema.index({ 'medicalHistory.chronicConditions.condition': 1 });
patientSchema.index({ 'vitals.bloodType': 1 });

// Compound indexes
patientSchema.index({ primaryDoctor: 1, status: 1 });
patientSchema.index({ status: 1, registrationDate: -1 });

// Static method to search patients
patientSchema.statics.searchPatients = function(searchTerm, doctorId = null, options = {}) {
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
    }
  ];

  const matchConditions = {
    status: 'active',
    'userInfo.isActive': true
  };

  if (doctorId) {
    matchConditions.primaryDoctor = new mongoose.Types.ObjectId(doctorId);
  }

  if (searchTerm) {
    matchConditions.$or = [
      { 'userInfo.firstName': new RegExp(searchTerm, 'i') },
      { 'userInfo.lastName': new RegExp(searchTerm, 'i') },
      { patientId: new RegExp(searchTerm, 'i') },
      { 'userInfo.email': new RegExp(searchTerm, 'i') },
      { 'userInfo.phone': new RegExp(searchTerm, 'i') }
    ];
  }

  pipeline.push({ $match: matchConditions });

  if (options.sort) {
    pipeline.push({ $sort: options.sort });
  } else {
    pipeline.push({ $sort: { 'userInfo.lastName': 1 } });
  }

  if (options.skip) {
    pipeline.push({ $skip: options.skip });
  }

  if (options.limit) {
    pipeline.push({ $limit: options.limit });
  }

  return this.aggregate(pipeline);
};

// Static method to get patients by doctor
patientSchema.statics.findByDoctor = function(doctorId, options = {}) {
  const query = this.find({ primaryDoctor: doctorId, status: 'active' })
    .populate('user', 'firstName lastName email phone dateOfBirth gender');

  if (options.limit) query.limit(options.limit);
  if (options.skip) query.skip(options.skip);
  if (options.sort) query.sort(options.sort);

  return query;
};

// Instance method to add allergy
patientSchema.methods.addAllergy = function(allergyData) {
  this.medicalHistory.allergies.push(allergyData);
  return this.save();
};

// Instance method to add chronic condition
patientSchema.methods.addChronicCondition = function(conditionData) {
  this.medicalHistory.chronicConditions.push(conditionData);
  return this.save();
};

// Instance method to add medication
patientSchema.methods.addMedication = function(medicationData) {
  this.medicalHistory.currentMedications.push(medicationData);
  return this.save();
};

// Instance method to update vitals
patientSchema.methods.updateVitals = function(vitalsData) {
  if (vitalsData.height) {
    this.vitals.height = { ...vitalsData.height, lastUpdated: new Date() };
  }
  if (vitalsData.weight) {
    this.vitals.weight = { ...vitalsData.weight, lastUpdated: new Date() };
  }
  if (vitalsData.bloodType) {
    this.vitals.bloodType = vitalsData.bloodType;
  }
  return this.save();
};

// Instance method to update last visit
patientSchema.methods.recordVisit = function() {
  this.lastVisit = new Date();
  this.totalVisits += 1;
  return this.save();
};

// Pre-save middleware to auto-generate patient ID
patientSchema.pre('save', async function(next) {
  if (this.isNew && !this.patientId) {
    const currentYear = new Date().getFullYear();
    const count = await this.constructor.countDocuments({
      patientId: new RegExp(`^PAT${currentYear}`)
    });
    this.patientId = `PAT${currentYear}${(count + 1).toString().padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Patient', patientSchema);