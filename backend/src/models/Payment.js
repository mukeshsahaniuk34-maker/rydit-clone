const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    unique: true,
    required: true
  },
  ride: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ride',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'wallet', 'netbanking'],
    required: true
  },
  paymentGateway: {
    type: String,
    enum: ['razorpay', 'stripe', 'paypal'],
    default: 'razorpay'
  },
  razorpayPaymentId: String,
  razorpayOrderId: String,
  razorpaySignature: String,
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  breakdown: {
    baseFare: Number,
    surgePricing: Number,
    discount: Number,
    tax: Number,
    commission: Number,
    total: Number
  },
  receipt: String,
  invoiceUrl: String,
  failureReason: String,
  refund: {
    amount: Number,
    status: String,
    date: Date,
    reason: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date,
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ ride: 1 });
paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ status: 1 });

module.exports = mongoose.model('Payment', paymentSchema);