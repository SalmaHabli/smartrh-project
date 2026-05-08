// backend/server.js
const express = require('express');
const app = require('./app');
require('dotenv').config();

// ⚠️ IMPORTANT : Charger les routes AVANT app.listen()
const authRoutes = require('./routes/auth');
const notificationRoutes = require('./routes/notifications');

// Middleware
app.use(express.json());

// ⚠️ IMPORTANT : Enregistrer les routes AVANT app.listen()
app.use('/api/auth', authRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/conges', require('./routes/conges'));
app.use('/api/employees', require('./routes/employees'));
app.use('/api/inventory', require('./routes/inventory'));

// Route pour la racine
app.get('/', (req, res) => {
  res.json({ 
    message: 'SmartHR Backend API is running!', 
    status: 'OK',
    version: '1.0.0'
  });
});

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Gestion des routes non trouvées (404)
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path
  });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message
  });
});

// ⚠️ IMPORTANT : Lancer le serveur APRÈS toutes les routes
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api/health`);
});