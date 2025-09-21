const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
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
  recordType: {
    type: String,
    required: [true, 'Record type is required'],
    enum: ['consultation', 'diagnosis', 'treatment', 'lab-result', 'imaging', 'procedure', 'discharge-summary', 'referral'],
    default: 'consultation'
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  visitDetails: {
    chiefComplaint: {
      type: String,
      trim: true
    },
    historyOfPresentIllness: {
      type: String,
      trim: true
    },
    reviewOfSystems: {
      constitutional: String,
      cardiovascular: String,
      respiratory: String,
      gastrointestinal: String,
      genitourinary: String,
      musculoskeletal: String,
      neurological: String,
      psychiatric: String,
      dermatological: String,
      endocrine: String
    },
    physicalExamination: {
      general: String,
      vitals: {
        bloodPressure: String,
        heartRate: String,
        temperature: String,
        respiratoryRate: String,
        oxygenSaturation: String,
        weight: String,
        height: String,
        bmi: String
      },
      heent: String, // Head, Eyes, Ears, Nose, Throat
      cardiovascular: String,
      respiratory: String,
      abdominal: String,
      extremities: String,
      neurological: String,
      psychiatric: String,
      skin: String
    }
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
    },
    type: {
      type: String,
      enum: ['primary', 'secondary', 'differential', 'rule-out'],
      default: 'primary'
    },
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe', 'critical']
    },
    status: {
      type: String,
      enum: ['active', 'resolved', 'chronic', 'recurrent'],
      default: 'active'
    },
    onsetDate: Date,
    notes: String
  }],
  treatmentPlan: {
    medications: [{
      name: String,
      dosage: String,
      frequency: String,
      duration: String,
      instructions: String
    }],
    procedures: [{
      name: String,
      scheduledDate: Date,
      provider: String,
      instructions: String
    }],
    therapies: [{
      type: String,
      frequency: String,
      duration: String,
      provider: String,
      instructions: String
    }],
    lifestyle: [{
      recommendation: String,
      category: {
        type: String,
        enum: ['diet', 'exercise', 'smoking', 'alcohol', 'sleep', 'stress', 'other']
      }
    }],
    followUp: {
      timeframe: String,
      reason: String,
      provider: String,
      instructions: String
    }
  },
  labResults: [{
    testName: {
      type: String,
      required: true
    },
    testCode: String,
    result: String,
    referenceRange: String,
    unit: String,
    abnormalFlag: {
      type: String,
      enum: ['normal', 'high', 'low', 'critical-high', 'critical-low']
    },
    testDate: Date,
    labFacility: String,
    interpretation: String
  }],
  imagingResults: [{
    studyType: {
      type: String,
      required: true
    },
    bodyPart: String,
    findings: String,
    impression: String,
    recommendation: String,
    studyDate: Date,
    radiologist: String,
    facility: String,
    imageUrls: [String]
  }],
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
    frequency: String,
    onset: {
      type: String,
      enum: ['acute', 'gradual', 'chronic']
    },
    qualityCharacter: String,
    location: String,
    radiationPattern: String,
    aggravatingFactors: [String],
    relievingFactors: [String],
    associatedSymptoms: [String],
    notes: String
  }],
  doctorNotes: {
    clinical: String,
    differential: String,
    plan: String,
    counseling: String,
    education: String,
    private: String
  },
  followUpInstructions: {
    instructions: String,
    timeframe: String,
    urgency: {
      type: String,
      enum: ['routine', 'urgent', 'emergent']
    },
    warnings: [String],
    restrictions: [String]
  },
  attachments: [{
    fileName: String,
    fileUrl: String,
    fileType: String,
    fileSize: Number,
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    description: String
  }],
  isConfidential: {
    type: Boolean,
    default: false
  },
  accessLevel: {
    type: String,
    enum: ['public', 'restricted', 'confidential'],
    default: 'public'
  },
  sharedWith: [{
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor'
    },
    sharedAt: {
      type: Date,
      default: Date.now
    },
    permissions: {
      type: String,
      enum: ['read', 'read-write'],
      default: 'read'
    }
  }],
  status: {
    type: String,
    enum: ['draft', 'final', 'amended', 'cancelled'],
    default: 'draft'
  },
  version: {
    type: Number,
    default: 1
  },
  previousVersion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MedicalRecord'
  },
  amendmentReason: String,
  reviewedBy: [{
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor'
    },
    reviewedAt: {
      type: Date,
      default: Date.now
    },
    comments: String
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for record age
medicalRecordSchema.virtual('recordAge').get(function() {
  const now = new Date();
  const created = this.createdAt;
  const diffTime = Math.abs(now - created);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 30) return `${diffDays} days ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
});

// Indexes
medicalRecordSchema.index({ patient: 1 });
medicalRecordSchema.index({ doctor: 1 });
medicalRecordSchema.index({ appointment: 1 });
medicalRecordSchema.index({ recordType: 1 });
medicalRecordSchema.index({ status: 1 });
medicalRecordSchema.index({ createdAt: -1 });
medicalRecordSchema.index({ isConfidential: 1 });

// Compound indexes
medicalRecordSchema.index({ patient: 1, createdAt: -1 });
medicalRecordSchema.index({ patient: 1, recordType: 1 });
medicalRecordSchema.index({ doctor: 1, createdAt: -1 });
medicalRecordSchema.index({ patient: 1, status: 1, createdAt: -1 });

// Text index for search
medicalRecordSchema.index({
  title: 'text',
  description: 'text',
  'diagnosis.condition': 'text',
  'doctorNotes.clinical': 'text'
});

// Static method to find records by patient
medicalRecordSchema.statics.findByPatient = function(patientId, options = {}) {
  let query = this.find({ patient: patientId, status: { $ne: 'cancelled' } })
    .populate('doctor', 'user specialization department')
    .populate({
      path: 'doctor',
      populate: {
        path: 'user',
        select: 'firstName lastName'
      }
    })
    .populate('appointment', 'scheduledTime appointmentType');

  if (options.recordType) {
    query = query.where({ recordType: options.recordType });
  }

  if (options.startDate && options.endDate) {
    query = query.where({
      createdAt: {
        $gte: new Date(options.startDate),
        $lte: new Date(options.endDate)
      }
    });
  }

  if (options.isConfidential !== undefined) {
    query = query.where({ isConfidential: options.isConfidential });
  }

  return query.sort({ createdAt: -1 });
};

// Static method to search records
medicalRecordSchema.statics.searchRecords = function(searchTerm, patientId = null, options = {}) {
  let query = {
    $text: { $search: searchTerm },
    status: { $ne: 'cancelled' }
  };

  if (patientId) {
    query.patient = patientId;
  }

  if (options.recordType) {
    query.recordType = options.recordType;
  }

  return this.find(query, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' }, createdAt: -1 })
    .populate('doctor', 'user specialization')
    .populate('patient', 'patientId user');
};

// Instance method to add diagnosis
medicalRecordSchema.methods.addDiagnosis = function(diagnosisData) {
  this.diagnosis.push(diagnosisData);
  return this.save();
};

// Instance method to finalize record
medicalRecordSchema.methods.finalize = function() {
  this.status = 'final';
  return this.save();
};

// Instance method to amend record
medicalRecordSchema.methods.amend = function(amendments, reason) {
  const amendedRecord = new this.constructor({
    ...this.toObject(),
    _id: new mongoose.Types.ObjectId(),
    previousVersion: this._id,
    amendmentReason: reason,
    version: this.version + 1,
    status: 'draft',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...amendments
  });

  this.status = 'amended';
  return Promise.all([this.save(), amendedRecord.save()]);
};

// Instance method to share with doctor
medicalRecordSchema.methods.shareWithDoctor = function(doctorId, permissions = 'read') {
  const existingShare = this.sharedWith.find(share => 
    share.doctor.toString() === doctorId.toString()
  );

  if (existingShare) {
    existingShare.permissions = permissions;
    existingShare.sharedAt = new Date();
  } else {
    this.sharedWith.push({
      doctor: doctorId,
      permissions: permissions
    });
  }

  return this.save();
};

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);