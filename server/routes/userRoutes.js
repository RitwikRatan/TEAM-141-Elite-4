const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/recommend', userController.getRecommendations);
router.post('/maintenance', userController.predictMaintenance); // Legacy/Simple
router.post('/maintenance-chat', userController.predictMaintenanceChat); // AI Interactive
router.post('/chat', userController.getChatResponse);
router.post('/identify-car', userController.identifyCar);
router.post('/driving-tips', userController.getDrivingTips); // Smart Driving Assistant

module.exports = router;
