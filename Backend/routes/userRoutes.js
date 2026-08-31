const express = require('express');
const router = express.Router();
const { updateProfile, getProfile } = require('../controllers/userController');

router.get('/profile', getProfile);
router.post('/profile', updateProfile);

module.exports = router;
