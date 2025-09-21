const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
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
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: false
  },
  medicalRecord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MedicalRecord',
    required: false
  },
  prescriptionNumber: {
    type: String,
    unique: true,
    required: true
  },
  medications: [{
    name: {
      type: String,
      required: [true, 'Medication name is required'],
      trim: true
    },
    genericName: {
      type: String,
      trim: true
    },
    brandName: {
      type: String,
      trim: true
    },
    strength: {
      type: String,
      required: [true, 'Medication strength is required'],
      trim: true
    },
    dosageForm: {
      type: String,
      required: [true, 'Dosage form is required'],
      enum: ['tablet', 'capsule', 'syrup', 'injection', 'cream', 'ointment', 'drops', 'inhaler', 'spray', 'patch', 'suppository', 'powder', 'gel', 'lotion', 'solution'],
      trim: true
    },
    route: {
      type: String,
      required: [true, 'Route of administration is required'],
      enum: ['oral', 'topical', 'injection', 'inhalation', 'rectal', 'vaginal', 'sublingual', 'transdermal', 'ophthalmic', 'otic', 'nasal'],
      default: 'oral'
    },
    frequency: {
      type: String,
      required: [true, 'Frequency is required'],
      trim: true
    },
    dosage: {
      type: String,
      required: [true, 'Dosage is required'],
      trim: true
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
      trim: true
    },
    quantity: {
      prescribed: {
        type: Number,
        required: [true, 'Prescribed quantity is required'],
        min: [1, 'Quantity must be at least 1']
      },
      dispensed: {
        type: Number,
        default: 0
      },
      unit: {
        type: String,
        required: [true, 'Quantity unit is required'],
        enum: ['tablets', 'capsules', 'ml', 'mg', 'g', 'units', 'bottles', 'tubes', 'vials', 'sachets', 'pieces']
      }
    },
    instructions: {
      type: String,
      required: [true, 'Instructions are required'],
      trim: true,
      maxlength: [500, 'Instructions cannot exceed 500 characters']
    },
    specialInstructions: {
      type: String,
      trim: true,
      maxlength: [500, 'Special instructions cannot exceed 500 characters']
    },
    indication: {
      type: String,
      trim: true,
      maxlength: [200, 'Indication cannot exceed 200 characters']
    },
    contraindications: [String],
    sideEffects: [String],
    interactions: [String],
    precautions: [String],
    isGenericAllowed: {
      type: Boolean,
      default: true
    },
    isControlledSubstance: {
      type: Boolean,
      default: false
    },
    scheduleClass: {
      type: String,
      enum: ['I', 'II', 'III', 'IV', 'V'],
      required: function() {
        return this.isControlledSubstance;
      }
    },
    refills: {
      authorized: {
        type: Number,
        default: 0,
        min: [0, 'Refills cannot be negative'],
        max: [5, 'Maximum 5 refills allowed']
      },
      remaining: {
        type: Number,
        default: 0
      }
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: Date,
    status: {
      type: String,
      enum: ['active', 'completed', 'discontinued', 'on-hold'],
      default: 'active'
    },
    discontinuationReason: {
      type: String,
      trim: true
    },
    allergyChecked: {
      type: Boolean,
      default: false
    },
    interactionChecked: {
      type: Boolean,
      default: false
    }
  }],
  totalCost: {
    type: Number,
    min: [0, 'Total cost cannot be negative']
  },
  diagnosis: [{
    condition: {
      type: String,
      required: true,
      trim: true
    },
    icdCode: {
      type: String,
      trim: true,
      uppercase: true
    }
  }],
  prescribedFor: {
    type: String,
    required: [true, 'Prescribed for condition is required'],
    trim: true,
    maxlength: [200, 'Prescribed for cannot exceed 200 characters']
  },
  pharmacy: {
    name: String,
    address: String,
    phone: String,
    email: String,
    licenseNumber: String
  },
  isElectronicPrescription: {
    type: Boolean,
    default: true
  },
  prescriptionType: {
    type: String,
    enum: ['new', 'refill', 'renewal', 'transfer'],
    default: 'new'
  },
  urgency: {
    type: String,
    enum: ['routine', 'urgent', 'stat'],
    default: 'routine'
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'dispensed', 'completed', 'cancelled', 'expired'],
    default: 'draft'
  },
  dispensingHistory: [{
    pharmacist: {
      name: String,
      licenseNumber: String
    },
    pharmacy: {
      name: String,
      address: String,
      phone: String
    },
    dispensedDate: {
      type: Date,
      default: Date.now
    },
    dispensedQuantity: Number,
    dispensedMedications: [{
      medicationIndex: Number,
      actualMedication: String,
      actualStrength: String,
      actualQuantity: Number,
      lotNumber: String,
      expiryDate: Date,
      manufacturer: String
    }],
    cost: Number,
    insuranceCovered: Boolean,
    copay: Number,
    notes: String
  }],
  validUntil: {
    type: Date,
    required: true
  },
  isValid: {
    type: Boolean,
    default: true
  },
  cancellationReason: String,
  digitalSignature: {
    doctorId: String,
    timestamp: Date,
    hash: String
  },
  patientConsent: {
    obtained: {
      type: Boolean,
      default: false
    },
    obtainedAt: Date,
    method: {
      type: String,
      enum: ['verbal', 'written', 'electronic']
    }
  },
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: Date,
  followUpInstructions: String,
  notes: {
    doctor: String,
    pharmacist: String,
    patient: String
  },
  printedCopies: {
    type: Number,
    default: 0
  },
  lastPrintedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Pre-save middleware to generate prescription number
prescriptionSchema.pre('save', async function(next) {
  if (!this.prescriptionNumber) {
    const count = await this.constructor.countDocuments();
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    this.prescriptionNumber = `RX${year}${month}${day}${String(count + 1).padStart(4, '0')}`;
  }

  // Set default validity (30 days from creation)
  if (!this.validUntil) {
    this.validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }

  // Initialize remaining refills
  this.medications.forEach(med => {
    if (med.refills.remaining === undefined) {
      med.refills.remaining = med.refills.authorized;
    }
  });

  next();
});

// Virtual for prescription age
prescriptionSchema.virtual('prescriptionAge').get(function() {
  const now = new Date();
  const created = this.createdAt;
  const diffTime = Math.abs(now - created);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 30) return `${diffDays} days ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
});

// Virtual for validity status
prescriptionSchema.virtual('isExpired').get(function() {
  return new Date() > this.validUntil;
});

// Virtual for days until expiry
prescriptionSchema.virtual('daysUntilExpiry').get(function() {
  const now = new Date();
  const diffTime = this.validUntil - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for total medications count
prescriptionSchema.virtual('medicationCount').get(function() {
  return this.medications.length;
});

// Indexes
prescriptionSchema.index({ patient: 1 });
prescriptionSchema.index({ doctor: 1 });
prescriptionSchema.index({ appointment: 1 });
prescriptionSchema.index({ prescriptionNumber: 1 }, { unique: true });
prescriptionSchema.index({ status: 1 });
prescriptionSchema.index({ createdAt: -1 });
prescriptionSchema.index({ validUntil: 1 });
prescriptionSchema.index({ isValid: 1 });

// Compound indexes
prescriptionSchema.index({ patient: 1, createdAt: -1 });
prescriptionSchema.index({ patient: 1, status: 1 });
prescriptionSchema.index({ doctor: 1, createdAt: -1 });
prescriptionSchema.index({ patient: 1, validUntil: 1 });
prescriptionSchema.index({ status: 1, validUntil: 1 });

// Text index for search
prescriptionSchema.index({
  prescriptionNumber: 'text',
  'medications.name': 'text',
  'medications.genericName': 'text',
  'medications.brandName': 'text',
  prescribedFor: 'text'
});

// Static method to find active prescriptions
prescriptionSchema.statics.findActivePrescriptions = function(patientId) {
  return this.find({
    patient: patientId,
    status: { $in: ['sent', 'dispensed'] },
    isValid: true,
    validUntil: { $gt: new Date() }
  })
  .populate('doctor', 'user specialization')
  .populate({
    path: 'doctor',
    populate: {
      path: 'user',
      select: 'firstName lastName'
    }
  })
  .sort({ createdAt: -1 });
};

// Static method to find expiring prescriptions
prescriptionSchema.statics.findExpiringPrescriptions = function(days = 7) {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + days);

  return this.find({
    status: { $in: ['sent', 'dispensed'] },
    isValid: true,
    validUntil: { $lte: expiryDate, $gt: new Date() }
  })
  .populate('patient', 'patientId user')
  .populate('doctor', 'user specialization')
  .sort({ validUntil: 1 });
};

// Static method to search prescriptions
prescriptionSchema.statics.searchPrescriptions = function(searchTerm, options = {}) {
  let query = {
    $text: { $search: searchTerm }
  };

  if (options.patientId) {
    query.patient = options.patientId;
  }

  if (options.doctorId) {
    query.doctor = options.doctorId;
  }

  if (options.status) {
    query.status = options.status;
  }

  if (options.validOnly) {
    query.isValid = true;
    query.validUntil = { $gt: new Date() };
  }

  return this.find(query, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' }, createdAt: -1 })
    .populate('patient', 'patientId user')
    .populate('doctor', 'user specialization');
};

// Instance method to add medication
prescriptionSchema.methods.addMedication = function(medicationData) {
  this.medications.push(medicationData);
  return this.save();
};

// Instance method to send prescription
prescriptionSchema.methods.sendToPharmacy = function(pharmacyData) {
  this.status = 'sent';
  this.pharmacy = pharmacyData;
  return this.save();
};

// Instance method to dispense medication
prescriptionSchema.methods.dispenseMedication = function(dispensingData) {
  this.status = 'dispensed';
  this.dispensingHistory.push(dispensingData);
  
  // Update dispensed quantities
  dispensingData.dispensedMedications.forEach(dispMed => {
    if (this.medications[dispMed.medicationIndex]) {
      this.medications[dispMed.medicationIndex].quantity.dispensed += dispMed.actualQuantity;
    }
  });

  return this.save();
};

// Instance method to cancel prescription
prescriptionSchema.methods.cancel = function(reason) {
  this.status = 'cancelled';
  this.isValid = false;
  this.cancellationReason = reason;
  return this.save();
};

// Instance method to refill medication
prescriptionSchema.methods.refillMedication = function(medicationIndex, quantity) {
  const medication = this.medications[medicationIndex];
  
  if (!medication) {
    throw new Error('Medication not found');
  }

  if (medication.refills.remaining <= 0) {
    throw new Error('No refills remaining');
  }

  if (this.isExpired) {
    throw new Error('Prescription has expired');
  }

  medication.refills.remaining -= 1;
  medication.quantity.dispensed += quantity;

  return this.save();
};

// Instance method to check drug interactions
prescriptionSchema.methods.checkInteractions = function() {
  const medications = this.medications.map(med => med.name.toLowerCase());
  const interactions = [];

  // This is a simplified interaction check
  // In a real system, this would integrate with a drug interaction database
  for (let i = 0; i < medications.length; i++) {
    for (let j = i + 1; j < medications.length; j++) {
      // Example: Check for common interactions
      if ((medications[i].includes('warfarin') && medications[j].includes('aspirin')) ||
          (medications[i].includes('aspirin') && medications[j].includes('warfarin'))) {
        interactions.push({
          medication1: this.medications[i].name,
          medication2: this.medications[j].name,
          severity: 'major',
          description: 'Increased risk of bleeding'
        });
      }
    }
  }

  return interactions;
};

// Instance method to validate prescription
prescriptionSchema.methods.validatePrescription = function() {
  const errors = [];

  // Check if expired
  if (this.isExpired) {
    errors.push('Prescription has expired');
  }

  // Check if valid
  if (!this.isValid) {
    errors.push('Prescription is not valid');
  }

  // Check if cancelled
  if (this.status === 'cancelled') {
    errors.push('Prescription has been cancelled');
  }

  // Check if medications have refills
  this.medications.forEach((med, index) => {
    if (med.refills.remaining <= 0 && med.status === 'active') {
      errors.push(`No refills remaining for ${med.name}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

module.exports = mongoose.model('Prescription', prescriptionSchema);