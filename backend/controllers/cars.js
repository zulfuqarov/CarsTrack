const Car = require('../models/Car');
const asyncHandler = require('express-async-handler');
const path = require('path');
const fs = require('fs');

// @desc    Get all cars
// @route   GET /api/cars
// @access  Public
exports.getCars = asyncHandler(async (req, res) => {
  const cars = await Car.find();
  res.status(200).json({
    success: true,
    count: cars.length,
    data: cars
  });
});

// @desc    Get single car
// @route   GET /api/cars/:id
// @access  Public
exports.getCar = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);

  if (!car) {
    return res.status(404).json({
      success: false,
      message: 'Car not found'
    });
  }

  res.status(200).json({
    success: true,
    data: car
  });
});

// @desc    Create new car
// @route   POST /api/cars
// @access  Private
exports.createCar = asyncHandler(async (req, res) => {
  const car = await Car.create(req.body);

  res.status(201).json({
    success: true,
    data: car
  });
});

// @desc    Update car
// @route   PUT /api/cars/:id
// @access  Private
exports.updateCar = asyncHandler(async (req, res) => {
  let car = await Car.findById(req.params.id);

  if (!car) {
    return res.status(404).json({
      success: false,
      message: 'Car not found'
    });
  }

  car = await Car.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: car
  });
});

// @desc    Delete car
// @route   DELETE /api/cars/:id
// @access  Private
exports.deleteCar = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);

  if (!car) {
    return res.status(404).json({
      success: false,
      message: 'Car not found'
    });
  }

  // Delete all associated photos
  const photoCategories = ['auction', 'usaWarehouse', 'containerLoading', 'containerUnloading', 'bakuRoad', 'bakuCustoms'];
  
  for (const category of photoCategories) {
    if (car.photos[category]) {
      for (const photo of car.photos[category]) {
        const photoPath = path.join(__dirname, '../../uploads', photo);
        if (fs.existsSync(photoPath)) {
          fs.unlinkSync(photoPath);
        }
      }
    }
  }

  await car.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Upload car photos
// @route   PUT /api/cars/:id/photos
// @access  Private
exports.uploadCarPhotos = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);

  if (!car) {
    return res.status(404).json({
      success: false,
      message: 'Car not found'
    });
  }

  if (!req.files) {
    return res.status(400).json({
      success: false,
      message: 'Please upload a file'
    });
  }

  const file = req.files.file;
  const category = req.body.category;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return res.status(400).json({
      success: false,
      message: 'Please upload an image file'
    });
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return res.status(400).json({
      success: false,
      message: `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`
    });
  }

  // Create custom filename
  file.name = `photo_${car._id}_${Date.now()}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: 'Problem with file upload'
      });
    }

    // Add photo to car's photos array
    if (!car.photos[category]) {
      car.photos[category] = [];
    }
    car.photos[category].push(file.name);

    await car.save();

    res.status(200).json({
      success: true,
      data: file.name
    });
  });
}); 