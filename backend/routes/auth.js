const express = require('express');
const { register, login, updateProfile, updateUser } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.put('/update', authenticateToken, updateProfile);  // AJOUTÉ
router.put('/user/:id', authenticateToken, updateUser);

module.exports = router;