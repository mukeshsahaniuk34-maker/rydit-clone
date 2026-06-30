const express = require('express');
const User = require('../models/User');
const Driver = require('../models/Driver');
const Ride = require('../models/Ride');
const Payment = require('../models/Payment');

const router = express.Router();

// Get dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDrivers = await Driver.countDocuments();
    const totalRides = await Ride.countDocuments();
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalDrivers,
        totalRides,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats'
    });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({
      success: true,
      users
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

// Get all drivers
router.get('/drivers', async (req, res) => {
  try {
    const drivers = await Driver.find().select('-password');
    res.status(200).json({
      success: true,
      drivers
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch drivers'
    });
  }
});

// Approve driver
router.post('/drivers/:driverId/approve', async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(
      req.params.driverId,
      { isApproved: true, status: 'approved', approvedAt: new Date() },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Driver approved',
      driver
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to approve driver'
    });
  }
});

// Get all rides
router.get('/rides', async (req, res) => {
  try {
    const rides = await Ride.find()
      .populate('driver', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      rides
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rides'
    });
  }
});

module.exports = router;