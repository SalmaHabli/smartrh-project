const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

exports.register = async (req, res) => {
  try {
    const { first_name, last_name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ first_name, last_name, email, password: hashedPassword, role });
    res.status(201).json({ user: newUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Identifiants invalides' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1h' });
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        first_name: user.first_name, 
        last_name: user.last_name, 
        email: user.email, 
        role: user.role, 
        profile_image: user.profile_image,
        phone: user.phone,
        address: user.address,
        position: user.position,
        department: user.department,
        salary: user.salary,
        hire_date: user.hire_date,
        date_of_birth: user.date_of_birth,
        emergency_contact: user.emergency_contact,
        skills: user.skills,
        notes: user.notes
      } 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      first_name, 
      last_name, 
      email, 
      phone, 
      address, 
      date_of_birth, 
      position, 
      department, 
      salary, 
      hire_date, 
      emergency_contact, 
      skills, 
      notes, 
      profile_image 
    } = req.body;

    const result = await pool.query(
      `UPDATE users SET 
        first_name = COALESCE($1, first_name),
        last_name = COALESCE($2, last_name),
        email = COALESCE($3, email),
        phone = COALESCE($4, phone),
        address = COALESCE($5, address),
        date_of_birth = COALESCE($6, date_of_birth),
        position = COALESCE($7, position),
        department = COALESCE($8, department),
        salary = COALESCE($9, salary),
        hire_date = COALESCE($10, hire_date),
        emergency_contact = COALESCE($11, emergency_contact),
        skills = COALESCE($12, skills),
        notes = COALESCE($13, notes),
        profile_image = COALESCE($14, profile_image)
      WHERE id = $15 RETURNING *`,
      [first_name, last_name, email, phone, address, date_of_birth, position, department, salary, hire_date, emergency_contact, skills, notes, profile_image, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Ne pas retourner le mot de passe
    const { password, ...user } = result.rows[0];
    res.json({ user });
  } catch (err) {
    console.error('Erreur updateProfile:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.user;
    const { first_name, last_name, email, profile_image } = req.body;
    const updatedUser = await User.update(id, { first_name, last_name, email, profile_image });
    res.json({ user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};