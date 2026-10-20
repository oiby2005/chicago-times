const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendPasswordResetEmail } = require('../lib/mailer');
const { evaluateContributor } = require('./contributorController');

// Strict Default Admin Emails list for authorization and verification
const DEFAULT_ADMIN_EMAILS = [
  'akramyoonos006@gmail.com',
  'geethliyanage979@gmail.com',
  'timeschicago17@gmail.com',
];

// In-memory failed login attempts & lockout tracking
const failedAttemptsMap = new Map();
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

const recordFailedAttempt = (cleanEmail, attemptData, res) => {
  const currentAttempts = (attemptData.count || 0) + 1;
  if (currentAttempts >= MAX_FAILED_ATTEMPTS) {
    const lockUntil = Date.now() + LOCKOUT_DURATION_MS;
    failedAttemptsMap.set(cleanEmail, { count: currentAttempts, lockUntil });
    return res.status(429).json({
      success: false,
      message: 'Account locked for 15 minutes due to 5 consecutive failed login attempts.',
    });
  } else {
    failedAttemptsMap.set(cleanEmail, { count: currentAttempts, lockUntil: 0 });
    return res.status(401).json({
      success: false,
      message: `Invalid email or password entered. (${currentAttempts}/${MAX_FAILED_ATTEMPTS} attempts before lockout)`,
    });
  }
};

// @desc    Authenticate user & get token strictly via MySQL Database with Bcrypt
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

    // Query active MySQL Database
    let rows = [];
    try {
      [rows] = await db.query(
        'SELECT id, full_name, email, password, role, writer_type, cycle_started_at, block_reason, bio, linkedin, avatar_url, is_default_admin, is_blocked FROM users WHERE LOWER(email) = ?',
        [cleanEmail]
      );
    } catch (dbErr) {
      console.error('MySQL DB Connection Failure during login:', dbErr.message);
      return res.status(500).json({
        success: false,
        message: 'Database connection error during authentication.',
      });
    }

    if (!rows || rows.length === 0) {
      return recordFailedAttempt(cleanEmail, attemptData, res);
    }

    let user = rows[0];

    // If contributor, evaluate quota status before authenticating
    if ((user.role || '').toLowerCase() === 'writer' && (user.writer_type || '').toLowerCase() === 'contributor') {
      const evaluation = await evaluateContributor(user);
      if (evaluation.is_blocked) {
        user.is_blocked = 1;
        user.block_reason = evaluation.block_reason;
      }
    }

    // Check if user is blocked
    if (Boolean(user.is_blocked)) {
      const isContributor = (user.writer_type || '').toLowerCase() === 'contributor';
      const exactMsg = isContributor
        ? 'Your Contributor account has been suspended. To appeal or reactivate your account, please contact us via email at worldnews@timeschicago.com'
        : 'Your account has been suspended. To appeal or reactivate your account, please contact us via email at worldnews@timeschicago.com';
      return res.status(403).json({
        success: false,
        is_blocked: true,
        is_contributor: isContributor,
        writer_type: user.writer_type || 'staff',
        block_reason: user.block_reason || exactMsg,
        message: exactMsg,
        contact_email: 'worldnews@timeschicago.com',
      });
    }

    // Verify Password strictly using Bcrypt (with auto-upgrade if legacy plaintext is encountered)
    let isMatch = false;
    if (user.password && (user.password.startsWith('$2a$') || user.password.startsWith('$2b$'))) {
      isMatch = await bcrypt.compare(cleanPassword, user.password);
    } else if (user.password && user.password === cleanPassword) {
      isMatch = true;
      try {
        const upgradedHash = await bcrypt.hash(cleanPassword, 12);
        await db.query('UPDATE users SET password = ? WHERE id = ?', [upgradedHash, user.id]);
        console.log(`[Security] Upgraded legacy password hash to bcrypt (12 rounds) for user: ${cleanEmail}`);
      } catch (hashErr) {
        console.warn('Failed to auto-upgrade legacy password hash:', hashErr.message);
      }
    }

    if (!isMatch) {
      return recordFailedAttempt(cleanEmail, attemptData, res);
    }

    // Successful Login -> Clear failed attempts
    failedAttemptsMap.delete(cleanEmail);

    try {
      await db.query('UPDATE users SET updated_at = NOW() WHERE id = ?', [user.id]);
    } catch (e) {}

    const isDefaultAdmin = Boolean(user.is_default_admin || DEFAULT_ADMIN_EMAILS.includes(cleanEmail));
    const authUser = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      writer_type: user.writer_type || 'staff',
      cycle_started_at: user.cycle_started_at,
      bio: user.bio || '',
      linkedin: user.linkedin || '',
      avatar_url: user.avatar_url || '',
      is_default_admin: isDefaultAdmin,
      is_blocked: false,
    };

    const jwtSecret = process.env.JWT_SECRET || 'wsj_super_secret_jwt_key_2026_key';
    const token = jwt.sign(
      { id: authUser.id, email: authUser.email, role: authUser.role, writer_type: authUser.writer_type },
      jwtSecret,
      { expiresIn: '24h' }
    );

    const isProduction = process.env.NODE_ENV === 'production';
    // Set strict HttpOnly session cookie without expires/maxAge so it automatically expires on browser close
    res.cookie('wsj_session_token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      path: '/',
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: authUser,
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

    // Query active MySQL Database
    try {
      const [rows] = await db.query(
        'SELECT id, full_name, email, role, writer_type, cycle_started_at, block_reason, bio, linkedin, avatar_url, is_default_admin, is_blocked, created_at FROM users WHERE id = ? OR LOWER(email) = ?',
        [userId, cleanEmail]
      );
      if (rows && rows.length > 0) {
        const user = rows[0];
        return res.status(200).json({
          success: true,
          user: {
            id: user.id,
            full_name: user.full_name,
            email: user.email,
            role: user.role,
            writer_type: user.writer_type || 'staff',
            cycle_started_at: user.cycle_started_at,
            block_reason: user.block_reason,
            bio: user.bio || '',
            linkedin: user.linkedin || '',
            avatar_url: user.avatar_url || '',
            is_default_admin: Boolean(user.is_default_admin || DEFAULT_ADMIN_EMAILS.includes(user.email.toLowerCase())),
            is_blocked: Boolean(user.is_blocked),
          },
        });
      }
    } catch (e) {
      console.error('getMe database query error:', e.message);
    }

    return res.status(404).json({
      success: false,
      message: 'User profile not found in database.',
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

    const isProduction = process.env.NODE_ENV === 'production';
    // Set strict HttpOnly session cookie for Google login
    res.cookie('wsj_session_token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      path: '/',
    });

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

// @desc    Logout user & clear httpOnly session cookie
// @desc    Logout user & clear httpOnly session cookie
// @route   POST /api/auth/logout
// @access  Public
const logout = async (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.clearCookie('wsj_session_token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    path: '/',
  });
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

// @desc    Generate password reset token & email secure link
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Query active MySQL Database
    let rows = [];
    try {
      [rows] = await db.query(
        'SELECT id, full_name, email FROM users WHERE LOWER(email) = ?',
        [cleanEmail]
      );
    } catch (dbErr) {
      console.error('Database query error during forgotPassword:', dbErr.message);
      return res.status(500).json({
        success: false,
        message: 'Database connection error.',
      });
    }

    // Anti-enumeration: Return success even if email is not found
    if (!rows || rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email address, a password reset link has been dispatched.',
      });
    }

    const user = rows[0];

    // Generate 32-byte cryptographically secure random token
    const rawResetToken = crypto.randomBytes(32).toString('hex');

    // SHA-256 hash token for database storage
    const hashedToken = crypto.createHash('sha256').update(rawResetToken).digest('hex');

    // Token expires in 1 hour
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await db.query(
      'UPDATE users SET reset_password_token = ?, reset_password_expires = ? WHERE id = ?',
      [hashedToken, expiresAt, user.id]
    );

    // Determine frontend URL
    const origin = req.headers.origin || process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetUrl = `${origin}/reset-password?token=${rawResetToken}`;

    // Send email with Times Chicago branding
    try {
      await sendPasswordResetEmail({
        name: user.full_name,
        email: user.email,
        resetToken: rawResetToken,
        resetUrl,
      });
    } catch (mailErr) {
      console.warn(`[Reset Mail Error] Could not deliver email to ${cleanEmail}:`, mailErr.message);
    }

    return res.status(200).json({
      success: true,
      message: 'If an account exists with this email address, a password reset link has been dispatched.',
      ...(process.env.NODE_ENV !== 'production' ? { devResetUrl: resetUrl } : {}),
    });
  } catch (error) {
    console.error('forgotPassword controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error processing password reset request.',
    });
  }
};

// @desc    Verify if a password reset token is valid & not expired
// @route   GET /api/auth/verify-reset-token
// @access  Public
const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token || typeof token !== 'string') {
      return res.status(400).json({
        success: false,
        valid: false,
        message: 'Reset token is missing.',
      });
    }

    const hashedToken = crypto.createHash('sha256').update(token.trim()).digest('hex');

    const [rows] = await db.query(
      'SELECT id, email, reset_password_expires FROM users WHERE reset_password_token = ? AND reset_password_expires > NOW()',
      [hashedToken]
    );

    if (!rows || rows.length === 0) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: 'This password reset link is invalid or has expired. Please request a new one.',
      });
    }

    const user = rows[0];
    const emailParts = user.email.split('@');
    const maskedUser = emailParts[0].length > 2 
      ? emailParts[0].charAt(0) + '*'.repeat(emailParts[0].length - 2) + emailParts[0].slice(-1)
      : emailParts[0];
    const maskedEmail = `${maskedUser}@${emailParts[1]}`;

    return res.status(200).json({
      success: true,
      valid: true,
      email: maskedEmail,
      message: 'Token is valid.',
    });
  } catch (error) {
    console.error('verifyResetToken controller error:', error);
    return res.status(500).json({
      success: false,
      valid: false,
      message: 'Server error validating reset token.',
    });
  }
};

// @desc    Reset user password using valid token
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Password reset token is required.',
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a new password.',
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.',
      });
    }

    // Password strength enforcement per fullstack-security-standards:
    // Min 8 chars, 1 uppercase, 1 number, 1 special character
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 number, and 1 special character.',
      });
    }

    // Hash token to verify against database
    const hashedToken = crypto.createHash('sha256').update(token.trim()).digest('hex');

    const [rows] = await db.query(
      'SELECT id, email FROM users WHERE reset_password_token = ? AND reset_password_expires > NOW()',
      [hashedToken]
    );

    if (!rows || rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'This password reset link is invalid or has expired. Please request a new one.',
      });
    }

    const user = rows[0];

    // Hash new password using bcrypt (12 rounds) per security standards
    const hashedPassword = await bcrypt.hash(password.trim(), 12);

    // Update password in database & invalidate the token immediately
    await db.query(
      'UPDATE users SET password = ?, reset_password_token = NULL, reset_password_expires = NULL, updated_at = NOW() WHERE id = ?',
      [hashedPassword, user.id]
    );

    console.log(`[Security] Successfully reset password for user: ${user.email}`);

    return res.status(200).json({
      success: true,
      message: 'Your password has been successfully reset! You can now log in with your new password.',
    });
  } catch (error) {
    console.error('resetPassword controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error resetting password.',
    });
  }
};

module.exports = {
  login,
  getMe,
  googleLogin,
  logout,
  forgotPassword,
  verifyResetToken,
  resetPassword,
};
