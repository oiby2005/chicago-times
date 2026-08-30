const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide Email and Password.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanFullName = (fullName || "").trim();

    // Default Account Map for Auto-Seeding MySQL Table
    const DEFAULT_ACCOUNTS = {
      "admin@gmail.com": {
        full_name: "Admin User",
        email: "admin@gmail.com",
        passwords: ["admin123", "123456", "admin"],
        role: "admin",
      },
      "writer@gmail.com": {
        full_name: "Writer User",
        email: "writer@gmail.com",
        passwords: ["writer123", "123456", "writer"],
        role: "writer",
      },
      "reader@gmail.com": {
        full_name: "Reader User",
        email: "reader@gmail.com",
        passwords: ["reader123", "123456", "reader"],
        role: "reader",
      },
    };

    // 1. Try querying MySQL Database
    try {
      let [rows] = await db.query('SELECT * FROM users WHERE LOWER(email) = ?', [cleanEmail]);

      // If user does not exist in MySQL database yet but is a default account, insert it!
      if (rows.length === 0 && DEFAULT_ACCOUNTS[cleanEmail]) {
        const def = DEFAULT_ACCOUNTS[cleanEmail];
        const hashedPassword = await bcrypt.hash(def.passwords[0], 10);
        await db.query(
          'INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)',
          [cleanFullName || def.full_name, cleanEmail, hashedPassword, def.role]
        );
        console.log(`✅ Auto-inserted ${cleanEmail} into MySQL "users" table for phpMyAdmin!`);
        [rows] = await db.query('SELECT * FROM users WHERE LOWER(email) = ?', [cleanEmail]);
      }

      if (rows.length > 0) {
        const user = rows[0];
        let isMatch = false;

        // Compare bcrypt hash or default fallback passwords
        if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
          isMatch = await bcrypt.compare(password, user.password);
        }
        
        if (!isMatch && DEFAULT_ACCOUNTS[cleanEmail]) {
          isMatch = DEFAULT_ACCOUNTS[cleanEmail].passwords.includes(password);
        }

        if (isMatch) {
          // Update updated_at timestamp in MySQL
          try {
            await db.query('UPDATE users SET updated_at = NOW() WHERE id = ?', [user.id]);
          } catch(e) {}

          const jwtSecret = process.env.JWT_SECRET || 'wsj_super_secret_jwt_key_2026_key';
          const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            jwtSecret,
            { expiresIn: '24h' }
          );

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
        }
      }
    } catch (dbErr) {
      console.warn("MySQL DB Query Warning:", dbErr.message);
    }

    // 2. Direct Fallback for default accounts if MySQL is offline or not installed locally
    if (DEFAULT_ACCOUNTS[cleanEmail]) {
      const def = DEFAULT_ACCOUNTS[cleanEmail];
      if (def.passwords.includes(password)) {
        const jwtSecret = process.env.JWT_SECRET || 'wsj_super_secret_jwt_key_2026_key';
        const token = jwt.sign(
          { id: 101, email: def.email, role: def.role },
          jwtSecret,
          { expiresIn: '24h' }
        );

        return res.status(200).json({
          success: true,
          message: 'Login successful (fallback)',
          token,
          user: {
            id: 101,
            full_name: cleanFullName || def.full_name,
            email: def.email,
            role: def.role,
          },
        });
      }
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid email or password.',
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
