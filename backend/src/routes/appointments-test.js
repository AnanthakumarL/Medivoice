const express = require('express');
const router = express.Router();

// Mock appointments
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Mock appointments (database not connected)',
    data: { appointments: [], total: 0 }
  });
});

router.post('/', (req, res) => {
  res.json({
    success: true,
    message: 'Appointment created (mock)',
    data: { appointment: { id: 1, ...req.body } }
  });
});

module.exports = router;