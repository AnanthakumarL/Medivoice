const express = require('express');
const router = express.Router();

// Mock patients endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Mock patients list (database not connected)',
    data: {
      patients: [
        {
          id: 1,
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane@example.com',
          bloodType: 'O+',
          status: 'active'
        }
      ],
      total: 1
    }
  });
});

router.post('/', (req, res) => {
  res.json({
    success: true,
    message: 'Patient created successfully (mock response)',
    data: {
      patient: {
        id: 2,
        ...req.body
      }
    }
  });
});

module.exports = router;