const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // 1. Basic validation
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide Full Name, Email, and Password.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanFullName = fullName.trim().toLowerCase();

    // 2. Query user from database
    const [rows] = await db.query('SELECT * FROM users WHERE LOWER(email) = ?', [cleanEmail]);

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.',
      });
    }

    const user = rows[0];

    // 3. Verify Full Name matches DB
    if (user.full_name.trim().toLowerCase() !== cleanFullName) {
      return res.status(401).json({
        success: false,
        message: 'Full Name does not match account records.',
      });
    }

    // 4. Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.',
      });
    }

    // 4. Generate JWT Token
    const jwtSecret = process.env.JWT_SECRET || 'wsj_super_secret_jwt_key_2026_key';
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      jwtSecret,
      { expiresIn: '24h' }
    );

    // 5. Return success response with user role & token
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication.',
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await db.query(
      'SELECT id, full_name, email, role, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    return res.status(200).json({
      success: true,
      user: rows[0],
    });
  } catch (error) {
    console.error('getMe controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching profile.',
    });
  }
};

module.exports = {
  login,
  getMe,
};
