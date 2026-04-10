const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ success: true, message: 'Mock medical records', data: { records: [] } });
});

router.post('/', (req, res) => {
  res.json({ success: true, message: 'Record created (mock)', data: { record: { id: 1 } } });
});

module.exports = router;