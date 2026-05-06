// backend/routes/conges.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  createConge,
  getMesConges,
  getAllConges,
  updateConge,
  getMonSolde,
  deleteConge,
  getJoursFeries
} = require('../controllers/congesController');

// Routes protégées
router.post('/', authenticateToken, createConge);
router.get('/mes-conges', authenticateToken, getMesConges);
router.get('/solde', authenticateToken, getMonSolde);
router.get('/admin', authenticateToken, getAllConges);
router.get('/jours-feries/:annee?', authenticateToken, getJoursFeries);
router.put('/:id', authenticateToken, updateConge);
router.delete('/:id', authenticateToken, deleteConge);

module.exports = router;