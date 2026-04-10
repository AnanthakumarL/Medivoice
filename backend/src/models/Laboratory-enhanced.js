const mongoose = require('mongoose');

const laboratorySchema = new mongoose.Schema({
  // Reference to User model
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required'],
    unique: true
  },
  
  // Laboratory Information (matching your DemoLab interface)
  labName: {
    type: String,
    required: [true, 'Laboratory name is required'],
    trim: true,
    maxlength: [100, 'Laboratory name cannot exceed 100 characters']
  },
  
  labCode: {
    type: String,
    required: [true, 'Laboratory code is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  
  // License and Certification
  licenseNumber: {
    type: String,
    required: [true, 'Laboratory license number is required'],
    unique: true,
    trim: true
  },
  
  accreditations: [{
    organization: {
      type: String,
      required: true,
      enum: ['CAP', 'CLIA', 'ISO-15189', 'NABL', 'AABB', 'Other']
    },
    certificateNumber: String,
    issueDate: Date,
    expiryDate: Date,
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  
  // Contact Information
  phone: {
    type: String,
    required: [true, 'Laboratory phone is required'],
    match: [/^\+?[\d\s\-\(\)]{10,}$/, 'Please enter a valid phone number']
  },
  
  email: {
    type: String,
    required: [true, 'Laboratory email is required'],
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  
  website: {
    type: String,
    match: [/^https?:\/\/.+/, 'Please enter a valid website URL']
  },
  
  // Address Information
  address: {
    street: {
      type: String,
      required: [true, 'Street address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    zipCode: {
      type: String,
      required: [true, 'ZIP code is required']
    },
    country: {
      type: String,
      default: 'USA'
    }
  },
  
  // Operating Hours
  operatingHours: {
    monday: {
      isOpen: { type: Boolean, default: true },
      openTime: { type: String, default: '08:00' },
      closeTime: { type: String, default: '18:00' }
    },
    tuesday: {
      isOpen: { type: Boolean, default: true },
      openTime: { type: String, default: '08:00' },
      closeTime: { type: String, default: '18:00' }
    },
    wednesday: {
      isOpen: { type: Boolean, default: true },
      openTime: { type: String, default: '08:00' },
      closeTime: { type: String, default: '18:00' }
    },
    thursday: {
      isOpen: { type: Boolean, default: true },
      openTime: { type: String, default: '08:00' },
      closeTime: { type: String, default: '18:00' }
    },
    friday: {
      isOpen: { type: Boolean, default: true },
      openTime: { type: String, default: '08:00' },
      closeTime: { type: String, default: '18:00' }
    },
    saturday: {
      isOpen: { type: Boolean, default: true },
      openTime: { type: String, default: '08:00' },
      closeTime: { type: String, default: '14:00' }
    },
    sunday: {
      isOpen: { type: Boolean, default: false },
      openTime: { type: String, default: '09:00' },
      closeTime: { type: String, default: '13:00' }
    }
  },
  
  // Services and Test Categories
  testCategories: [{
    category: {
      type: String,
      required: true,
      enum: [
        'Blood Chemistry', 'Hematology', 'Immunology', 'Microbiology',
        'Molecular Diagnostics', 'Pathology', 'Radiology', 'Cardiology',
        'Endocrinology', 'Toxicology', 'Genetics', 'Serology',
        'Clinical Chemistry', 'Urinalysis', 'Coagulation', 'Allergy Testing'
      ]
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    turnaroundTime: {
      min: Number, // in hours
      max: Number, // in hours
      urgent: Number // in hours for urgent tests
    }
  }],
  
  // Available Tests (detailed test menu)
  availableTests: [{
    testCode: {
      type: String,
      required: true
    },
    testName: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    description: String,
    sampleType: {
      type: String,
      required: true,
      enum: ['Blood', 'Urine', 'Stool', 'Saliva', 'Tissue', 'Swab', 'Other']
    },
    preparationInstructions: String,
    normalRange: {
      min: Number,
      max: Number,
      unit: String,
      notes: String
    },
    price: {
      type: Number,
      required: true
    },
    turnaroundTime: {
      regular: Number, // in hours
      urgent: Number   // in hours
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  
  // Equipment and Technology
  equipment: [{
    name: {
      type: String,
      required: true
    },
    manufacturer: String,
    model: String,
    installationDate: Date,
    lastMaintenanceDate: Date,
    nextMaintenanceDate: Date,
    status: {
      type: String,
      enum: ['operational', 'maintenance', 'out-of-service'],
      default: 'operational'
    },
    testTypes: [String] // Which tests this equipment can perform
  }],
  
  // Staff Information
  staff: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      required: true,
      enum: ['Lab Director', 'Pathologist', 'Lab Technician', 'Phlebotomist', 
             'Medical Technologist', 'Lab Assistant', 'Quality Manager']
    },
    certifications: [String],
    startDate: Date,
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  
  // Quality Control
  qualityMetrics: {
    accuracyRate: {
      type: Number,
      min: 0,
      max: 100,
      default: 99.5
    },
    turnaroundCompliance: {
      type: Number,
      min: 0,
      max: 100,
      default: 95
    },
    customerSatisfaction: {
      type: Number,
      min: 0,
      max: 5,
      default: 4.5
    },
    lastQualityAudit: Date,
    nextQualityAudit: Date
  },
  
  // Financial Information
  pricing: {
    discountPrograms: [{
      program: String,
      discountPercent: Number,
      eligibilityCriteria: String
    }],
    insuranceAccepted: [{
      provider: String,
      planTypes: [String]
    }],
    paymentMethods: [{
      type: String,
      enum: ['cash', 'credit-card', 'debit-card', 'insurance', 'check', 'online-payment']
    }]
  },
  
  // Sample Collection
  sampleCollection: {
    homeCollection: {
      isAvailable: {
        type: Boolean,
        default: false
      },
      serviceRadius: Number, // in miles
      additionalFee: Number,
      availableDays: [String],
      timeSlots: [String]
    },
    walkInAccepted: {
      type: Boolean,
      default: true
    },
    appointmentRequired: {
      type: Boolean,
      default: false
    }
  },
  
  // Digital Services
  digitalServices: {
    onlineReporting: {
      type: Boolean,
      default: true
    },
    mobileApp: {
      isAvailable: {
        type: Boolean,
        default: false
      },
      appName: String,
      downloadLinks: {
        ios: String,
        android: String
      }
    },
    emailNotifications: {
      type: Boolean,
      default: true
    },
    smsNotifications: {
      type: Boolean,
      default: false
    }
  },
  
  // Statistics and Analytics
  statistics: {
    totalTestsPerformed: {
      type: Number,
      default: 0
    },
    monthlyTestVolume: {
      type: Number,
      default: 0
    },
    averageTurnaroundTime: {
      type: Number,
      default: 24 // in hours
    },
    totalPatients: {
      type: Number,
      default: 0
    },
    revenue: {
      monthly: {
        type: Number,
        default: 0
      },
      yearly: {
        type: Number,
        default: 0
      }
    },
    popularTests: [{
      testCode: String,
      testName: String,
      count: Number
    }]
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
  
  // Status and Verification
  isVerified: {
    type: Boolean,
    default: false
  },
  
  verificationDate: Date,
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  isAcceptingNewOrders: {
    type: Boolean,
    default: true
  },
  
  emergencyServices: {
    type: Boolean,
    default: false
  },
  
  // Network and Partnerships
  partnerships: [{
    partner: {
      type: String,
      required: true
    },
    partnerType: {
      type: String,
      enum: ['Hospital', 'Clinic', 'Diagnostic Center', 'Reference Lab', 'Other']
    },
    startDate: Date,
    isActive: {
      type: Boolean,
      default: true
    }
  }]
  
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for user details
laboratorySchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

// Virtual for formatted address
laboratorySchema.virtual('formattedAddress').get(function() {
  const addr = this.address;
  return `${addr.street}, ${addr.city}, ${addr.state} ${addr.zipCode}`;
});

// Virtual for active test count
laboratorySchema.virtual('activeTestsCount').get(function() {
  return this.availableTests.filter(test => test.isActive).length;
});

// Virtual for operational equipment count
laboratorySchema.virtual('operationalEquipmentCount').get(function() {
  return this.equipment.filter(eq => eq.status === 'operational').length;
});

// Virtual for active staff count
laboratorySchema.virtual('activeStaffCount').get(function() {
  return this.staff.filter(member => member.isActive).length;
});

// Indexes (removing redundant unique indexes)
laboratorySchema.index({ 'address.city': 1 });
laboratorySchema.index({ 'address.state': 1 });
laboratorySchema.index({ 'address.zipCode': 1 });
laboratorySchema.index({ isVerified: 1 });
laboratorySchema.index({ isActive: 1 });
laboratorySchema.index({ isAcceptingNewOrders: 1 });
laboratorySchema.index({ 'rating.average': -1 });
laboratorySchema.index({ 'testCategories.category': 1 });

// Pre-save middleware to generate lab code if not provided
laboratorySchema.pre('save', async function(next) {
  if (this.isNew && !this.labCode) {
    const count = await this.constructor.countDocuments();
    this.labCode = `LAB${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Pre-save middleware to populate user if not populated
laboratorySchema.pre(/^find/, function(next) {
  this.populate({
    path: 'userId',
    select: 'firstName lastName email phone avatar'
  });
  next();
});

// Instance method to check if lab is open
laboratorySchema.methods.isOpenAt = function(dateTime) {
  const date = new Date(dateTime);
  const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][date.getDay()];
  const timeString = date.toTimeString().substring(0, 5); // HH:MM format
  
  const dayHours = this.operatingHours[dayOfWeek];
  
  if (!dayHours.isOpen) {
    return false;
  }
  
  return timeString >= dayHours.openTime && timeString <= dayHours.closeTime;
};

// Instance method to check if test is available
laboratorySchema.methods.hasTest = function(testCode) {
  return this.availableTests.some(test => 
    test.testCode === testCode && test.isActive
  );
};

// Instance method to get test by code
laboratorySchema.methods.getTest = function(testCode) {
  return this.availableTests.find(test => 
    test.testCode === testCode && test.isActive
  );
};

// Instance method to update rating
laboratorySchema.methods.updateRating = function(newRating) {
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

// Instance method to add test result
laboratorySchema.methods.addTestResult = function(testData) {
  // Update statistics
  this.statistics.totalTestsPerformed += 1;
  this.statistics.monthlyTestVolume += 1;
  
  // Update popular tests
  const existingTest = this.statistics.popularTests.find(t => t.testCode === testData.testCode);
  if (existingTest) {
    existingTest.count += 1;
  } else {
    this.statistics.popularTests.push({
      testCode: testData.testCode,
      testName: testData.testName,
      count: 1
    });
  }
  
  return this.save();
};

// Static method to find labs by test category
laboratorySchema.statics.findByTestCategory = function(category) {
  return this.find({ 
    'testCategories.category': category,
    'testCategories.isAvailable': true,
    isVerified: true,
    isActive: true
  }).populate('userId', 'firstName lastName email phone');
};

// Static method to find labs by location
laboratorySchema.statics.findByLocation = function(city, state) {
  const query = { isVerified: true, isActive: true };
  
  if (city) {
    query['address.city'] = new RegExp(city, 'i');
  }
  
  if (state) {
    query['address.state'] = new RegExp(state, 'i');
  }
  
  return this.find(query).populate('userId', 'firstName lastName email phone');
};

// Static method to find top-rated labs
laboratorySchema.statics.findTopRated = function(limit = 10) {
  return this.find({ 
    isVerified: true,
    isActive: true 
  })
    .sort({ 'rating.average': -1, 'rating.totalReviews': -1 })
    .limit(limit)
    .populate('userId', 'firstName lastName email phone');
};

// Static method to find labs accepting new orders
laboratorySchema.statics.findAcceptingOrders = function() {
  return this.find({ 
    isAcceptingNewOrders: true,
    isVerified: true,
    isActive: true 
  }).populate('userId', 'firstName lastName email phone');
};

module.exports = mongoose.model('Laboratory', laboratorySchema);