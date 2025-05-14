const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  try {
    // 1. Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token'
      });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Attach user to request
    req.user = {
      id: decoded.id,  // Make sure your JWT payload contains "id"
      email: decoded.email // Optional
    };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token failed'
    });
  }
};

module.exports = {protect};