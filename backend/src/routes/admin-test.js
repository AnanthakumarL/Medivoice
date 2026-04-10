const express = require('express');
const router = express.Router();

router.get('/users', (req, res) => {
  res.json({ success: true, message: 'Mock admin users', data: { users: [] } });
});

module.exports = router;