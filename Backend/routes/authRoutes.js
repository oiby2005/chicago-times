const express = require('express');
const router = express.Router();
const {
  login,
  getMe,
  googleLogin,
  logout,
  forgotPassword,
  verifyResetToken,
  resetPassword,
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { signInLimiter, passwordResetLimiter } = require('../middlewares/rateLimiter');

// POST /api/auth/login
router.post('/login', signInLimiter, login);

// POST /api/auth/google
router.post('/google', signInLimiter, googleLogin);

// POST /api/auth/logout
router.post('/logout', logout);

// POST /api/auth/forgot-password
router.post('/forgot-password', passwordResetLimiter, forgotPassword);

// GET /api/auth/verify-reset-token
router.get('/verify-reset-token', verifyResetToken);

// POST /api/auth/reset-password
router.post('/reset-password', passwordResetLimiter, resetPassword);

// GET /api/auth/me
router.get('/me', protect, getMe);

module.exports = router;

