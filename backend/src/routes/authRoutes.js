const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Driver = require('../models/Driver');

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// User Registration
router.post('/register', [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').matches(/^[0-9]{10}$/).withMessage('Valid 10-digit phone is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { firstName, lastName, email, phone, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ $or: [{ email }, { phone }] });
    if (user) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this email or phone'
      });
    }

    // Create user
    user = new User({
      firstName,
      lastName,
      email,
      phone,
      password
    });

    await user.save();
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: user.getPublicProfile()
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: err.message
    });
  }
});

// User Login
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user._id);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: user.getPublicProfile()
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: err.message
    });
  }
});

// Driver Registration
router.post('/driver-register', [
  body('firstName').trim().notEmpty(),
  body('lastName').trim().notEmpty(),
  body('email').isEmail(),
  body('phone').matches(/^[0-9]{10}$/),
  body('licenseNumber').notEmpty(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { firstName, lastName, email, phone, licenseNumber, password } = req.body;

    let driver = await Driver.findOne({ $or: [{ email }, { phone }, { licenseNumber }] });
    if (driver) {
      return res.status(409).json({
        success: false,
        message: 'Driver already exists'
      });
    }

    driver = new Driver({
      firstName,
      lastName,
      email,
      phone,
      licenseNumber,
      password
    });

    await driver.save();
    const token = generateToken(driver._id);

    res.status(201).json({
      success: true,
      message: 'Driver registered successfully. Awaiting admin approval.',
      token,
      driver: driver.toObject()
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Driver registration failed',
      error: err.message
    });
  }
});

// Driver Login
router.post('/driver-login', [
  body('email').isEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const { email, password } = req.body;

    const driver = await Driver.findOne({ email }).select('+password');
    if (!driver) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isMatch = await driver.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken(driver._id);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      driver: driver.toObject()
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

module.exports = router;