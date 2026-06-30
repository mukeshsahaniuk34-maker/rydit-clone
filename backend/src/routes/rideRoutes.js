const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const Ride = require('../models/Ride');
const Payment = require('../models/Payment');
const User = require('../models/User');

const router = express.Router();

// Get available rides
router.get('/available', async (req, res) => {
  try {
    const { source, destination, date } = req.query;

    const query = {
      status: 'scheduled',
      availableSeats: { $gt: 0 }
    };

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
      query.departureTime = { $gte: startDate, $lt: endDate };
    }

    const rides = await Ride.find(query)
      .populate('driver', 'firstName lastName rating')
      .populate('vehicle')
      .sort({ departureTime: 1 });

    res.status(200).json({
      success: true,
      rides
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rides',
      error: err.message
    });
  }
});

// Book a ride
router.post('/book', authMiddleware, async (req, res) => {
  try {
    const { rideId, seatNumber, fare } = req.body;
    const userId = req.userId;

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    if (ride.availableSeats <= 0) {
      return res.status(400).json({
        success: false,
        message: 'No seats available'
      });
    }

    // Add passenger to ride
    ride.passengers.push({
      user: userId,
      seatNumber,
      fare
    });
    ride.availableSeats -= 1;
    await ride.save();

    // Add booking to user
    await User.findByIdAndUpdate(userId, {
      $push: { bookings: rideId },
      $inc: { totalRides: 1 }
    });

    res.status(200).json({
      success: true,
      message: 'Ride booked successfully',
      ride
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Booking failed',
      error: err.message
    });
  }
});

// Get user's bookings
router.get('/my-bookings', authMiddleware, async (req, res) => {
  try {
    const rides = await Ride.find({
      'passengers.user': req.userId
    }).populate('driver', 'firstName lastName phone');

    res.status(200).json({
      success: true,
      rides
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings'
    });
  }
});

// Cancel booking
router.post('/:rideId/cancel', authMiddleware, async (req, res) => {
  try {
    const { rideId } = req.params;
    const { reason } = req.body;

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    // Find and remove passenger
    const passengerIndex = ride.passengers.findIndex(
      p => p.user.toString() === req.userId
    );

    if (passengerIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'Passenger not found in this ride'
      });
    }

    const fare = ride.passengers[passengerIndex].fare;
    ride.passengers[passengerIndex].status = 'cancelled';
    ride.availableSeats += 1;
    await ride.save();

    // Process refund
    const payment = await Payment.findOne({ ride: rideId, user: req.userId });
    if (payment && payment.status === 'completed') {
      payment.status = 'refunded';
      payment.refund = {
        amount: fare,
        status: 'processed',
        date: new Date(),
        reason
      };
      await payment.save();
    }

    res.status(200).json({
      success: true,
      message: 'Booking cancelled and refund initiated'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Cancellation failed'
    });
  }
});

module.exports = router;