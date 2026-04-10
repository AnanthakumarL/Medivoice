const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ success: true, message: 'Mock prescriptions', data: { prescriptions: [] } });
});

router.post('/', (req, res) => {
  res.json({ success: true, message: 'Prescription created (mock)', data: { prescription: { id: 1 } } });
});

module.exports = router;