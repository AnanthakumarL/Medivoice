const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  // Reference to User model
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required'],
    unique: true
  },
  
  // Medical Record Number
  medicalRecordNumber: {
    type: String,
    unique: true,
    required: [true, 'Medical record number is required']
  },
  
  // Personal Medical Information
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'],
    default: 'Unknown'
  },
  
  height: {
    value: Number, // in cm
    unit: {
      type: String,
      enum: ['cm', 'ft'],
      default: 'cm'
    }
  },
  
  weight: {
    value: Number, // in kg
    unit: {
      type: String,
      enum: ['kg', 'lbs'],
      default: 'kg'
    }
  },
  
  // Medical History
  allergies: [{
    allergen: {
      type: String,
      required: true
    },
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe', 'life-threatening'],
      default: 'mild'
    },
    symptoms: [String],
    notes: String,
    dateDiscovered: Date
  }],
  
  medications: [{
    name: {
      type: String,
      required: true
    },
    dosage: String,
    frequency: String,
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
  
  chronicConditions: [{
    condition: {
      type: String,
      required: true
    },
    diagnosedDate: Date,
    diagnosedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor'
    },
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe']
    },
    status: {
      type: String,
      enum: ['active', 'managed', 'resolved', 'in-remission'],
      default: 'active'
    },
    notes: String
  }],
  
  surgicalHistory: [{
    procedure: {
      type: String,
      required: true
    },
    date: Date,
    surgeon: String,
    hospital: String,
    complications: String,
    outcome: {
      type: String,
      enum: ['successful', 'complications', 'failed']
    },
    notes: String
  }],
  
  familyHistory: [{
    relationship: {
      type: String,
      required: true,
      enum: ['parent', 'sibling', 'grandparent', 'aunt', 'uncle', 'cousin', 'other']
    },
    condition: {
      type: String,
      required: true
    },
    ageAtDiagnosis: Number,
    notes: String
  }],
  
  // Social History
  lifestyle: {
    smokingStatus: {
      type: String,
      default: 'unknown'
    },
    smokingHistory: {
      packsPerDay: Number,
      yearsSmoked: Number,
      quitDate: Date
    },
    alcoholConsumption: {
      type: String,
      enum: ['none', 'occasional', 'moderate', 'heavy', 'unknown'],
      default: 'unknown'
    },
    exerciseFrequency: {
      type: String,
      enum: ['none', 'rarely', 'weekly', 'regularly', 'daily'],
      default: 'none'
    },
    diet: {
      type: String,
      enum: ['regular', 'vegetarian', 'vegan', 'gluten-free', 'diabetic', 'other'],
      default: 'regular'
    },
    occupation: String
  },
  
  // Insurance Information
  insurance: {
    provider: String,
    policyNumber: String,
    groupNumber: String,
    subscriberName: String,
    relationshipToSubscriber: {
      type: String,
      enum: ['self', 'spouse', 'child', 'other'],
      default: 'self'
    },
    effectiveDate: Date,
    expirationDate: Date,
    copayAmount: Number,
    deductible: Number,
    isActive: {
      type: Boolean,
      default: true
    }
  },
  
  // Primary Care Information
  primaryCarePhysician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  },
  
  preferredPharmacy: {
    name: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String
    },
    phone: String
  },
  
  // Vital Signs History (latest readings)
  vitalSigns: {
    bloodPressure: {
      systolic: Number,
      diastolic: Number,
      dateRecorded: Date,
      recordedBy: String
    },
    heartRate: {
      value: Number,
      dateRecorded: Date,
      recordedBy: String
    },
    temperature: {
      value: Number,
      unit: {
        type: String,
        enum: ['celsius', 'fahrenheit'],
        default: 'fahrenheit'
      },
      dateRecorded: Date,
      recordedBy: String
    },
    respiratoryRate: {
      value: Number,
      dateRecorded: Date,
      recordedBy: String
    },
    oxygenSaturation: {
      value: Number,
      dateRecorded: Date,
      recordedBy: String
    }
  },
  
  // Health Metrics (for dashboard charts)
  healthMetrics: {
    bmi: {
      type: Number,
      default: function() {
        if (this.height?.value && this.weight?.value) {
          const heightInM = this.height.value / 100;
          return this.weight.value / (heightInM * heightInM);
        }
        return null;
      }
    },
    lastCheckupDate: Date,
    nextCheckupDue: Date,
    immunizationStatus: {
      type: String,
      enum: ['up-to-date', 'needs-update', 'unknown'],
      default: 'unknown'
    }
  },
  
  // Immunization Records
  immunizations: [{
    vaccine: {
      type: String,
      required: true
    },
    dateAdministered: Date,
    administeredBy: String,
    lotNumber: String,
    manufacturer: String,
    site: String,
    nextDueDate: Date,
    notes: String
  }],
  
  // Lab Results Summary (latest values)
  labResults: {
    cholesterol: {
      total: Number,
      hdl: Number,
      ldl: Number,
      triglycerides: Number,
      dateRecorded: Date
    },
    bloodGlucose: {
      fasting: Number,
      random: Number,
      hba1c: Number,
      dateRecorded: Date
    },
    kidneyFunction: {
      creatinine: Number,
      bun: Number,
      gfr: Number,
      dateRecorded: Date
    },
    liverFunction: {
      alt: Number,
      ast: Number,
      bilirubin: Number,
      dateRecorded: Date
    }
  },
  
  // Care Team
  careTeam: [{
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor'
    },
    role: {
      type: String,
      enum: ['primary-care', 'specialist', 'consultant', 'therapist', 'other']
    },
    startDate: Date,
    endDate: Date,
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  
  // Patient Preferences
  preferences: {
    communicationPreference: {
      type: String,
      enum: ['phone', 'email', 'text', 'portal'],
      default: 'email'
    },
    appointmentReminders: {
      type: Boolean,
      default: true
    },
    reminderTiming: {
      type: String,
      enum: ['1-day', '2-day', '1-week'],
      default: '1-day'
    },
    languagePreference: {
      type: String,
      default: 'en'
    },
    privacySettings: {
      shareWithFamily: {
        type: Boolean,
        default: false
      },
      shareWithCareTeam: {
        type: Boolean,
        default: true
      }
    }
  },
  
  // Status and Flags
  isActive: {
    type: Boolean,
    default: true
  },
  
  riskFlags: [{
    flag: {
      type: String,
      enum: ['high-risk', 'diabetes', 'hypertension', 'cardiac', 'fall-risk', 'medication-interaction']
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical']
    },
    notes: String,
    dateAdded: {
      type: Date,
      default: Date.now
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  
  // Statistics (for analytics)
  statistics: {
    totalAppointments: {
      type: Number,
      default: 0
    },
    missedAppointments: {
      type: Number,
      default: 0
    },
    totalVisits: {
      type: Number,
      default: 0
    },
    lastVisitDate: Date,
    averageVisitDuration: {
      type: Number,
      default: 0
    }
  }
  
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for user details
patientSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

// Virtual for full name (through user reference)
patientSchema.virtual('fullName').get(function() {
  return this.user ? this.user.fullName : 'Unknown Patient';
});

// Virtual for age (through user reference)
patientSchema.virtual('age').get(function() {
  return this.user ? this.user.age : null;
});

// Virtual for BMI calculation
patientSchema.virtual('bmi').get(function() {
  if (this.height?.value && this.weight?.value) {
    const heightInM = this.height.value / 100;
    return Math.round((this.weight.value / (heightInM * heightInM)) * 10) / 10;
  }
  return null;
});

// Virtual for BMI category
patientSchema.virtual('bmiCategory').get(function() {
  const bmi = this.bmi;
  if (!bmi) return 'Unknown';
  
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
});

// Virtual for active medications count
patientSchema.virtual('activeMedicationsCount').get(function() {
  if (!this.medications) return 0;
  return this.medications.filter(med => med.isActive).length;
});

// Virtual for active allergies count
patientSchema.virtual('activeAllergiesCount').get(function() {
  if (!this.allergies) return 0;
  return this.allergies.length;
});

// Virtual for high priority flags
patientSchema.virtual('highPriorityFlags').get(function() {
  if (!this.riskFlags) return [];
  return this.riskFlags.filter(flag => flag.severity === 'high' || flag.severity === 'critical');
});

// Indexes (removing redundant unique indexes)
patientSchema.index({ bloodType: 1 });
patientSchema.index({ primaryCarePhysician: 1 });
patientSchema.index({ isActive: 1 });
patientSchema.index({ 'insurance.provider': 1 });
patientSchema.index({ 'riskFlags.flag': 1 });
patientSchema.index({ createdAt: -1 });

// Pre-save middleware to generate medical record number
patientSchema.pre('save', async function(next) {
  if (this.isNew && !this.medicalRecordNumber) {
    const count = await this.constructor.countDocuments();
    this.medicalRecordNumber = `MRN${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Pre-save middleware to populate user if not populated
patientSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'userId',
    select: 'firstName lastName email phone dateOfBirth gender avatar'
  });
  next();
});

// Instance method to add medication
patientSchema.methods.addMedication = function(medicationData) {
  this.medications.push(medicationData);
  return this.save();
};

// Instance method to add allergy
patientSchema.methods.addAllergy = function(allergyData) {
  this.allergies.push(allergyData);
  return this.save();
};

// Instance method to add risk flag
patientSchema.methods.addRiskFlag = function(flagData) {
  this.riskFlags.push(flagData);
  return this.save();
};

// Instance method to update vital signs
patientSchema.methods.updateVitalSigns = function(vitalSignsData) {
  Object.assign(this.vitalSigns, vitalSignsData);
  return this.save();
};

// Instance method to check if patient has allergy
patientSchema.methods.hasAllergy = function(allergen) {
  return this.allergies.some(allergy => 
    allergy.allergen.toLowerCase().includes(allergen.toLowerCase())
  );
};

// Instance method to get active medications
patientSchema.methods.getActiveMedications = function() {
  return this.medications.filter(med => med.isActive);
};

// Instance method to get current chronic conditions
patientSchema.methods.getActiveConditions = function() {
  return this.chronicConditions.filter(condition => 
    condition.status === 'active' || condition.status === 'managed'
  );
};

// Static method to find patients by primary care physician
patientSchema.statics.findByPrimaryDoctor = function(doctorId) {
  return this.find({ 
    primaryCarePhysician: doctorId,
    isActive: true 
  }).populate('userId', 'firstName lastName email phone dateOfBirth');
};

// Static method to find patients with specific risk flags
patientSchema.statics.findByRiskFlag = function(flagType) {
  return this.find({ 
    'riskFlags.flag': flagType,
    isActive: true 
  }).populate('userId', 'firstName lastName email phone');
};

// Static method to find patients needing checkups
patientSchema.statics.findNeedingCheckups = function() {
  const today = new Date();
  return this.find({ 
    'healthMetrics.nextCheckupDue': { $lte: today },
    isActive: true 
  }).populate('userId', 'firstName lastName email phone');
};

module.exports = mongoose.model('Patient', patientSchema);