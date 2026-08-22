const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { get, run, all } = require('../db/database');
const { JWT_SECRET } = require('../middleware/auth');

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

// 1. User Registration (Signup)
async function register(req, res) {
  try {
    const { name, email, password, preferred_currency } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Name must be at least 2 characters.' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const existingUser = await get('SELECT id FROM users WHERE LOWER(email) = ?', [email.toLowerCase().trim()]);
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    const currency = preferred_currency || 'USD';
    const defaultAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name.trim())}`;

    await run(`
      INSERT INTO users (id, name, email, password_hash, avatar_url, preferred_currency, language)
      VALUES (?, ?, ?, ?, ?, ?, 'en')
    `, [userId, name.trim(), email.toLowerCase().trim(), hashedPassword, defaultAvatar, currency]);

    const token = jwt.sign({ id: userId, email: email.toLowerCase().trim(), name: name.trim() }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to GlobeTrotter.',
      token,
      user: {
        id: userId,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        avatar_url: defaultAvatar,
        preferred_currency: currency,
        language: 'en'
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
}

// 2. User Login
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Both email and password are required.' });
    }

    const user = await get('SELECT * FROM users WHERE LOWER(email) = ?', [email.toLowerCase().trim()]);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar_url: user.avatar_url,
        preferred_currency: user.preferred_currency || 'USD',
        language: user.language || 'en'
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error during login.' });
  }
}

// 3. Forgot Password (Generates 6-Digit Code)
async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    const user = await get('SELECT id, email, name FROM users WHERE LOWER(email) = ?', [email.toLowerCase().trim()]);
    if (!user) {
      return res.status(200).json({ success: true, message: 'If that email exists, a password reset code has been sent.' });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    await run(`
      INSERT INTO password_resets (id, email, reset_token, expires_at, used)
      VALUES (?, ?, ?, ?, 0)
    `, [uuidv4(), user.email, resetCode, expiresAt]);

    return res.status(200).json({
      success: true,
      message: 'Password reset code generated successfully.',
      reset_code: resetCode, // Returned directly for hackathon testing demo
      expires_in: '15 minutes'
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ success: false, message: 'Failed to process forgot password request.' });
  }
}

// 4. Reset Password
async function resetPassword(req, res) {
  try {
    const { email, reset_code, new_password } = req.body;

    if (!email || !reset_code || !new_password) {
      return res.status(400).json({ success: false, message: 'Email, reset code, and new password are required.' });
    }

    if (new_password.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
    }

    const resetEntry = await get(`
      SELECT * FROM password_resets 
      WHERE LOWER(email) = ? AND reset_token = ? AND used = 0 AND expires_at > datetime('now')
      ORDER BY created_at DESC LIMIT 1
    `, [email.toLowerCase().trim(), reset_code.trim()]);

    if (!resetEntry) {
      return res.status(400).json({ success: false, message: 'Invalid or expired password reset code.' });
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);
    await run('UPDATE users SET password_hash = ? WHERE LOWER(email) = ?', [hashedPassword, email.toLowerCase().trim()]);
    await run('UPDATE password_resets SET used = 1 WHERE id = ?', [resetEntry.id]);

    return res.status(200).json({
      success: true,
      message: 'Password has been reset successfully. You can now log in.'
    });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ success: false, message: 'Failed to reset password.' });
  }
}

// 5. Get Current Profile
async function getProfile(req, res) {
  try {
    const user = await get('SELECT id, name, email, avatar_url, preferred_currency, language, created_at FROM users WHERE id = ?', [req.user.id]);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    const tripStats = await get('SELECT COUNT(*) AS total_trips FROM trips WHERE user_id = ?', [req.user.id]);
    const wishlistStats = await get('SELECT COUNT(*) AS total_saved FROM saved_destinations WHERE user_id = ?', [req.user.id]);

    return res.status(200).json({
      success: true,
      user: {
        ...user,
        stats: {
          total_trips: tripStats?.total_trips || 0,
          total_saved_destinations: wishlistStats?.total_saved || 0
        }
      }
    });
  } catch (err) {
    console.error('Get profile error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve profile.' });
  }
}

// 6. Update Profile & Preferences
async function updateProfile(req, res) {
  try {
    const { name, avatar_url, preferred_currency, language } = req.body;
    const user = await get('SELECT * FROM users WHERE id = ?', [req.user.id]);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    const newName = name ? name.trim() : user.name;
    const newAvatar = avatar_url !== undefined ? avatar_url : user.avatar_url;
    const newCurrency = preferred_currency || user.preferred_currency || 'USD';
    const newLanguage = language || user.language || 'en';

    await run(`
      UPDATE users
      SET name = ?, avatar_url = ?, preferred_currency = ?, language = ?
      WHERE id = ?
    `, [newName, newAvatar, newCurrency, newLanguage, req.user.id]);

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: { id: req.user.id, name: newName, email: user.email, avatar_url: newAvatar, preferred_currency: newCurrency, language: newLanguage }
    });
  } catch (err) {
    console.error('Update profile error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
}

// 7. Change Password
async function changePassword(req, res) {
  try {
    const { current_password, new_password } = req.body;
    if (!current_password || !new_password) {
      return res.status(400).json({ success: false, message: 'Current password and new password are required.' });
    }

    const user = await get('SELECT * FROM users WHERE id = ?', [req.user.id]);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    const isMatch = await bcrypt.compare(current_password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
    }

    const newHashed = await bcrypt.hash(new_password, 10);
    await run('UPDATE users SET password_hash = ? WHERE id = ?', [newHashed, req.user.id]);

    return res.status(200).json({ success: true, message: 'Password changed successfully.' });
  } catch (err) {
    console.error('Change password error:', err);
    return res.status(500).json({ success: false, message: 'Failed to change password.' });
  }
}

// 8. Delete Account
async function deleteAccount(req, res) {
  try {
    await run('DELETE FROM users WHERE id = ?', [req.user.id]);
    return res.status(200).json({ success: true, message: 'Your account and all travel plans have been permanently deleted.' });
  } catch (err) {
    console.error('Delete account error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete account.' });
  }
}

// 9. Saved Destinations (Wishlist)
async function getSavedDestinations(req, res) {
  try {
    const saved = await all(`
      SELECT c.*, s.created_at AS saved_at
      FROM saved_destinations s
      JOIN cities_catalog c ON s.city_id = c.id
      WHERE s.user_id = ?
      ORDER BY s.created_at DESC
    `, [req.user.id]);

    return res.status(200).json({ success: true, count: saved.length, saved_destinations: saved });
  } catch (err) {
    console.error('Get saved destinations error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch saved destinations.' });
  }
}

// 10. Toggle Wishlist Bookmark
async function toggleSaveDestination(req, res) {
  try {
    const { city_id } = req.body;
    const city = await get('SELECT id, name FROM cities_catalog WHERE id = ?', [city_id]);
    if (!city) return res.status(404).json({ success: false, message: 'City not found.' });

    const existing = await get('SELECT id FROM saved_destinations WHERE user_id = ? AND city_id = ?', [req.user.id, city_id]);

    if (existing) {
      await run('DELETE FROM saved_destinations WHERE id = ?', [existing.id]);
      return res.status(200).json({ success: true, is_saved: false, message: `${city.name} removed from saved places.` });
    } else {
      await run('INSERT INTO saved_destinations (id, user_id, city_id) VALUES (?, ?, ?)', [uuidv4(), req.user.id, city_id]);
      return res.status(201).json({ success: true, is_saved: true, message: `${city.name} added to saved places.` });
    }
  } catch (err) {
    console.error('Toggle saved destination error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update bookmark.' });
  }
}

module.exports = {
  register, login, forgotPassword, resetPassword, getProfile, updateProfile, changePassword, deleteAccount, getSavedDestinations, toggleSaveDestination
};