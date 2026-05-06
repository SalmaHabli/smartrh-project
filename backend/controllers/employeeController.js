const Employee = require('../models/Employee');

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employé non trouvé' });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createEmployee = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, position, department, salary, hire_date, responsable, matricule } = req.body;
    const newEmployee = await Employee.create({ first_name, last_name, email, phone, position, department, salary, hire_date, responsable, matricule });
    res.status(201).json(newEmployee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, position, department, salary, hire_date, responsable, matricule } = req.body;
    const updatedEmployee = await Employee.update(req.params.id, { first_name, last_name, email, phone, position, department, salary, hire_date, responsable, matricule });
    if (!updatedEmployee) return res.status(404).json({ message: 'Employé non trouvé' });
    res.json(updatedEmployee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    await Employee.delete(req.params.id);
    res.json({ message: 'Employé supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};