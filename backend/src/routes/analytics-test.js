const express = require('express');
const router = express.Router();

router.get('/overview', (req, res) => {
  res.json({ success: true, message: 'Mock analytics', data: { stats: {} } });
});

module.exports = router;