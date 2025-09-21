const Joi = require('joi');
const { formatValidationErrors } = require('./errorHandler');

/**
 * Custom validation messages
 */
const customMessages = {
  'string.email': 'Please provide a valid email address',
  'string.min': '{{#label}} must be at least {{#limit}} characters long',
  'string.max': '{{#label}} must be less than {{#limit}} characters long',
  'any.required': '{{#label}} is required',
  'string.pattern.base': '{{#label}} format is invalid',
  'number.min': '{{#label}} must be at least {{#limit}}',
  'number.max': '{{#label}} must be less than {{#limit}}',
  'date.base': '{{#label}} must be a valid date',
  'array.min': '{{#label}} must contain at least {{#limit}} items'
};

/**
 * Common validation schemas
 */
const commonSchemas = {
  objectId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('Invalid ID format'),
  email: Joi.string().email().lowercase().trim(),
  password: Joi.string().min(8).max(128).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .message('Password must contain at least 8 characters with uppercase, lowercase, number and special character'),
  phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).message('Invalid phone number format'),
  name: Joi.string().min(2).max(50).trim().pattern(/^[a-zA-Z\s]+$/).message('Name can only contain letters and spaces'),
  date: Joi.date().iso(),
  positiveNumber: Joi.number().positive(),
  pagination: {
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10)
  }
};

/**
 * User validation schemas
 */
const userValidation = {
  register: Joi.object({
    firstName: commonSchemas.name.required(),
    lastName: commonSchemas.name.required(),
    email: commonSchemas.email.required(),
    password: commonSchemas.password.required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required()
      .messages({ 'any.only': 'Passwords do not match' }),
    role: Joi.string().valid('patient', 'doctor', 'admin', 'staff').default('patient'),
    phone: commonSchemas.phone,
    dateOfBirth: commonSchemas.date,
    gender: Joi.string().valid('male', 'female', 'other'),
    termsAccepted: Joi.boolean().valid(true).required()
      .messages({ 'any.only': 'You must accept the terms and conditions' })
  }),

  login: Joi.object({
    email: commonSchemas.email.required(),
    password: Joi.string().required(),
    rememberMe: Joi.boolean().default(false)
  }),

  forgotPassword: Joi.object({
    email: commonSchemas.email.required()
  }),

  resetPassword: Joi.object({
    token: Joi.string().required(),
    password: commonSchemas.password.required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required()
      .messages({ 'any.only': 'Passwords do not match' })
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: commonSchemas.password.required(),
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required()
      .messages({ 'any.only': 'Passwords do not match' })
  }),

  updateProfile: Joi.object({
    firstName: commonSchemas.name,
    lastName: commonSchemas.name,
    phone: commonSchemas.phone,
    dateOfBirth: commonSchemas.date,
    gender: Joi.string().valid('male', 'female', 'other'),
    address: Joi.object({
      street: Joi.string().max(200),
      city: Joi.string().max(100),
      state: Joi.string().max(100),
      zipCode: Joi.string().max(20),
      country: Joi.string().max(100)
    })
  })
};

/**
 * Doctor validation schemas
 */
const doctorValidation = {
  profile: Joi.object({
    specialization: Joi.string().required().max(100),
    licenseNumber: Joi.string().required().max(50),
    department: Joi.string().max(100),
    qualification: Joi.array().items(Joi.object({
      degree: Joi.string().required().max(100),
      institution: Joi.string().required().max(200),
      year: Joi.number().integer().min(1950).max(new Date().getFullYear())
    })),
    experience: Joi.number().integer().min(0).max(70),
    consultationFee: commonSchemas.positiveNumber,
    availability: Joi.object({
      monday: Joi.object({
        isAvailable: Joi.boolean(),
        slots: Joi.array().items(Joi.object({
          startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
          endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        }))
      }),
      tuesday: Joi.object({
        isAvailable: Joi.boolean(),
        slots: Joi.array().items(Joi.object({
          startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
          endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        }))
      }),
      wednesday: Joi.object({
        isAvailable: Joi.boolean(),
        slots: Joi.array().items(Joi.object({
          startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
          endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        }))
      }),
      thursday: Joi.object({
        isAvailable: Joi.boolean(),
        slots: Joi.array().items(Joi.object({
          startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
          endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        }))
      }),
      friday: Joi.object({
        isAvailable: Joi.boolean(),
        slots: Joi.array().items(Joi.object({
          startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
          endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        }))
      }),
      saturday: Joi.object({
        isAvailable: Joi.boolean(),
        slots: Joi.array().items(Joi.object({
          startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
          endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        }))
      }),
      sunday: Joi.object({
        isAvailable: Joi.boolean(),
        slots: Joi.array().items(Joi.object({
          startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
          endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        }))
      })
    })
  }),

  search: Joi.object({
    specialization: Joi.string().max(100),
    location: Joi.string().max(100),
    rating: Joi.number().min(1).max(5),
    fee: Joi.object({
      min: commonSchemas.positiveNumber,
      max: commonSchemas.positiveNumber
    }),
    ...commonSchemas.pagination
  })
};

/**
 * Patient validation schemas
 */
const patientValidation = {
  profile: Joi.object({
    emergencyContact: Joi.object({
      name: commonSchemas.name.required(),
      relationship: Joi.string().required().max(50),
      phone: commonSchemas.phone.required(),
      email: commonSchemas.email
    }),
    insuranceInfo: Joi.object({
      provider: Joi.string().max(100),
      policyNumber: Joi.string().max(50),
      groupNumber: Joi.string().max(50),
      expiryDate: commonSchemas.date
    }),
    medicalHistory: Joi.object({
      allergies: Joi.array().items(Joi.object({
        allergen: Joi.string().required().max(100),
        severity: Joi.string().valid('mild', 'moderate', 'severe').required(),
        reaction: Joi.string().max(200)
      })),
      medications: Joi.array().items(Joi.object({
        name: Joi.string().required().max(100),
        dosage: Joi.string().max(50),
        frequency: Joi.string().max(50),
        prescribedBy: Joi.string().max(100)
      })),
      chronicConditions: Joi.array().items(Joi.object({
        condition: Joi.string().required().max(100),
        diagnosedDate: commonSchemas.date,
        status: Joi.string().valid('active', 'managed', 'resolved')
      })),
      surgeries: Joi.array().items(Joi.object({
        procedure: Joi.string().required().max(200),
        date: commonSchemas.date.required(),
        hospital: Joi.string().max(200),
        surgeon: Joi.string().max(100)
      }))
    }),
    vitals: Joi.object({
      height: commonSchemas.positiveNumber,
      weight: commonSchemas.positiveNumber,
      bloodType: Joi.string().valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
    })
  }),

  updateVitals: Joi.object({
    bloodPressure: Joi.object({
      systolic: Joi.number().min(70).max(300),
      diastolic: Joi.number().min(40).max(200)
    }),
    heartRate: Joi.number().min(30).max(250),
    temperature: Joi.number().min(90).max(115),
    weight: commonSchemas.positiveNumber,
    height: commonSchemas.positiveNumber,
    oxygenSaturation: Joi.number().min(70).max(100)
  })
};

/**
 * Appointment validation schemas
 */
const appointmentValidation = {
  create: Joi.object({
    doctor: commonSchemas.objectId.required(),
    patient: commonSchemas.objectId.required(),
    scheduledTime: commonSchemas.date.required(),
    appointmentType: Joi.string().valid('consultation', 'follow-up', 'emergency', 'checkup').required(),
    reason: Joi.string().required().max(500),
    notes: Joi.string().max(1000),
    duration: Joi.number().integer().min(15).max(180).default(30)
  }),

  update: Joi.object({
    scheduledTime: commonSchemas.date,
    status: Joi.string().valid('scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'),
    reason: Joi.string().max(500),
    notes: Joi.string().max(1000),
    cancellationReason: Joi.string().max(200)
  }),

  search: Joi.object({
    doctor: commonSchemas.objectId,
    patient: commonSchemas.objectId,
    status: Joi.string().valid('scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'),
    appointmentType: Joi.string().valid('consultation', 'follow-up', 'emergency', 'checkup'),
    dateFrom: commonSchemas.date,
    dateTo: commonSchemas.date,
    ...commonSchemas.pagination
  })
};

/**
 * Medical Record validation schemas
 */
const medicalRecordValidation = {
  create: Joi.object({
    patient: commonSchemas.objectId.required(),
    doctor: commonSchemas.objectId.required(),
    appointment: commonSchemas.objectId,
    recordType: Joi.string().valid('consultation', 'diagnosis', 'treatment', 'lab-result', 'imaging', 'procedure').required(),
    title: Joi.string().required().max(200),
    description: Joi.string().required().max(2000),
    diagnosis: Joi.array().items(Joi.object({
      condition: Joi.string().required().max(200),
      icdCode: Joi.string().max(20),
      type: Joi.string().valid('primary', 'secondary', 'differential'),
      severity: Joi.string().valid('mild', 'moderate', 'severe', 'critical')
    })),
    symptoms: Joi.array().items(Joi.object({
      symptom: Joi.string().required().max(100),
      severity: Joi.string().valid('mild', 'moderate', 'severe').required(),
      duration: Joi.string().max(50),
      notes: Joi.string().max(200)
    }))
  }),

  search: Joi.object({
    patient: commonSchemas.objectId,
    doctor: commonSchemas.objectId,
    recordType: Joi.string().valid('consultation', 'diagnosis', 'treatment', 'lab-result', 'imaging', 'procedure'),
    searchTerm: Joi.string().max(100),
    dateFrom: commonSchemas.date,
    dateTo: commonSchemas.date,
    ...commonSchemas.pagination
  })
};

/**
 * Prescription validation schemas
 */
const prescriptionValidation = {
  create: Joi.object({
    patient: commonSchemas.objectId.required(),
    doctor: commonSchemas.objectId.required(),
    appointment: commonSchemas.objectId,
    medications: Joi.array().min(1).items(Joi.object({
      name: Joi.string().required().max(200),
      strength: Joi.string().required().max(50),
      dosageForm: Joi.string().valid('tablet', 'capsule', 'syrup', 'injection', 'cream', 'ointment').required(),
      frequency: Joi.string().required().max(100),
      duration: Joi.string().required().max(100),
      quantity: Joi.object({
        prescribed: commonSchemas.positiveNumber.required(),
        unit: Joi.string().valid('tablets', 'capsules', 'ml', 'mg', 'g').required()
      }),
      instructions: Joi.string().required().max(500),
      refills: Joi.object({
        authorized: Joi.number().integer().min(0).max(5).default(0)
      })
    })).required(),
    prescribedFor: Joi.string().required().max(200),
    validUntil: commonSchemas.date
  }),

  search: Joi.object({
    patient: commonSchemas.objectId,
    doctor: commonSchemas.objectId,
    prescriptionNumber: Joi.string().max(50),
    status: Joi.string().valid('draft', 'sent', 'dispensed', 'completed', 'cancelled'),
    ...commonSchemas.pagination
  })
};

/**
 * Validation middleware factory
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
      messages: customMessages
    });

    if (error) {
      const formattedErrors = formatValidationErrors(error.details);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: formattedErrors
      });
    }

    req[property] = value;
    next();
  };
};

/**
 * Validate query parameters
 */
const validateQuery = (schema) => validate(schema, 'query');

/**
 * Validate URL parameters
 */
const validateParams = (schema) => validate(schema, 'params');

module.exports = {
  validate,
  validateQuery,
  validateParams,
  userValidation,
  doctorValidation,
  patientValidation,
  appointmentValidation,
  medicalRecordValidation,
  prescriptionValidation,
  commonSchemas
};