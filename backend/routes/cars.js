const express = require('express');
const {
  getCars,
  getCar,
  createCar,
  updateCar,
  deleteCar,
  uploadCarPhotos
} = require('../controllers/cars');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getCars);
router.get('/:id', getCar);

// Protected routes
router.use(protect);
router.use(authorize('admin'));

router.post('/', createCar);
router.put('/:id', updateCar);
router.delete('/:id', deleteCar);
router.put('/:id/photos', uploadCarPhotos);

module.exports = router; 