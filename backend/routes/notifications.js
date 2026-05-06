const express = require('express');
const router = express.Router();
const { getAllNotifications, createNotification, deleteNotification } = require('../controllers/notificationController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Tous les utilisateurs peuvent voir les notifications
router.get('/', authenticateToken, getAllNotifications);

// Seul Admin peut créer et supprimer
router.post('/', authenticateToken, authorizeRoles('Admin'), createNotification);
router.delete('/:id', authenticateToken, authorizeRoles('Admin'), deleteNotification);

module.exports = router;