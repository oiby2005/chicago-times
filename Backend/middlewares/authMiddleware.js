const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const jwtSecret = process.env.JWT_SECRET || 'wsj_super_secret_jwt_key_2026_key';
      const decoded = jwt.verify(token, jwtSecret);
      req.user = decoded;
      return next();
    } catch (error) {
      console.error('JWT Verification failed:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token invalid or expired.',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided.',
    });
  }
};

module.exports = { protect };
