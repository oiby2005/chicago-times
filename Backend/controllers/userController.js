const db = require('../config/db');

let memoryUsers = {};

const updateProfile = async (req, res) => {
  try {
    const profile = req.body;
    if (!profile || !profile.email) {
      return res.status(400).json({ success: false, message: 'User email is required.' });
    }

    const emailKey = profile.email.toLowerCase().trim();
    memoryUsers[emailKey] = {
      ...memoryUsers[emailKey],
      ...profile,
      updatedAt: Date.now(),
    };

    try {
      await db.query(`
        UPDATE users
        SET full_name = ?, updated_at = NOW()
        WHERE LOWER(email) = ?
      `, [profile.full_name || profile.name || "User", emailKey]);
    } catch (dbErr) {
      console.warn("MySQL Profile Update Warning:", dbErr.message);
    }

    return res.status(200).json({ success: true, message: 'Profile updated successfully', user: memoryUsers[emailKey] });
  } catch (error) {
    console.error('updateProfile error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating profile.' });
  }
};

const getProfile = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ success: false, message: 'User email is required.' });
    }

    const emailKey = String(email).toLowerCase().trim();
    if (memoryUsers[emailKey]) {
      return res.status(200).json({ success: true, user: memoryUsers[emailKey] });
    }

    try {
      const [rows] = await db.query('SELECT * FROM users WHERE LOWER(email) = ?', [emailKey]);
      if (rows && rows.length > 0) {
        const u = rows[0];
        const user = {
          full_name: u.full_name,
          email: u.email,
          role: u.role,
        };
        memoryUsers[emailKey] = user;
        return res.status(200).json({ success: true, user });
      }
    } catch (dbErr) {}

    return res.status(404).json({ success: false, message: 'User profile not found.' });
  } catch (error) {
    console.error('getProfile error:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching profile.' });
  }
};

module.exports = {
  updateProfile,
  getProfile,
};
