const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const Payment = require('../models/Payment');
const Ride = require('../models/Ride');
const crypto = require('crypto');

const router = express.Router();

// Create payment order
router.post('/create-order', authMiddleware, async (req, res) => {
  try {
    const { rideId, amount } = req.body;

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    // Create payment record
    const payment = new Payment({
      ride: rideId,
      user: req.userId,
      amount,
      paymentMethod: req.body.paymentMethod || 'card',
      status: 'pending'
    });

    await payment.save();

    // In production, create Razorpay order here
    // For now, return mock response
    res.status(200).json({
      success: true,
      message: 'Payment order created',
      payment,
      orderId: payment._id // In production use Razorpay order ID
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Payment order creation failed',
      error: err.message
    });
  }
});

// Verify payment
router.post('/verify', authMiddleware, async (req, res) => {
  try {
    const { paymentId, rideId } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    payment.status = 'completed';
    payment.completedAt = new Date();
    await payment.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      payment
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Payment verification failed'
    });
  }
});

// Get payment history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.userId })
      .populate('ride')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      payments
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment history'
    });
  }
});

module.exports = router;