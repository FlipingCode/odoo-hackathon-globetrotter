const express = require('express');
const router = express.Router();
const authController = require('src/controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// Public Authentication
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Protected User Management & Profile
router.get('/profile', authenticateToken, authController.getProfile);
router.put('/profile', authenticateToken, authController.updateProfile);
router.put('/change-password', authenticateToken, authController.changePassword);
router.delete('/account', authenticateToken, authController.deleteAccount);

// Saved Destinations / Wishlist
router.get('/saved-destinations', authenticateToken, authController.getSavedDestinations);
router.post('/saved-destinations/toggle', authenticateToken, authController.toggleSaveDestination);

module.exports = router;