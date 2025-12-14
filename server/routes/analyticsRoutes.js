const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.get('/history', analyticsController.getHistoricalData);
router.post('/predict', analyticsController.predictModelSuccess);

module.exports = router;
