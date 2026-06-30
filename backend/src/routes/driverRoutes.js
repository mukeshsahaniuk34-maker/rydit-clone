const express = require('express');
const { driverAuthMiddleware } = require('../middleware/authMiddleware');
const Driver = require('../models/Driver');
const Ride = require('../models/Ride');

const router = express.Router();

// Get driver profile
router.get('/profile', driverAuthMiddleware, async (req, res) => {
  try {
    const driver = await Driver.findById(req.driverId);
    res.status(200).json({
      success: true,
      driver
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
});

// Get driver's rides
router.get('/rides', driverAuthMiddleware, async (req, res) => {
  try {
    const rides = await Ride.find({ driver: req.driverId })
      .populate('passengers.user', 'firstName lastName phone')
      .sort({ departureTime: -1 });

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

// Get earnings dashboard
router.get('/earnings', driverAuthMiddleware, async (req, res) => {
  try {
    const driver = await Driver.findById(req.driverId);
    
    const earnings = {
      totalEarnings: driver.totalEarnings,
      availableBalance: driver.availableBalance,
      totalRides: driver.totalRides,
      completedRides: driver.completedRides,
      cancelledRides: driver.cancelledRides,
      rating: driver.rating
    };

    res.status(200).json({
      success: true,
      earnings
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch earnings'
    });
  }
});

// Complete ride
router.post('/:rideId/complete', driverAuthMiddleware, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId);
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    ride.status = 'completed';
    ride.actualArrivalTime = new Date();
    await ride.save();

    // Update driver stats
    await Driver.findByIdAndUpdate(req.driverId, {
      $inc: { completedRides: 1 }
    });

    res.status(200).json({
      success: true,
      message: 'Ride completed'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to complete ride'
    });
  }
});

module.exports = router;