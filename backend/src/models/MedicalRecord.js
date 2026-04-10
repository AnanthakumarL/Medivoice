const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  // Record Identification
  recordId: {
    type: String,
    trim: true,
    uppercase: true
  },
  
  // Core References
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Patient reference is required'],
    index: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: [true, 'Doctor reference is required']
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  
  // Record Type and Classification
  recordType: {
    type: String,
    enum: [
      'consultation',
      'diagnosis',
      'treatment',
      'surgery',
      'emergency',
      'follow-up',
      'lab-result',
      'imaging',
      'vaccination',
      'procedure',
      'therapy',
      'discharge',
      'referral',
      'other'
    ],
    required: [true, 'Record type is required'],
    default: 'consultation'
  },
  
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'critical'],
    default: 'normal'
  },
  
  confidentialityLevel: {
    type: String,
    enum: ['normal', 'restricted', 'confidential', 'highly-confidential'],
    default: 'normal'
  },
  
  // Visit Information
  visitInfo: {
    visitDate: {
      type: Date,
      required: [true, 'Visit date is required'],
      index: true
    },
    visitTime: {
      type: String,
      trim: true
    },
    visitType: {
      type: String,
      enum: ['in-person', 'telemedicine', 'phone', 'home-visit'],
      default: 'in-person'
    },
    duration: {
      type: Number,
      min: 0
    },
    location: {
      facility: String,
      department: String,
      room: String,
      address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: { type: String, default: 'USA' }
      }
    }
  },
  
  // Chief Complaint and History
  chiefComplaint: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  
  historyOfPresentIllness: {
    type: String,
    trim: true,
    maxlength: 5000
  },
  
  symptoms: [{
    symptom: {
      type: String,
      required: true,
      trim: true
    },
    onset: {
      type: String,
      trim: true
    },
    duration: {
      type: String,
      trim: true
    },
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe'],
      default: 'mild'
    },
    frequency: {
      type: String,
      trim: true
    },
    triggers: [{
      type: String,
      trim: true
    }],
    alleviatingFactors: [{
      type: String,
      trim: true
    }],
    associatedSymptoms: [{
      type: String,
      trim: true
    }],
    notes: {
      type: String,
      trim: true
    }
  }],
  
  // Review of Systems
  reviewOfSystems: {
    constitutional: {
      fever: Boolean,
      chills: Boolean,
      nightSweats: Boolean,
      weightLoss: Boolean,
      weightGain: Boolean,
      fatigue: Boolean,
      notes: String
    },
    cardiovascular: {
      chestPain: Boolean,
      palpitations: Boolean,
      dyspnea: Boolean,
      orthopnea: Boolean,
      edema: Boolean,
      notes: String
    },
    respiratory: {
      cough: Boolean,
      sputum: Boolean,
      dyspnea: Boolean,
      wheezing: Boolean,
      chestPain: Boolean,
      notes: String
    },
    gastrointestinal: {
      nausea: Boolean,
      vomiting: Boolean,
      diarrhea: Boolean,
      constipation: Boolean,
      abdominalPain: Boolean,
      notes: String
    },
    genitourinary: {
      dysuria: Boolean,
      frequency: Boolean,
      urgency: Boolean,
      hematuria: Boolean,
      incontinence: Boolean,
      notes: String
    },
    neurological: {
      headache: Boolean,
      dizziness: Boolean,
      weakness: Boolean,
      numbness: Boolean,
      seizures: Boolean,
      notes: String
    },
    musculoskeletal: {
      jointPain: Boolean,
      muscleWeakness: Boolean,
      backPain: Boolean,
      stiffness: Boolean,
      swelling: Boolean,
      notes: String
    },
    psychiatric: {
      depression: Boolean,
      anxiety: Boolean,
      insomnia: Boolean,
      memoryLoss: Boolean,
      notes: String
    }
  },
  
  // Physical Examination
  physicalExamination: {
    vitalSigns: {
      bloodPressure: {
        systolic: Number,
        diastolic: Number,
        position: { type: String, enum: ['sitting', 'standing', 'lying'], default: 'sitting' }
      },
      heartRate: {
        rate: Number,
        rhythm: { type: String, enum: ['regular', 'irregular'], default: 'regular' }
      },
      respiratoryRate: Number,
      temperature: {
        value: Number,
        unit: { type: String, enum: ['celsius', 'fahrenheit'], default: 'fahrenheit' },
        site: { type: String, enum: ['oral', 'rectal', 'axillary', 'temporal'], default: 'oral' }
      },
      oxygenSaturation: {
        value: Number,
        onAir: { type: Boolean, default: true },
        oxygenFlow: Number
      },
      height: {
        value: Number,
        unit: { type: String, enum: ['inches', 'cm'], default: 'inches' }
      },
      weight: {
        value: Number,
        unit: { type: String, enum: ['lbs', 'kg'], default: 'lbs' }
      },
      bmi: Number,
      painScale: {
        type: Number,
        min: 0,
        max: 10
      }
    },
    
    generalAppearance: {
      type: String,
      trim: true
    },
    
    head: {
      type: String,
      trim: true
    },
    eyes: {
      type: String,
      trim: true
    },
    ears: {
      type: String,
      trim: true
    },
    nose: {
      type: String,
      trim: true
    },
    throat: {
      type: String,
      trim: true
    },
    neck: {
      type: String,
      trim: true
    },
    cardiovascular: {
      type: String,
      trim: true
    },
    respiratory: {
      type: String,
      trim: true
    },
    abdomen: {
      type: String,
      trim: true
    },
    extremities: {
      type: String,
      trim: true
    },
    neurological: {
      type: String,
      trim: true
    },
    psychiatric: {
      type: String,
      trim: true
    },
    skin: {
      type: String,
      trim: true
    }
  },
  
  // Assessment and Diagnosis
  assessment: {
    clinicalImpression: {
      type: String,
      trim: true,
      maxlength: 2000
    },
    
    diagnoses: [{
      code: {
        icd10: String,
        icd9: String,
        snomed: String
      },
      description: {
        type: String,
        required: true,
        trim: true
      },
      type: {
        type: String,
        enum: ['primary', 'secondary', 'differential', 'working', 'rule-out'],
        default: 'primary'
      },
      certainty: {
        type: String,
        enum: ['confirmed', 'probable', 'possible', 'ruled-out'],
        default: 'confirmed'
      },
      onset: Date,
      severity: {
        type: String,
        enum: ['mild', 'moderate', 'severe'],
        default: 'mild'
      },
      status: {
        type: String,
        enum: ['active', 'inactive', 'resolved', 'chronic'],
        default: 'active'
      },
      notes: {
        type: String,
        trim: true
      }
    }],
    
    differentialDiagnosis: [{
      diagnosis: String,
      probability: {
        type: String,
        enum: ['high', 'medium', 'low']
      },
      reasoning: String
    }]
  },
  
  // Treatment Plan
  treatmentPlan: {
    immediateActions: [{
      action: {
        type: String,
        required: true,
        trim: true
      },
      priority: {
        type: String,
        enum: ['immediate', 'urgent', 'routine'],
        default: 'routine'
      },
      status: {
        type: String,
        enum: ['planned', 'in-progress', 'completed', 'cancelled'],
        default: 'planned'
      },
      notes: String
    }],
    
    medications: [{
      name: {
        type: String,
        required: true,
        trim: true
      },
      genericName: String,
      dosage: {
        type: String,
        required: true,
        trim: true
      },
      route: {
        type: String,
        enum: ['oral', 'IV', 'IM', 'topical', 'inhaled', 'rectal', 'sublingual'],
        default: 'oral'
      },
      frequency: {
        type: String,
        required: true,
        trim: true
      },
      duration: String,
      startDate: {
        type: Date,
        default: Date.now
      },
      endDate: Date,
      purpose: String,
      instructions: String,
      sideEffects: [String],
      contraindications: [String],
      prescriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prescription'
      }
    }],
    
    procedures: [{
      name: {
        type: String,
        required: true,
        trim: true
      },
      code: {
        cpt: String,
        icd10: String
      },
      scheduledDate: Date,
      status: {
        type: String,
        enum: ['scheduled', 'completed', 'cancelled', 'pending'],
        default: 'scheduled'
      },
      provider: String,
      location: String,
      instructions: String,
      notes: String
    }],
    
    followUpInstructions: {
      type: String,
      trim: true,
      maxlength: 2000
    },
    
    nextAppointment: {
      recommended: Boolean,
      timeframe: String,
      reason: String,
      specialty: String,
      urgency: {
        type: String,
        enum: ['routine', 'urgent', 'stat'],
        default: 'routine'
      }
    }
  },
  
  // Laboratory and Diagnostic Tests
  labResults: [{
    testName: {
      type: String,
      required: true,
      trim: true
    },
    testCode: String,
    orderDate: Date,
    collectionDate: Date,
    resultDate: Date,
    results: [{
      parameter: String,
      value: String,
      unit: String,
      referenceRange: String,
      flag: {
        type: String,
        enum: ['normal', 'high', 'low', 'critical', 'abnormal']
      },
      notes: String
    }],
    interpretation: String,
    abnormalFindings: [String],
    clinicalSignificance: String,
    orderedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor'
    },
    laboratoryInfo: {
      name: String,
      address: String,
      phone: String
    }
  }],
  
  imagingStudies: [{
    studyType: {
      type: String,
      required: true,
      trim: true
    },
    bodyPart: String,
    indication: String,
    orderDate: Date,
    studyDate: Date,
    reportDate: Date,
    findings: String,
    impression: String,
    recommendations: String,
    radiologist: String,
    facility: String,
    technique: String,
    contrast: {
      used: Boolean,
      type: String,
      amount: String
    },
    images: [{
      filename: String,
      description: String,
      uploadDate: { type: Date, default: Date.now }
    }]
  }],
  
  // Referrals
  referrals: [{
    specialty: {
      type: String,
      required: true,
      trim: true
    },
    referredTo: {
      doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
      },
      facility: String,
      contactInfo: {
        phone: String,
        email: String,
        address: String
      }
    },
    reason: {
      type: String,
      required: true,
      trim: true
    },
    urgency: {
      type: String,
      enum: ['routine', 'urgent', 'stat'],
      default: 'routine'
    },
    status: {
      type: String,
      enum: ['pending', 'scheduled', 'completed', 'cancelled'],
      default: 'pending'
    },
    notes: String,
    referralDate: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Patient Education and Instructions
  patientEducation: {
    educationProvided: [{
      topic: String,
      materials: [String],
      understanding: {
        type: String,
        enum: ['excellent', 'good', 'fair', 'poor']
      },
      questions: [String]
    }],
    
    dischargeSummary: {
      condition: String,
      instructions: String,
      medications: String,
      followUp: String,
      warningSignsToReport: [String],
      activityRestrictions: String,
      dietaryInstructions: String
    },
    
    preventiveCare: {
      screeningsDiscussed: [String],
      immunizationsDiscussed: [String],
      lifestyleModifications: [String]
    }
  },
  
  // Legal and Administrative
  consent: {
    treatmentConsent: {
      obtained: Boolean,
      date: Date,
      witness: String
    },
    informedConsent: {
      obtained: Boolean,
      date: Date,
      procedureName: String,
      risksDiscussed: [String],
      alternativesDiscussed: [String]
    }
  },
  
  // Quality Metrics
  qualityMetrics: {
    documentationCompleteness: {
      type: Number,
      min: 0,
      max: 100
    },
    codeAccuracy: Boolean,
    timeToDocument: Number,
    reviewStatus: {
      type: String,
      enum: ['pending', 'reviewed', 'approved', 'requires-revision'],
      default: 'pending'
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewDate: Date
  },
  
  // Access Control
  accessLog: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    action: {
      type: String,
      enum: ['view', 'edit', 'create', 'delete', 'export', 'print'],
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    ipAddress: String,
    userAgent: String,
    reason: String
  }],
  
  // Status and Metadata
  status: {
    type: String,
    enum: ['draft', 'in-progress', 'completed', 'reviewed', 'amended', 'locked'],
    default: 'draft'
  },
  
  version: {
    type: Number,
    default: 1
  },
  
  amendments: [{
    date: {
      type: Date,
      default: Date.now
    },
    amendedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String,
    changes: String,
    originalValue: String,
    newValue: String
  }],
  
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
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
medicalRecordSchema.index({ patient: 1, 'visitInfo.visitDate': -1 });
medicalRecordSchema.index({ doctor: 1, 'visitInfo.visitDate': -1 });
medicalRecordSchema.index({ recordId: 1 }, { unique: true, sparse: true });
medicalRecordSchema.index({ recordType: 1 });
medicalRecordSchema.index({ 'assessment.diagnoses.code.icd10': 1 });
medicalRecordSchema.index({ 'visitInfo.visitDate': -1 });

// Virtual properties
medicalRecordSchema.virtual('isRecent').get(function() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return this.visitInfo.visitDate > thirtyDaysAgo;
});

medicalRecordSchema.virtual('primaryDiagnosis').get(function() {
  if (this.assessment && this.assessment.diagnoses) {
    const primary = this.assessment.diagnoses.find(d => d.type === 'primary');
    return primary ? primary.description : null;
  }
  return null;
});

medicalRecordSchema.virtual('isEmergency').get(function() {
  return this.recordType === 'emergency' || this.priority === 'critical';
});

medicalRecordSchema.virtual('daysOld').get(function() {
  const now = new Date();
  const visitDate = this.visitInfo.visitDate;
  return Math.floor((now - visitDate) / (1000 * 60 * 60 * 24));
});

// Pre-save middleware
medicalRecordSchema.pre('save', async function(next) {
  if (!this.recordId) {
    const count = await this.constructor.countDocuments();
    this.recordId = `MR${String(count + 1).padStart(8, '0')}`;
  }
  
  // Calculate BMI if height and weight are provided
  if (this.physicalExamination && 
      this.physicalExamination.vitalSigns && 
      this.physicalExamination.vitalSigns.height && 
      this.physicalExamination.vitalSigns.weight) {
    
    const vital = this.physicalExamination.vitalSigns;
    let weightInKg = vital.weight.value;
    let heightInM = vital.height.value;
    
    // Convert to metric if needed
    if (vital.weight.unit === 'lbs') {
      weightInKg = weightInKg * 0.453592;
    }
    if (vital.height.unit === 'inches') {
      heightInM = heightInM * 0.0254;
    }
    
    vital.bmi = Math.round((weightInKg / (heightInM * heightInM)) * 100) / 100;
  }
  
  next();
});

// Instance methods
medicalRecordSchema.methods.addDiagnosis = function(diagnosisData) {
  if (!this.assessment) {
    this.assessment = { diagnoses: [] };
  }
  if (!this.assessment.diagnoses) {
    this.assessment.diagnoses = [];
  }
  this.assessment.diagnoses.push(diagnosisData);
  return this.save();
};

medicalRecordSchema.methods.addLabResult = function(labData) {
  this.labResults.push(labData);
  return this.save();
};

medicalRecordSchema.methods.addMedication = function(medicationData) {
  if (!this.treatmentPlan) {
    this.treatmentPlan = { medications: [] };
  }
  if (!this.treatmentPlan.medications) {
    this.treatmentPlan.medications = [];
  }
  this.treatmentPlan.medications.push(medicationData);
  return this.save();
};

medicalRecordSchema.methods.addReferral = function(referralData) {
  this.referrals.push(referralData);
  return this.save();
};

medicalRecordSchema.methods.logAccess = function(userId, action, details = {}) {
  this.accessLog.push({
    user: userId,
    action: action,
    timestamp: new Date(),
    ipAddress: details.ipAddress,
    userAgent: details.userAgent,
    reason: details.reason
  });
  return this.save();
};

medicalRecordSchema.methods.amend = function(amendmentData, amendedBy) {
  this.amendments.push({
    date: new Date(),
    amendedBy: amendedBy,
    reason: amendmentData.reason,
    changes: amendmentData.changes,
    originalValue: amendmentData.originalValue,
    newValue: amendmentData.newValue
  });
  this.version += 1;
  this.lastModifiedBy = amendedBy;
  return this.save();
};

medicalRecordSchema.methods.complete = function(completedBy) {
  this.status = 'completed';
  this.lastModifiedBy = completedBy;
  return this.save();
};

medicalRecordSchema.methods.lock = function(lockedBy) {
  this.status = 'locked';
  this.lastModifiedBy = lockedBy;
  return this.save();
};

// Static methods
medicalRecordSchema.statics.findByRecordId = function(recordId) {
  return this.findOne({ recordId: recordId.toUpperCase() })
    .populate('patient doctor appointment');
};

medicalRecordSchema.statics.findByPatient = function(patientId, limit = 50) {
  return this.find({ patient: patientId })
    .sort({ 'visitInfo.visitDate': -1 })
    .limit(limit)
    .populate('doctor');
};

medicalRecordSchema.statics.findByDoctor = function(doctorId, startDate, endDate) {
  const query = { doctor: doctorId };
  if (startDate && endDate) {
    query['visitInfo.visitDate'] = { $gte: startDate, $lte: endDate };
  }
  return this.find(query)
    .sort({ 'visitInfo.visitDate': -1 })
    .populate('patient');
};

medicalRecordSchema.statics.findByDiagnosis = function(diagnosisCode) {
  return this.find({
    $or: [
      { 'assessment.diagnoses.code.icd10': diagnosisCode },
      { 'assessment.diagnoses.code.icd9': diagnosisCode }
    ]
  }).populate('patient doctor');
};

medicalRecordSchema.statics.findEmergencyRecords = function(startDate, endDate) {
  const query = {
    $or: [
      { recordType: 'emergency' },
      { priority: 'critical' }
    ]
  };
  
  if (startDate && endDate) {
    query['visitInfo.visitDate'] = { $gte: startDate, $lte: endDate };
  }
  
  return this.find(query)
    .sort({ 'visitInfo.visitDate': -1 })
    .populate('patient doctor');
};

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);