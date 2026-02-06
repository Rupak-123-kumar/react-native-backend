const express = require('express');
const { getProfile, updateProfile } = require('../controllers/profileController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// 🔐 Protected profile routes
router.get('/:id', protect, getProfile);
router.put('/:id', protect, updateProfile);

module.exports = router;
