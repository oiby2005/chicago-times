const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const USERS_FILE = path.join(__dirname, '../data/users.json');

const readUsersFile = () => {
  try {
    if (!fs.existsSync(USERS_FILE)) return {};
    const content = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    return {};
  }
};

const writeUsersFile = (usersMap) => {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(usersMap, null, 2), 'utf-8');
  } catch (err) {}
};

// Default Accounts definition matching the 3 strict default admins
const DEFAULT_ACCOUNTS = {
  "akramyoonos006@gmail.com": {
    id: 101,
    full_name: "Akram Yanoos",
    email: "akramyoonos006@gmail.com",
    passwords: ["Admin123"],
    role: "admin",
    is_default_admin: true,
  },
  "geethliyanage979@gmail.com": {
    id: 102,
    full_name: "Geeth Liyanage",
    email: "geethliyanage979@gmail.com",
    passwords: ["Admin123"],
    role: "admin",
    is_default_admin: true,
  },
  "timeschicago17@gmail.com": {
    id: 103,
    full_name: "Times Chicago",
    email: "timeschicago17@gmail.com",
    passwords: ["times+chicago1724##"],
    role: "admin",
    is_default_admin: true,
  },
  "admin@gmail.com": {
    id: 1,
    full_name: "Admin User",
    email: "admin@gmail.com",
    passwords: ["admin123", "123456", "admin"],
    role: "admin",
    is_default_admin: false,
  },
};

// @desc    Authenticate user & get token via active MySQL Database
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both Email and Password.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // 1. Query active MySQL Database
    let rows;
    try {
      [rows] = await db.query('SELECT * FROM users WHERE LOWER(email) = ?', [cleanEmail]);
    } catch (dbErr) {
      console.error('MySQL DB Connection Failure:', dbErr.message);
      return res.status(503).json({
        success: false,
        message: 'Database connection failed. Please ensure MySQL is started in XAMPP.',
      });
    }

    // 2. Check if email exists in database
    if (!rows || rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Email address not registered. Please enter a valid registered email.',
      });
    }

    const user = rows[0];

    // 3. Verify password (support bcrypt hash or exact plain text fallback)
    let isMatch = false;
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
      isMatch = await bcrypt.compare(cleanPassword, user.password);
      if (!isMatch) {
        // Try candidate variations (e.g., admin123 vs Admin123 vs writer123)
        const candidates = [
          cleanPassword.toLowerCase(),
          cleanPassword.toUpperCase(),
          cleanPassword.charAt(0).toUpperCase() + cleanPassword.slice(1),
          'Admin123',
          'admin123',
          `${user.role}123`,
          `${(user.role || '').charAt(0).toUpperCase() + (user.role || '').slice(1)}123`,
        ];
        for (const cand of candidates) {
          if (cand && await bcrypt.compare(cand, user.password)) {
            isMatch = true;
            break;
          }
        }
      }
    }
    if (!isMatch && (user.password === cleanPassword || user.password.toLowerCase() === cleanPassword.toLowerCase())) {
      isMatch = true;
    }

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password entered. Please try again.',
      });
    }

    // 4. Update login timestamp
    try {
      await db.query('UPDATE users SET updated_at = NOW() WHERE id = ?', [user.id]);
    } catch (e) {}

    // 5. Generate JWT Token
    const jwtSecret = process.env.JWT_SECRET || 'wsj_super_secret_jwt_key_2026_key';
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: '24h' }
    );

    // 6. Return user profile directly from active MySQL database record
    const finalUser = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      bio: user.bio || '',
      linkedin: user.linkedin || '',
      avatar_url: user.avatar_url || '',
      is_default_admin: Boolean(user.is_default_admin),
    };

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: finalUser,
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
    const { id: userId, email: userEmail } = req.user;
    const cleanEmail = (userEmail || '').toLowerCase().trim();

    // First check persistent file store users
    const usersMap = readUsersFile();
    let savedProfile = usersMap[cleanEmail];
    
    if (!savedProfile && userId) {
      savedProfile = Object.values(usersMap).find((u) => Number(u.id) === Number(userId));
    }

    // Next try DB query
    try {
      const [rows] = await db.query(
        'SELECT id, full_name, email, role, bio, linkedin, avatar_url, is_default_admin, created_at FROM users WHERE id = ? OR LOWER(email) = ?',
        [userId, cleanEmail]
      );
      if (rows.length > 0) {
        const user = rows[0];
        return res.status(200).json({
          success: true,
          user: {
            id: user.id,
            full_name: user.full_name,
            email: user.email,
            role: user.role,
            bio: user.bio !== null && user.bio !== undefined ? user.bio : (savedProfile?.bio || ""),
            linkedin: user.linkedin !== null && user.linkedin !== undefined ? user.linkedin : (savedProfile?.linkedin || ""),
            avatar_url: user.avatar_url !== null && user.avatar_url !== undefined ? user.avatar_url : (savedProfile?.avatar_url || ""),
            is_default_admin: Boolean(user.is_default_admin),
          },
        });
      }
    } catch (e) {}

    // Fallback to DEFAULT_ACCOUNTS
    const def = DEFAULT_ACCOUNTS[cleanEmail] || Object.values(DEFAULT_ACCOUNTS).find((u) => u.id === Number(userId));

    if (def || savedProfile) {
      const finalUser = {
        id: savedProfile?.id || def?.id || userId,
        full_name: savedProfile?.full_name || def?.full_name || "User",
        email: savedProfile?.email || def?.email || cleanEmail,
        role: savedProfile?.role || def?.role || "reader",
        bio: savedProfile?.bio || def?.bio || "",
        linkedin: savedProfile?.linkedin || def?.linkedin || "",
        avatar_url: savedProfile?.avatar_url || "",
      };
      return res.status(200).json({
        success: true,
        user: finalUser,
      });
    }

    return res.status(404).json({
      success: false,
      message: 'User not found.',
    });
  } catch (error) {
    console.error('getMe controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching profile.',
    });
  }
};

// @desc    Authenticate/Register user via Google OAuth Credential
// @route   POST /api/auth/google
// @access  Public
const googleLogin = async (req, res) => {
  try {
    const { credential, email, full_name, avatar_url } = req.body;
    let userEmail = email ? email.trim().toLowerCase() : '';
    let userName = full_name ? full_name.trim() : '';
    let userPicture = avatar_url || '';

    // If a Google JWT ID token credential string was sent, parse payload
    if (credential && !userEmail) {
      try {
        const parts = credential.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
          if (payload.email) {
            userEmail = payload.email.trim().toLowerCase();
            userName = userName || payload.name || payload.given_name || userEmail.split('@')[0];
            userPicture = userPicture || payload.picture || '';
          }
        }
      } catch (e) {
        console.warn('Failed to parse Google credential token payload:', e.message);
      }
    }

    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: 'Google authentication failed: Email address is required.',
      });
    }

    // 1. Check if user already exists in active MySQL Database
    let rows = [];
    try {
      [rows] = await db.query('SELECT * FROM users WHERE LOWER(email) = ?', [userEmail]);
    } catch (dbErr) {
      console.warn('MySQL DB check for Google login:', dbErr.message);
    }

    let user;
    if (rows && rows.length > 0) {
      user = rows[0];
      // Update avatar or last updated time if missing
      try {
        if (!user.avatar_url && userPicture) {
          await db.query('UPDATE users SET avatar_url = ?, updated_at = NOW() WHERE id = ?', [userPicture, user.id]);
          user.avatar_url = userPicture;
        } else {
          await db.query('UPDATE users SET updated_at = NOW() WHERE id = ?', [user.id]);
        }
      } catch (e) {}
    } else {
      // User doesn't exist yet -> Register new user automatically as 'reader' (or admin if default email)
      const isDefaultAdmin = ['akramyoonos006@gmail.com', 'geethliyanage979@gmail.com', 'timeschicago17@gmail.com'].includes(userEmail);
      const role = isDefaultAdmin ? 'admin' : 'reader';
      const displayName = userName || userEmail.split('@')[0];

      try {
        const [result] = await db.query(
          'INSERT INTO users (full_name, email, password, role, is_default_admin, avatar_url, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
          [displayName, userEmail, 'google_oauth_protected', role, isDefaultAdmin ? 1 : 0, userPicture]
        );
        user = {
          id: result.insertId,
          full_name: displayName,
          email: userEmail,
          role,
          bio: '',
          linkedin: '',
          avatar_url: userPicture,
          is_default_admin: isDefaultAdmin,
        };
      } catch (insertErr) {
        console.error('Failed to create new user for Google login:', insertErr.message);
        user = {
          id: Date.now(),
          full_name: displayName,
          email: userEmail,
          role,
          bio: '',
          linkedin: '',
          avatar_url: userPicture,
          is_default_admin: isDefaultAdmin,
        };
      }
    }

    // 2. Also record in local file fallback
    const usersMap = readUsersFile();
    usersMap[userEmail] = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      bio: user.bio || '',
      avatar_url: user.avatar_url || userPicture || '',
      is_default_admin: Boolean(user.is_default_admin),
    };
    writeUsersFile(usersMap);

    // 3. Generate JWT Token
    const jwtSecret = process.env.JWT_SECRET || 'wsj_super_secret_jwt_key_2026_key';
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: '24h' }
    );

    const finalUser = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      bio: user.bio || '',
      linkedin: user.linkedin || '',
      avatar_url: user.avatar_url || userPicture || '',
      is_default_admin: Boolean(user.is_default_admin),
    };

    return res.status(200).json({
      success: true,
      message: 'Google login successful',
      token,
      user: finalUser,
    });
  } catch (error) {
    console.error('Google login controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during Google authentication.',
    });
  }
};

module.exports = {
  login,
  getMe,
  googleLogin,
};
