const express = require('express');
const {
  getAllInventory,
  getInventoryById,
  createInventory,
  updateInventory,
  deleteInventory,
  getEmployees,
  getMyInventory,
} = require('../controllers/inventoryController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();
 
// ORDRE TRÈS IMPORTANT : /my-items AVANT /:id
router.get('/my-items', authenticateToken, getMyInventory);
router.get('/employees/list', authenticateToken, authorizeRoles('Admin', 'RH'), getEmployees);
router.get('/', authenticateToken, getAllInventory);
router.get('/:id', authenticateToken, getInventoryById);
router.post('/', authenticateToken, authorizeRoles('Admin'), createInventory);
router.put('/:id', authenticateToken, authorizeRoles('Admin'), updateInventory);
router.delete('/:id', authenticateToken, authorizeRoles('Admin'), deleteInventory);

module.exports = router;