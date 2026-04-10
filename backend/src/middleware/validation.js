const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  
  next();
};

const userValidations = {
  register: [
    body('firstName').trim().isLength({ min: 2, max: 50 }),
    body('lastName').trim().isLength({ min: 2, max: 50 }),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('role').isIn(['patient', 'doctor', 'staff', 'admin']),
    handleValidationErrors
  ],
  
  login: [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
    handleValidationErrors
  ]
};

// Generic validate function
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    next();
  };
};

// Query validation helper
const validateQuery = (validations) => validate(validations);

// Doctor validation rules
const doctorValidation = {
  profile: [
    body('specialty').optional().trim().isLength({ min: 2, max: 100 }),
    body('experience').optional().isInt({ min: 0, max: 70 }),
    body('consultationFee').optional().isNumeric({ min: 0 }),
    body('hospital').optional().trim().isLength({ min: 2, max: 200 }),
    body('qualifications').optional().isArray(),
    body('bio').optional().trim().isLength({ max: 1000 }),
    body('availableHours').optional().isObject()
  ],
  
  appointment: [
    body('patientId').isMongoId(),
    body('appointmentDate').isISO8601(),
    body('reason').trim().isLength({ min: 5, max: 500 })
  ]
};

// Patient validation rules  
const patientValidation = {
  profile: [
    body('dateOfBirth').optional().isISO8601(),
    body('gender').optional().isIn(['male', 'female', 'other']),
    body('bloodType').optional().isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
    body('emergencyContact').optional().isObject(),
    body('medicalHistory').optional().isArray()
  ]
};

module.exports = {
  handleValidationErrors,
  userValidations,
  validate,
  validateQuery,
  doctorValidation,
  patientValidation
};
