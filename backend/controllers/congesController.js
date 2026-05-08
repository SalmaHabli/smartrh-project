// backend/controllers/congesController.js
const Conge = require('../models/Conge');
const pool = require('../config/database');

// Créer une demande de congé
exports.createConge = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { type_conge, date_debut, date_fin, motif } = req.body;
    
    // Vérifier le solde
    const solde = await Conge.getSolde(user_id);
    const joursReels = await Conge.calculerJoursTravailles(date_debut, date_fin);
    
    // Vérifier le type de congé
    let soldeDisponible = 0;
    if (type_conge === 'conges_payes') {
      soldeDisponible = solde.conges_payes;
    } else if (type_conge === 'rtt') {
      soldeDisponible = solde.rtt;
    } else if (type_conge === 'maladie') {
      soldeDisponible = solde.conges_maladie;
    }
    
    if (soldeDisponible < joursReels) {
      return res.status(400).json({ 
        message: `Solde insuffisant. Il vous reste ${soldeDisponible} jours pour ce type de congé.` 
      });
    }
    
    const conge = await Conge.create({
      user_id,
      type_conge,
      date_debut,
      date_fin,
      motif
    });
    
    res.status(201).json({ message: 'Demande de congé envoyée avec succès', conge });
  } catch (err) {
    console.error('Erreur creation conge:', err);
    res.status(500).json({ message: err.message });
  }
};

// Récupérer mes congés (seulement ceux de l'utilisateur connecté)
exports.getMesConges = async (req, res) => {
    try {
      const user_id = req.user.id;  // ← ID de l'utilisateur connecté
      const conges = await Conge.findByUser(user_id);  // ← Filtre par user_id
      const solde = await Conge.getSolde(user_id);
      res.json({ conges, solde });
    } catch (err) {
      console.error('Erreur get mes conges:', err);
      res.status(500).json({ message: err.message });
    }
};


// Récupérer tous les congés (Admin ou RH)
exports.getAllConges = async (req, res) => {
  try {
    if (req.user.role !== 'Admin' && req.user.role !== 'RH') {
      return res.status(403).json({ message: 'Accès non autorisé. Réservé aux administrateurs et RH.' });
    }
    const conges = await Conge.findAll();
    res.json(conges);
  } catch (err) {
    console.error('Erreur get all conges:', err);
    res.status(500).json({ message: err.message });
  }
};

// Valider/Refuser une demande (Admin ou RH seulement) - VERSION CORRIGÉE
exports.updateConge = async (req, res) => {
  try {
    const user_role = req.user.role;
    
    // ✅ Vérifier que l'utilisateur est Admin ou RH
    if (user_role !== 'Admin' && user_role !== 'RH') {
      return res.status(403).json({ message: 'Accès non autorisé. Seul Admin ou RH peut approuver/refuser.' });
    }
    
    const { id } = req.params;
    const { statut } = req.body;
    
    if (!['approuve', 'refuse', 'annule'].includes(statut)) {
      return res.status(400).json({ message: 'Statut invalide' });
    }
    
    // ✅ Passer le rôle à la fonction updateStatut
    const conge = await Conge.updateStatut(id, statut, user_role);
    if (!conge) {
      return res.status(404).json({ message: 'Demande non trouvée' });
    }
    
    const message = statut === 'approuve' 
      ? 'Demande approuvée avec succès' 
      : statut === 'refuse' 
        ? 'Demande refusée' 
        : 'Demande annulée';
    
    res.json({ message, conge });
  } catch (err) {
    console.error('Erreur update conge:', err);
    res.status(500).json({ message: err.message });
  }
};

// Récupérer mon solde
exports.getMonSolde = async (req, res) => {
  try {
    const user_id = req.user.id;
    const solde = await Conge.getSolde(user_id);
    
    // Pour le Maroc : congés payés = 18 jours, pas de RTT
    const soldeMaroc = {
      conges_payes: solde.conges_payes || 18,
      conges_maladie: solde.conges_maladie || 180,
      annee: solde.annee || new Date().getFullYear()
    };
    
    res.json(soldeMaroc);
  } catch (err) {
    console.error('Erreur get solde:', err);
    res.status(500).json({ message: err.message });
  }
};

// Supprimer une demande de congé (Admin ou l'utilisateur lui-même)
exports.deleteConge = async (req, res) => {
  try {
    const { id } = req.params;
    const conge = await Conge.findById(id);
    
    if (!conge) {
      return res.status(404).json({ message: 'Demande non trouvée' });
    }
    
    // Vérifier les droits : Admin ou l'utilisateur qui a créé la demande
    if (req.user.role !== 'Admin' && conge.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    
    // Si la demande est déjà approuvée, on ne peut pas la supprimer
    if (conge.statut === 'approuve') {
      return res.status(400).json({ message: 'Impossible de supprimer une demande déjà approuvée' });
    }
    
    const query = 'DELETE FROM conges WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    
    res.json({ message: 'Demande supprimée avec succès' });
  } catch (err) {
    console.error('Erreur delete conge:', err);
    res.status(500).json({ message: err.message });
  }
};

// Obtenir les jours fériés pour une année
exports.getJoursFeries = async (req, res) => {
  try {
    const annee = req.params.annee || new Date().getFullYear();
    
    // Jours fériés fixes au Maroc
    const joursFeries = [
      { date: `${annee}-01-01`, nom: "Nouvel an" },
      { date: `${annee}-01-11`, nom: "Manifeste de l'indépendance" },
      { date: `${annee}-01-14`, nom: "Nouvel an Amazigh (Yennayer)" },
      { date: `${annee}-05-01`, nom: "Fête du travail" },
      { date: `${annee}-07-30`, nom: "Fête du Trône" },
      { date: `${annee}-08-14`, nom: "Oued Ed-Dahab" },
      { date: `${annee}-08-20`, nom: "Révolution du Roi et du Peuple" },
      { date: `${annee}-08-21`, nom: "Fête de la Jeunesse" },
      { date: `${annee}-10-31`, nom: "Fête de l'Unité" },
      { date: `${annee}-11-06`, nom: "Marche Verte" },
      { date: `${annee}-11-18`, nom: "Fête de l'Indépendance" }
    ];
    
    res.json(joursFeries);
  } catch (err) {
    console.error('Erreur get jours feries:', err);
    res.status(500).json({ message: err.message });
  }
};