const express = require('express');
const router = express.Router();

// Mock response for users without database
router.get('/profile', (req, res) => {
  res.json({
    success: true,
    message: 'Mock user profile (database not connected)',
    data: {
      user: {
        id: 1,
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        role: 'patient'
      }
    }
  });
});

router.put('/profile', (req, res) => {
  res.json({
    success: true,
    message: 'Profile updated successfully (mock response)',
    data: {
      user: {
        id: 1,
        firstName: req.body.firstName || 'Test',
        lastName: req.body.lastName || 'User',
        email: 'test@example.com',
        role: 'patient'
      }
    }
  });
});

module.exports = router;