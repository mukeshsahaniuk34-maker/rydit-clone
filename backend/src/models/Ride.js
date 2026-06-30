const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  rideNumber: {
    type: String,
    unique: true
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: true
  },
  source: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  destination: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  rideType: {
    type: String,
    enum: ['shared', 'private'],
    default: 'shared'
  },
  totalSeats: {
    type: Number,
    default: 4
  },
  passengers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    seatNumber: Number,
    status: {
      type: String,
      enum: ['confirmed', 'completed', 'cancelled'],
      default: 'confirmed'
    },
    pickupTime: Date,
    dropoffTime: Date,
    fare: Number
  }],
  availableSeats: {
    type: Number,
    required: true
  },
  baseFare: {
    type: Number,
    required: true
  },
  pricePerSeat: {
    type: Number,
    required: true
  },
  departureTime: {
    type: Date,
    required: true
  },
  estimatedArrivalTime: {
    type: Date
  },
  actualArrivalTime: {
    type: Date
  },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  distance: {
    type: Number,
    required: true
  },
  duration: {
    type: String
  },
  route: {
    type: String,
    enum: ['khatima-delhi', 'delhi-khatima', 'custom'],
    default: 'khatima-delhi'
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  },
  totalRevenue: Number,
  cancellationReason: String,
  cancelledBy: {
    type: String,
    enum: ['user', 'driver', 'admin']
  },
  cancelledAt: Date,
  rating: {
    overallRating: Number,
    cleanliness: Number,
    comfort: Number,
    driverBehavior: Number,
    comments: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
rideSchema.index({ departureTime: 1, status: 1 });
rideSchema.index({ driver: 1, createdAt: -1 });
rideSchema.index({ 'passengers.user': 1 });

module.exports = mongoose.model('Ride', rideSchema);