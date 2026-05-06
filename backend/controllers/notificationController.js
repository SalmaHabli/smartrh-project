const pool = require('../config/database');

// Récupérer toutes les notifications
exports.getAllNotifications = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM notifications ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Créer une nouvelle notification (Admin seulement)
exports.createNotification = async (req, res) => {
  try {
    const { title, message } = req.body;
    
    if (!title || !message) {
      return res.status(400).json({ message: 'Titre et message sont requis' });
    }
    
    const result = await pool.query(
      'INSERT INTO notifications (title, message) VALUES ($1, $2) RETURNING *',
      [title, message]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Supprimer une notification (Admin seulement)
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.query('DELETE FROM notifications WHERE id = $1', [id]);
    res.json({ message: 'Notification supprimée avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};