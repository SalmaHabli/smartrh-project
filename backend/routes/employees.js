const express = require('express');
const {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { validateEmployee, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

router.get('/', authenticateToken, getAllEmployees);
router.get('/:id', authenticateToken, authorizeRoles('Admin', 'RH'), getEmployeeById);
router.post('/', authenticateToken, authorizeRoles('Admin', 'RH'), validateEmployee, handleValidationErrors, createEmployee);
router.put('/:id', authenticateToken, authorizeRoles('Admin', 'RH'), validateEmployee, handleValidationErrors, updateEmployee);
router.delete('/:id', authenticateToken, authorizeRoles('Admin'), deleteEmployee);

module.exports = router;