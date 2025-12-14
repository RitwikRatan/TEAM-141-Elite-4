const express = require('express');
const router = express.Router();
const manufacturerController = require('../controllers/manufacturerController');

// AI Model Prediction
router.post('/predict-model', manufacturerController.predictNewModel);

// Recommend Model to Users
router.post('/recommend-to-users', manufacturerController.recommendToUsers);

// Get Recommendations (for users)
router.get('/recommendations', manufacturerController.getRecommendations);

module.exports = router;
