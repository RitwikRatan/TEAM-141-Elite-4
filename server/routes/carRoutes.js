const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');

router.get('/', carController.getAllCars);
router.get('/:id', carController.getCarById);
router.post('/', carController.createCar); // Should add auth middleware protection here later

module.exports = router;
