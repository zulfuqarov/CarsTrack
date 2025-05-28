const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// Generate unique customer ID
const generateCustomerId = async (name, carMake) => {
  const firstLetter = name.charAt(0).toUpperCase();
  const carFirstLetter = carMake.charAt(0).toUpperCase();
  
  while (true) {
    const randomNum = Math.floor(1000000 + Math.random() * 9000000);
    const customerId = `${firstLetter}${carFirstLetter}${randomNum}`;
    
    // Check if ID exists
    const existingCustomer = await Customer.findOne({ customerId });
    if (!existingCustomer) {
      return customerId;
    }
  }
};

// @route   GET api/customers
// @desc    Get all customers
// @access  Public
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: customers
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Server xətası'
    });
  }
});

// @route   POST api/customers
// @desc    Create a customer
// @access  Public
router.post('/', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      car,
      images
    } = req.body;

    // Check if customer already exists
    let customer = await Customer.findOne({ email });
    if (customer) {
      return res.status(400).json({ 
        success: false,
        message: 'Bu email artıq istifadə olunub' 
      });
    }

    // Generate unique customer ID
    const customerId = await generateCustomerId(name, car.make);

    customer = new Customer({
      customerId,
      name,
      email,
      phone,
      address,
      car,
      images
    });

    await customer.save();
    res.status(201).json({
      success: true,
      data: customer
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Server xətası'
    });
  }
});

// @route   GET api/customers/:id
// @desc    Get customer by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ 
        success: false,
        message: 'Müştəri tapılmadı' 
      });
    }
    res.json({
      success: true,
      data: customer
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false,
        message: 'Müştəri tapılmadı' 
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server xətası'
    });
  }
});

// @route   PUT api/customers/:id
// @desc    Update customer
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      car,
      images
    } = req.body;

    // Build customer object
    const customerFields = {};
    if (name) customerFields.name = name;
    if (email) customerFields.email = email;
    if (phone) customerFields.phone = phone;
    if (address) customerFields.address = address;
    if (car) customerFields.car = car;
    if (images) customerFields.images = images;

    let customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ 
        success: false,
        message: 'Müştəri tapılmadı' 
      });
    }

    customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { $set: customerFields },
      { new: true }
    );

    res.json({
      success: true,
      data: customer
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false,
        message: 'Müştəri tapılmadı' 
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server xətası'
    });
  }
});

// @route   DELETE api/customers/:id
// @desc    Delete customer
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ 
        success: false,
        message: 'Müştəri tapılmadı' 
      });
    }

    await customer.deleteOne();
    res.json({ 
      success: true,
      message: 'Müştəri silindi' 
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false,
        message: 'Müştəri tapılmadı' 
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server xətası'
    });
  }
});

// @route   GET api/customers/customerId/:customerId
// @desc    Get customer by customerId
// @access  Public
router.get('/customerId/:customerId', async (req, res) => {
  try {
    const customer = await Customer.findOne({ customerId: req.params.customerId });
    if (!customer) {
      return res.status(404).json({ 
        success: false,
        message: 'Müştəri tapılmadı' 
      });
    }
    res.json({
      success: true,
      data: customer
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'Server xətası'
    });
  }
});

module.exports = router; 