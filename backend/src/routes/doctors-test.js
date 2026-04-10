const express = require('express');
const router = express.Router();

// Mock doctors endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Mock doctors list (database not connected)',
    data: {
      doctors: [
        {
          id: 1,
          firstName: 'Dr. John',
          lastName: 'Smith',
          specialization: 'Cardiology',
          department: 'Cardiology',
          consultationFee: 150
        }
      ],
      total: 1
    }
  });
});

router.post('/', (req, res) => {
  res.json({
    success: true,
    message: 'Doctor created successfully (mock response)',
    data: {
      doctor: {
        id: 2,
        ...req.body
      }
    }
  });
});

module.exports = router;