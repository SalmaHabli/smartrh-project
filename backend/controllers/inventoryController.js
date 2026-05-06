const Inventory = require('../models/Inventory');

exports.getAllInventory = async (req, res) => {
  try {
    const { id: userId, role } = req.user;
    const inventory = await Inventory.findAll(userId, role);
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getInventoryById = async (req, res) => {
  try {
    const { id: userId, role } = req.user;
    const inventory = await Inventory.findById(req.params.id, userId, role);
    if (!inventory) return res.status(404).json({ message: 'Matériel non trouvé' });
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createInventory = async (req, res) => {
  try {
    const newItem = await Inventory.create(req.body);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateInventory = async (req, res) => {
  try {
    const { id: userId, role } = req.user;
    const updatedItem = await Inventory.update(req.params.id, req.body, userId, role);
    if (!updatedItem) return res.status(404).json({ message: 'Matériel non trouvé' });
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteInventory = async (req, res) => {
  try {
    const { id: userId, role } = req.user;
    await Inventory.delete(req.params.id, userId, role);
    res.json({ message: 'Matériel supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getEmployees = async (req, res) => {
  try {
    const employees = await Inventory.getEmployees();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getMyInventory = async (req, res) => {
    try {
      const { id: userId } = req.user;
      console.log('getMyInventory - userId:', userId);
      const inventory = await Inventory.findAll(userId, 'Employee');
      console.log('getMyInventory - inventory:', inventory);
      res.json(inventory);
    } catch (err) {
      console.error('getMyInventory error:', err);
      res.status(500).json({ message: err.message });
    }
  };