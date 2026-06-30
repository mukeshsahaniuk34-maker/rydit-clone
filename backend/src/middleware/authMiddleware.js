const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Driver = require('../models/Driver');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    req.user = user;
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

const driverAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const driver = await Driver.findById(decoded.id);
    if (!driver) {
      return res.status(401).json({
        success: false,
        message: 'Driver not found'
      });
    }

    req.driver = driver;
    req.driverId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

module.exports = { authMiddleware, driverAuthMiddleware };