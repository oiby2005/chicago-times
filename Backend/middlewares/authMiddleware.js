const jwt = require('jsonwebtoken');

/**
 * 1. Base Authentication Middleware - verifies JWT token from Authorization header or x-auth-token
 */
const protect = (req, res, next) => {
  let token = null;

  // 1. Check HttpOnly Session Cookie first (Highest Security)
  if (req.cookies && (req.cookies.wsj_session_token || req.cookies.wsj_token)) {
    token = req.cookies.wsj_session_token || req.cookies.wsj_token;
  }
  // 2. Fallback to Authorization Bearer header or x-auth-token
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.headers['x-auth-token']) {
    token = req.headers['x-auth-token'];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied: Authentication token required. Please sign in.',
    });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || 'wsj_super_secret_jwt_key_2026_key';
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    return next();
  } catch (error) {
    console.error('JWT Verification failed:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Not authorized: Token is invalid or expired. Please sign in again.',
    });
  }
};

/**
 * 2. Require Admin Privileges Middleware
 */
const requireAdmin = (req, res, next) => {
  protect(req, res, () => {
    const role = (req.user?.role || '').toLowerCase().trim();
    if (role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Administrator privileges required for this action.',
      });
    }
    next();
  });
};

/**
 * 3. Require Writer or Admin Privileges Middleware
 */
const requireWriterOrAdmin = (req, res, next) => {
  protect(req, res, () => {
    const role = (req.user?.role || '').toLowerCase().trim();
    if (role !== 'admin' && role !== 'writer') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Writer or Administrator privileges required for this action.',
      });
    }
    next();
  });
};

/**
 * 4. Optional Authentication Middleware - populates req.user if valid token/cookie is present, doesn't reject if missing
 */
const optionalAuth = (req, res, next) => {
  let token = null;

  // 1. Check HttpOnly Session Cookie first (Highest Security)
  if (req.cookies && (req.cookies.wsj_session_token || req.cookies.wsj_token)) {
    token = req.cookies.wsj_session_token || req.cookies.wsj_token;
  }
  // 2. Fallback to Authorization Bearer header or x-auth-token
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.headers['x-auth-token']) {
    token = req.headers['x-auth-token'];
  }

  if (token) {
    try {
      const jwtSecret = process.env.JWT_SECRET || 'wsj_super_secret_jwt_key_2026_key';
      const decoded = jwt.verify(token, jwtSecret);
      req.user = decoded;
    } catch (_) {
      // Proceed without req.user if token is invalid or expired
    }
  }

  next();
};

module.exports = {
  protect,
  requireAdmin,
  requireWriterOrAdmin,
  optionalAuth,
};
