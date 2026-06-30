const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const User = require('../models/User');

const router = express.Router();

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.status(200).json({
      success: true,
      user: user.getPublicProfile()
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, phone, address, gender, dateOfBirth } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        firstName,
        lastName,
        phone,
        address,
        gender,
        dateOfBirth,
        updatedAt: new Date()
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: user.getPublicProfile()
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

// Add payment method
router.post('/payment-method', authMiddleware, async (req, res) => {
  try {
    const { type, cardLast4, isDefault } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        $push: {
          paymentMethods: { type, cardLast4, isDefault }
        }
      },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: 'Payment method added',
      user: user.getPublicProfile()
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to add payment method'
    });
  }
});

// Get wallet balance
router.get('/wallet', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.status(200).json({
      success: true,
      walletBalance: user.walletBalance
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wallet balance'
    });
  }
});

module.exports = router;