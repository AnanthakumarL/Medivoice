const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  // Prescription Identification
  prescriptionId: {
    type: String,
    trim: true,
    uppercase: true
  },
  
  rxNumber: {
    type: String,
    trim: true
  },
  
  // Core References
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Patient reference is required'],
    index: true
  },
  
  prescribedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: [true, 'Prescribing doctor reference is required']
  },
  
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  
  medicalRecord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MedicalRecord'
  },
  
  // Medication Information
  medication: {
    brandName: {
      type: String,
      trim: true
    },
    genericName: {
      type: String,
      required: [true, 'Generic medication name is required'],
      trim: true
    },
    strength: {
      type: String,
      required: [true, 'Medication strength is required'],
      trim: true
    },
    dosageForm: {
      type: String,
      enum: [
        'tablet',
        'capsule',
        'liquid',
        'injection',
        'cream',
        'ointment',
        'gel',
        'patch',
        'inhaler',
        'drops',
        'spray',
        'suppository',
        'powder',
        'other'
      ],
      required: [true, 'Dosage form is required'],
      default: 'tablet'
    },
    ndc: {
      type: String,
      trim: true
    },
    manufacturer: {
      type: String,
      trim: true
    }
  },
  
  // Prescription Details
  dosage: {
    amount: {
      type: String,
      required: [true, 'Dosage amount is required'],
      trim: true
    },
    unit: {
      type: String,
      enum: ['mg', 'mcg', 'g', 'ml', 'units', 'drops', 'sprays', 'patches', 'other'],
      default: 'mg'
    },
    frequency: {
      type: String,
      required: [true, 'Dosage frequency is required'],
      trim: true
    },
    route: {
      type: String,
      enum: [
        'oral',
        'sublingual',
        'buccal',
        'rectal',
        'vaginal',
        'topical',
        'transdermal',
        'inhalation',
        'nasal',
        'ophthalmic',
        'otic',
        'intramuscular',
        'intravenous',
        'subcutaneous',
        'intradermal',
        'other'
      ],
      required: [true, 'Route of administration is required'],
      default: 'oral'
    },
    instructions: {
      type: String,
      required: [true, 'Prescription instructions are required'],
      trim: true,
      maxlength: 1000
    },
    duration: {
      type: String,
      trim: true
    }
  },
  
  // Quantity and Refills
  quantity: {
    prescribed: {
      type: Number,
      required: [true, 'Prescribed quantity is required'],
      min: 1
    },
    dispensed: {
      type: Number,
      default: 0
    },
    unit: {
      type: String,
      enum: ['tablets', 'capsules', 'ml', 'grams', 'patches', 'inhalers', 'bottles', 'vials', 'tubes', 'other'],
      default: 'tablets'
    }
  },
  
  refills: {
    authorized: {
      type: Number,
      default: 0,
      min: 0,
      max: 11
    },
    remaining: {
      type: Number,
      default: 0
    },
    used: {
      type: Number,
      default: 0
    }
  },
  
  // Dates
  prescribedDate: {
    type: Date,
    required: [true, 'Prescribed date is required'],
    default: Date.now,
    index: true
  },
  
  effectiveDate: {
    type: Date,
    default: Date.now
  },
  
  expirationDate: {
    type: Date,
    required: [true, 'Expiration date is required']
  },
  
  // Clinical Information
  indication: {
    diagnosis: {
      type: String,
      trim: true
    },
    icd10Code: {
      type: String,
      trim: true
    },
    purpose: {
      type: String,
      required: [true, 'Purpose of prescription is required'],
      trim: true
    }
  },
  
  contraindications: [{
    condition: {
      type: String,
      trim: true
    },
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe', 'absolute'],
      default: 'moderate'
    },
    notes: {
      type: String,
      trim: true
    }
  }],
  
  allergies: [{
    allergen: {
      type: String,
      trim: true
    },
    reaction: {
      type: String,
      trim: true
    },
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe', 'life-threatening'],
      default: 'mild'
    }
  }],
  
  drugInteractions: [{
    medication: {
      type: String,
      trim: true
    },
    interactionType: {
      type: String,
      enum: ['minor', 'moderate', 'major', 'contraindicated'],
      default: 'moderate'
    },
    description: {
      type: String,
      trim: true
    },
    management: {
      type: String,
      trim: true
    }
  }],
  
  // Pharmacy Information
  pharmacy: {
    name: {
      type: String,
      trim: true
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: { type: String, default: 'USA' }
    },
    phone: {
      type: String,
      trim: true
    },
    npi: {
      type: String,
      trim: true
    },
    licenseNumber: {
      type: String,
      trim: true
    }
  },
  
  // Dispensing Information
  dispensing: {
    dispensedDate: Date,
    dispensedBy: {
      pharmacist: String,
      pharmacyTechnician: String
    },
    lotNumber: {
      type: String,
      trim: true
    },
    manufacturerExpiration: Date,
    counselingProvided: {
      type: Boolean,
      default: false
    },
    counselingNotes: {
      type: String,
      trim: true
    },
    substitution: {
      allowed: {
        type: Boolean,
        default: true
      },
      occurred: {
        type: Boolean,
        default: false
      },
      substituteProduct: {
        type: String,
        trim: true
      },
      reason: {
        type: String,
        trim: true
      }
    }
  },
  
  // Status and Tracking
  status: {
    type: String,
    enum: [
      'pending',
      'sent-to-pharmacy',
      'ready-for-pickup',
      'dispensed',
      'partially-filled',
      'cancelled',
      'expired',
      'on-hold',
      'denied'
    ],
    default: 'pending',
    index: true
  },
  
  statusHistory: [{
    status: {
      type: String,
      enum: [
        'pending',
        'sent-to-pharmacy',
        'ready-for-pickup',
        'dispensed',
        'partially-filled',
        'cancelled',
        'expired',
        'on-hold',
        'denied'
      ],
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    updatedBy: {
      type: String,
      trim: true
    },
    notes: {
      type: String,
      trim: true
    }
  }],
  
  // Electronic Prescription Information
  ePrescription: {
    isElectronic: {
      type: Boolean,
      default: false
    },
    transmissionId: {
      type: String,
      trim: true
    },
    transmissionDate: Date,
    receivedByPharmacy: {
      type: Boolean,
      default: false
    },
    receivedDate: Date,
    errorMessages: [{
      code: String,
      message: String,
      timestamp: { type: Date, default: Date.now }
    }]
  },
  
  // Insurance and Prior Authorization
  insurance: {
    provider: {
      type: String,
      trim: true
    },
    memberId: {
      type: String,
      trim: true
    },
    groupNumber: {
      type: String,
      trim: true
    },
    copay: {
      type: Number,
      min: 0
    },
    coverage: {
      isApproved: {
        type: Boolean,
        default: false
      },
      coveragePercentage: {
        type: Number,
        min: 0,
        max: 100
      },
      maxQuantity: Number,
      restrictions: [{
        type: String,
        trim: true
      }]
    },
    priorAuthorization: {
      required: {
        type: Boolean,
        default: false
      },
      authNumber: {
        type: String,
        trim: true
      },
      expirationDate: Date,
      status: {
        type: String,
        enum: ['pending', 'approved', 'denied', 'expired'],
        default: 'pending'
      },
      requestDate: Date,
      approvalDate: Date
    }
  },
  
  // Cost Information
  cost: {
    prescriptionCost: {
      type: Number,
      min: 0
    },
    insurancePaid: {
      type: Number,
      min: 0
    },
    patientPaid: {
      type: Number,
      min: 0
    },
    copay: {
      type: Number,
      min: 0
    },
    deductible: {
      type: Number,
      min: 0
    }
  },
  
  // Patient Compliance and Monitoring
  compliance: {
    adherenceRate: {
      type: Number,
      min: 0,
      max: 100
    },
    lastTaken: Date,
    missedDoses: {
      type: Number,
      default: 0
    },
    sideEffectsReported: [{
      effect: {
        type: String,
        trim: true
      },
      severity: {
        type: String,
        enum: ['mild', 'moderate', 'severe'],
        default: 'mild'
      },
      reportedDate: {
        type: Date,
        default: Date.now
      },
      action: {
        type: String,
        trim: true
      }
    }],
    effectivenessRating: {
      type: Number,
      min: 1,
      max: 10
    },
    patientNotes: {
      type: String,
      trim: true
    }
  },
  
  // Refill History
  refillHistory: [{
    refillNumber: {
      type: Number,
      required: true
    },
    dispensedDate: {
      type: Date,
      required: true
    },
    quantityDispensed: {
      type: Number,
      required: true
    },
    daysSupply: {
      type: Number,
      required: true
    },
    pharmacy: {
      type: String,
      trim: true
    },
    cost: {
      type: Number,
      min: 0
    },
    notes: {
      type: String,
      trim: true
    }
  }],
  
  // Clinical Monitoring
  monitoring: {
    labMonitoringRequired: {
      type: Boolean,
      default: false
    },
    labTests: [{
      testName: String,
      frequency: String,
      lastCompleted: Date,
      nextDue: Date,
      results: String
    }],
    vitalSignsMonitoring: {
      required: {
        type: Boolean,
        default: false
      },
      frequency: String,
      parameters: [String]
    },
    followUpRequired: {
      type: Boolean,
      default: false
    },
    followUpDate: Date,
    monitoringNotes: {
      type: String,
      trim: true
    }
  },
  
  // Discontinuation Information
  discontinuation: {
    isDiscontinued: {
      type: Boolean,
      default: false
    },
    discontinuedDate: Date,
    discontinuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor'
    },
    reason: {
      type: String,
      enum: [
        'treatment-completed',
        'ineffective',
        'side-effects',
        'patient-request',
        'drug-interaction',
        'contraindication',
        'cost',
        'other'
      ]
    },
    notes: {
      type: String,
      trim: true
    },
    taperSchedule: {
      type: String,
      trim: true
    }
  },
  
  // Digital Signature and Verification
  digitalSignature: {
    isSigned: {
      type: Boolean,
      default: false
    },
    signedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor'
    },
    signedDate: Date,
    signatureHash: {
      type: String,
      trim: true
    },
    verification: {
      isVerified: {
        type: Boolean,
        default: false
      },
      verifiedBy: String,
      verifiedDate: Date
    }
  },
  
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  notes: {
    type: String,
    trim: true
  },
  
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
prescriptionSchema.index({ patient: 1, prescribedDate: -1 });
prescriptionSchema.index({ prescribedBy: 1, prescribedDate: -1 });
prescriptionSchema.index({ prescriptionId: 1 }, { unique: true, sparse: true });
prescriptionSchema.index({ rxNumber: 1 }, { unique: true, sparse: true });
prescriptionSchema.index({ expirationDate: 1 });
prescriptionSchema.index({ 'medication.genericName': 1 });

// Virtual properties
prescriptionSchema.virtual('isExpired').get(function() {
  return this.expirationDate < new Date();
});

prescriptionSchema.virtual('daysUntilExpiration').get(function() {
  const now = new Date();
  const expiration = new Date(this.expirationDate);
  const diffTime = expiration - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

prescriptionSchema.virtual('isRefillable').get(function() {
  return this.refills.remaining > 0 && !this.isExpired && this.status === 'dispensed';
});

prescriptionSchema.virtual('totalQuantityDispensed').get(function() {
  return this.refillHistory.reduce((total, refill) => total + refill.quantityDispensed, 0);
});

prescriptionSchema.virtual('adherenceStatus').get(function() {
  if (!this.compliance.adherenceRate) return 'unknown';
  if (this.compliance.adherenceRate >= 80) return 'good';
  if (this.compliance.adherenceRate >= 60) return 'moderate';
  return 'poor';
});

// Pre-save middleware
prescriptionSchema.pre('save', async function(next) {
  if (!this.prescriptionId) {
    const count = await this.constructor.countDocuments();
    this.prescriptionId = `RX${String(count + 1).padStart(8, '0')}`;
  }
  
  if (!this.rxNumber) {
    const timestamp = Date.now().toString();
    this.rxNumber = `RX${timestamp.slice(-8)}`;
  }
  
  // Set default expiration date if not provided (1 year from prescribed date)
  if (!this.expirationDate) {
    const expDate = new Date(this.prescribedDate);
    expDate.setFullYear(expDate.getFullYear() + 1);
    this.expirationDate = expDate;
  }
  
  // Initialize remaining refills
  if (this.isNew) {
    this.refills.remaining = this.refills.authorized;
  }
  
  next();
});

// Pre-save middleware to update status history
prescriptionSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      updatedBy: this.lastModifiedBy ? this.lastModifiedBy.toString() : 'system'
    });
  }
  next();
});

// Instance methods
prescriptionSchema.methods.dispense = function(dispensingInfo) {
  this.status = 'dispensed';
  this.dispensing = {
    ...this.dispensing,
    ...dispensingInfo,
    dispensedDate: new Date()
  };
  this.quantity.dispensed = dispensingInfo.quantityDispensed || this.quantity.prescribed;
  
  // Add to refill history
  this.refillHistory.push({
    refillNumber: this.refillHistory.length + 1,
    dispensedDate: new Date(),
    quantityDispensed: this.quantity.dispensed,
    daysSupply: dispensingInfo.daysSupply || 30,
    pharmacy: this.pharmacy.name,
    cost: dispensingInfo.cost
  });
  
  return this.save();
};

prescriptionSchema.methods.refill = function(refillInfo) {
  if (this.refills.remaining <= 0) {
    throw new Error('No refills remaining');
  }
  
  if (this.isExpired) {
    throw new Error('Prescription has expired');
  }
  
  this.refills.remaining -= 1;
  this.refills.used += 1;
  
  this.refillHistory.push({
    refillNumber: this.refillHistory.length + 1,
    dispensedDate: new Date(),
    quantityDispensed: refillInfo.quantityDispensed || this.quantity.prescribed,
    daysSupply: refillInfo.daysSupply || 30,
    pharmacy: refillInfo.pharmacy || this.pharmacy.name,
    cost: refillInfo.cost,
    notes: refillInfo.notes
  });
  
  return this.save();
};

prescriptionSchema.methods.cancel = function(reason, cancelledBy) {
  this.status = 'cancelled';
  this.lastModifiedBy = cancelledBy;
  this.statusHistory.push({
    status: 'cancelled',
    timestamp: new Date(),
    updatedBy: cancelledBy.toString(),
    notes: reason
  });
  return this.save();
};

prescriptionSchema.methods.discontinue = function(discontinuationInfo, discontinuedBy) {
  this.discontinuation = {
    isDiscontinued: true,
    discontinuedDate: new Date(),
    discontinuedBy: discontinuedBy,
    ...discontinuationInfo
  };
  this.status = 'cancelled';
  this.isActive = false;
  return this.save();
};

prescriptionSchema.methods.reportSideEffect = function(sideEffectData) {
  this.compliance.sideEffectsReported.push({
    ...sideEffectData,
    reportedDate: new Date()
  });
  return this.save();
};

prescriptionSchema.methods.updateCompliance = function(complianceData) {
  this.compliance = { ...this.compliance, ...complianceData };
  return this.save();
};

prescriptionSchema.methods.sign = function(doctorId, signatureHash) {
  this.digitalSignature = {
    isSigned: true,
    signedBy: doctorId,
    signedDate: new Date(),
    signatureHash: signatureHash
  };
  return this.save();
};

// Static methods
prescriptionSchema.statics.findByPrescriptionId = function(prescriptionId) {
  return this.findOne({ prescriptionId: prescriptionId.toUpperCase() })
    .populate('patient prescribedBy appointment');
};

prescriptionSchema.statics.findByRxNumber = function(rxNumber) {
  return this.findOne({ rxNumber: rxNumber })
    .populate('patient prescribedBy');
};

prescriptionSchema.statics.findActiveByPatient = function(patientId) {
  return this.find({
    patient: patientId,
    isActive: true,
    status: { $nin: ['cancelled', 'expired'] },
    expirationDate: { $gte: new Date() }
  }).populate('prescribedBy');
};

prescriptionSchema.statics.findByDoctor = function(doctorId, startDate, endDate) {
  const query = { prescribedBy: doctorId };
  if (startDate && endDate) {
    query.prescribedDate = { $gte: startDate, $lte: endDate };
  }
  return this.find(query)
    .sort({ prescribedDate: -1 })
    .populate('patient');
};

prescriptionSchema.statics.findExpiringSoon = function(days = 30) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  
  return this.find({
    expirationDate: { $lte: futureDate, $gte: new Date() },
    status: { $nin: ['cancelled', 'expired'] },
    isActive: true
  }).populate('patient prescribedBy');
};

prescriptionSchema.statics.findByMedication = function(medicationName) {
  return this.find({
    $or: [
      { 'medication.brandName': new RegExp(medicationName, 'i') },
      { 'medication.genericName': new RegExp(medicationName, 'i') }
    ],
    isActive: true
  }).populate('patient prescribedBy');
};

prescriptionSchema.statics.getPrescriptionStats = function(doctorId, startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        prescribedBy: mongoose.Types.ObjectId(doctorId),
        prescribedDate: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
};

module.exports = mongoose.model('Prescription', prescriptionSchema);