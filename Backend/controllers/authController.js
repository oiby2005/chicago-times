const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
  "reader@gmail.com": {
    id: 7,
    full_name: "Reader User",
    email: "reader@gmail.com",
    passwords: ["reader123"],
    role: "reader",
    is_default_admin: false,
  },
  "writer@gmail.com": {
    id: 5,
    full_name: "Writer User",
    email: "writer@gmail.com",
    passwords: ["writer123", "writer456"],
    role: "writer",
    is_default_admin: false,
  },
  "writer1@gmail.com": {
    id: 6,
    full_name: "writer1",
    email: "writer1@gmail.com",
    passwords: ["writer456"],
    role: "writer",
    is_default_admin: false,
  },
};

// In-memory failed login attempts & lockout tracking
const failedAttemptsMap = new Map();
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

// @desc    Authenticate user & get token via active MySQL Database or Default Accounts
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

    // Check if account is currently locked out
    const attemptData = failedAttemptsMap.get(cleanEmail) || { count: 0, lockUntil: 0 };
    if (attemptData.lockUntil > Date.now()) {
      const remainingMins = Math.ceil((attemptData.lockUntil - Date.now()) / (60 * 1000));
      return res.status(429).json({
        success: false,
        message: `Website login locked due to 5 consecutive failed attempts. Please wait ${remainingMins} minute(s) before trying again.`,
      });
    } else if (attemptData.lockUntil > 0 && Date.now() >= attemptData.lockUntil) {
      // Lock expired -> reset attempt count
      failedAttemptsMap.delete(cleanEmail);
    }

    let isAuthenticated = false;
    let authUser = null;

    // 1. Check DEFAULT_ACCOUNTS first for default admin users
    const defaultAcc = DEFAULT_ACCOUNTS[cleanEmail];
    if (defaultAcc) {
      const allowedPasswords = (defaultAcc.passwords || []).map((p) => p.trim());
      if (allowedPasswords.includes(cleanPassword)) {
        let profile = defaultAcc;
        try {
          const [pRows] = await db.query('SELECT * FROM users WHERE LOWER(email) = ?', [cleanEmail]);
          if (pRows && pRows.length > 0) profile = pRows[0];
        } catch (e) {}
        if (Boolean(profile.is_blocked)) {
          return res.status(403).json({
            success: false,
            is_blocked: true,
            message: "Your account has been blocked. For further information, please contact us at worldnews@timeschicago.com",
          });
        }
        authUser = {
          id: profile.id || defaultAcc.id,
          full_name: profile.full_name || defaultAcc.full_name,
          email: defaultAcc.email,
          role: profile.role || defaultAcc.role,
          bio: profile.bio || defaultAcc.bio || '',
          linkedin: profile.linkedin || defaultAcc.linkedin || '',
          avatar_url: profile.avatar_url || defaultAcc.avatar_url || '',
          is_default_admin: Boolean(defaultAcc.is_default_admin),
          is_blocked: Boolean(profile.is_blocked),
        };
        isAuthenticated = true;
      }
    }

    // 2. Query active MySQL Database if not authenticated via default accounts
    if (!isAuthenticated) {
      let rows;
      let dbConnected = true;
      try {
        [rows] = await db.query('SELECT * FROM users WHERE LOWER(email) = ?', [cleanEmail]);
      } catch (dbErr) {
        console.error('MySQL DB Connection Failure:', dbErr.message);
        dbConnected = false;
      }

      if (dbConnected && rows && rows.length > 0) {
        const user = rows[0];
        let isMatch = false;
        if (user.password && (user.password.startsWith('$2a$') || user.password.startsWith('$2b$'))) {
          isMatch = await bcrypt.compare(cleanPassword, user.password);
        } else if (user.password && user.password === cleanPassword) {
          isMatch = true;
        }

        if (isMatch) {
          if (Boolean(user.is_blocked)) {
            return res.status(403).json({
              success: false,
              is_blocked: true,
              message: "Your account has been blocked. For further information, please contact us at worldnews@timeschicago.com",
            });
          }
          try {
            await db.query('UPDATE users SET updated_at = NOW() WHERE id = ?', [user.id]);
          } catch (e) {}

          authUser = {
            id: user.id,
            full_name: user.full_name,
            email: user.email,
            role: user.role,
            bio: user.bio || '',
            linkedin: user.linkedin || '',
            avatar_url: user.avatar_url || '',
            is_default_admin: Boolean(user.is_default_admin),
            is_blocked: Boolean(user.is_blocked),
          };
          isAuthenticated = true;
        }
      }
    }

    // Handle authentication result
    if (isAuthenticated && authUser) {
      if (authUser.is_blocked) {
        return res.status(403).json({
          success: false,
          is_blocked: true,
          message: "Your account has been blocked. For further information, please contact us at worldnews@timeschicago.com",
        });
      }

      // Clear failed attempts on successful login
      failedAttemptsMap.delete(cleanEmail);

      const jwtSecret = process.env.JWT_SECRET || 'wsj_super_secret_jwt_key_2026_key';
      const token = jwt.sign(
        { id: authUser.id, email: authUser.email, role: authUser.role },
        jwtSecret,
        { expiresIn: '24h' }
      );

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: authUser,
      });
    }

    // Record failed attempt
    const currentAttempts = (attemptData.count || 0) + 1;
    if (currentAttempts >= MAX_FAILED_ATTEMPTS) {
      const lockUntil = Date.now() + LOCKOUT_DURATION_MS;
      failedAttemptsMap.set(cleanEmail, { count: currentAttempts, lockUntil });
      return res.status(429).json({
        success: false,
        message: 'Account locked for 15 minutes due to 5 failed login attempts.',
      });
    } else {
      failedAttemptsMap.set(cleanEmail, { count: currentAttempts, lockUntil: 0 });
      return res.status(401).json({
        success: false,
        message: `Invalid email or password entered. (${currentAttempts}/${MAX_FAILED_ATTEMPTS} attempts before lockout)`,
      });
    }
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
// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const { id: userId, email: userEmail } = req.user;
    const cleanEmail = (userEmail || '').toLowerCase().trim();

    // Query active MySQL Database
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
            bio: user.bio || "",
            linkedin: user.linkedin || "",
            avatar_url: user.avatar_url || "",
            is_default_admin: Boolean(user.is_default_admin),
          },
        });
      }
    } catch (e) {}

    // Fallback to DEFAULT_ACCOUNTS
    const def = DEFAULT_ACCOUNTS[cleanEmail] || Object.values(DEFAULT_ACCOUNTS).find((u) => u.id === Number(userId));

    if (def) {
      const finalUser = {
        id: def.id || userId,
        full_name: def.full_name || "User",
        email: def.email || cleanEmail,
        role: def.role || "reader",
        bio: def.bio || "",
        linkedin: def.linkedin || "",
        avatar_url: def.avatar_url || "",
        is_default_admin: Boolean(def.is_default_admin),
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

    if (user.is_blocked) {
      return res.status(403).json({
        success: false,
        is_blocked: true,
        message: "Your account has been blocked. For further information, please contact us at worldnews@timeschicago.com",
      });
    }

    // 2. Generate JWT Token
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
