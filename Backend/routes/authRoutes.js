const express = require('express');
const router = express.Router();
const { login, getMe, googleLogin } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { signInLimiter } = require('../middlewares/rateLimiter');

// POST /api/auth/login
router.post('/login', signInLimiter, login);

// POST /api/auth/google
router.post('/google', signInLimiter, googleLogin);

// GET /api/auth/me
router.get('/me', protect, getMe);

module.exports = router;
