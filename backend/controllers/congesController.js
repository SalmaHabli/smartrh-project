// backend/controllers/congesController.js
const Conge = require('../models/Conge');
const pool = require('../config/database');
const Holidays = require('date-holidays');

// ─────────────────────────────────────────────────────────────
// HELPER : Valider les dates
// ─────────────────────────────────────────────────────────────
const validerDates = (date_debut, date_fin) => {
  const aujourd_hui = new Date();
  aujourd_hui.setHours(0, 0, 0, 0);

  const debut = new Date(date_debut);
  const fin = new Date(date_fin);

  // Vérifier que les dates sont valides
  if (isNaN(debut.getTime()) || isNaN(fin.getTime())) {
    return { valide: false, message: 'Dates invalides. Veuillez entrer des dates au format YYYY-MM-DD.' };
  }

  // 1. La date de début ne peut pas être dans le passé
  if (debut < aujourd_hui) {
    const dateAujourdhui = aujourd_hui.toISOString().split('T')[0];
    return {
      valide: false,
      message: `La date de début (${date_debut}) ne peut pas être dans le passé. La date minimale autorisée est : ${dateAujourdhui}.`
    };
  }

  // 2. La date de fin doit être >= date de début
  if (fin < debut) {
    return {
      valide: false,
      message: `La date de fin (${date_fin}) ne peut pas être antérieure à la date de début (${date_debut}).`
    };
  }

  return { valide: true };
};

// ─────────────────────────────────────────────────────────────
// HELPER : Récupérer les jours fériés marocains pour une année
// ─────────────────────────────────────────────────────────────
const getJoursFeriesMaroc = (annee) => {
  const hd = new Holidays('MA');
  hd.setLanguages('fr');
  const jours = hd.getHolidays(annee);
  // On ne garde que les jours fériés publics
  return jours
    .filter(j => j.type === 'public')
    .map(j => j.date.split(' ')[0]); // ["2026-01-01", "2026-05-01", ...]
};

// ─────────────────────────────────────────────────────────────
// Créer une demande de congé
// ─────────────────────────────────────────────────────────────
exports.createConge = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { type_conge, date_debut, date_fin, motif } = req.body;

    // ✅ 1. Validation des dates (passé + cohérence début/fin)
    const validation = validerDates(date_debut, date_fin);
    if (!validation.valide) {
      return res.status(400).json({ message: validation.message });
    }

    // ✅ 2. Vérifier le solde
    const solde = await Conge.getSolde(user_id);
    const joursReels = await Conge.calculerJoursTravailles(date_debut, date_fin);

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

    // ✅ 3. Créer la demande
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

// ─────────────────────────────────────────────────────────────
// Récupérer mes congés (utilisateur connecté seulement)
// ─────────────────────────────────────────────────────────────
exports.getMesConges = async (req, res) => {
  try {
    const user_id = req.user.id;
    const conges = await Conge.findByUser(user_id);
    const solde = await Conge.getSolde(user_id);
    res.json({ conges, solde });
  } catch (err) {
    console.error('Erreur get mes conges:', err);
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// Récupérer tous les congés (Admin ou RH uniquement)
// ─────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────
// Valider / Refuser une demande (Admin ou RH seulement)
// ─────────────────────────────────────────────────────────────
exports.updateConge = async (req, res) => {
  try {
    const user_role = req.user.role;

    if (user_role !== 'Admin' && user_role !== 'RH') {
      return res.status(403).json({ message: 'Accès non autorisé. Seul Admin ou RH peut approuver/refuser.' });
    }

    const { id } = req.params;
    const { statut } = req.body;

    if (!['approuve', 'refuse', 'annule'].includes(statut)) {
      return res.status(400).json({ message: 'Statut invalide' });
    }

    const conge = await Conge.updateStatut(id, statut, user_role);
    if (!conge) {
      return res.status(404).json({ message: 'Demande non trouvée' });
    }

    const message =
      statut === 'approuve'
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

// ─────────────────────────────────────────────────────────────
// Récupérer mon solde
// ─────────────────────────────────────────────────────────────
exports.getMonSolde = async (req, res) => {
  try {
    const user_id = req.user.id;
    const solde = await Conge.getSolde(user_id);

    // Maroc : 18 jours congés payés, 180 jours maladie, pas de RTT
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

// ─────────────────────────────────────────────────────────────
// Supprimer une demande de congé
// ─────────────────────────────────────────────────────────────
exports.deleteConge = async (req, res) => {
  try {
    const { id } = req.params;
    const conge = await Conge.findById(id);

    if (!conge) {
      return res.status(404).json({ message: 'Demande non trouvée' });
    }

    // Admin ou l'utilisateur qui a créé la demande
    if (req.user.role !== 'Admin' && conge.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    // Impossible de supprimer une demande déjà approuvée
    if (conge.statut === 'approuve') {
      return res.status(400).json({ message: 'Impossible de supprimer une demande déjà approuvée' });
    }

    const query = 'DELETE FROM conges WHERE id = $1 RETURNING *';
    await pool.query(query, [id]);

    res.json({ message: 'Demande supprimée avec succès' });
  } catch (err) {
    console.error('Erreur delete conge:', err);
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// Obtenir les jours fériés marocains pour une année
// (utilise la bibliothèque date-holidays)
// ─────────────────────────────────────────────────────────────
exports.getJoursFeries = async (req, res) => {
  try {
    const annee = parseInt(req.params.annee) || new Date().getFullYear();

    const hd = new Holidays('MA');
    hd.setLanguages('fr'); // Noms en français

    const jours = hd.getHolidays(annee);

    // Filtrer uniquement les jours fériés publics et formater la réponse
    const joursFeries = jours
      .filter(j => j.type === 'public')
      .map(j => ({
        date: j.date.split(' ')[0],   // "2026-01-01"
        nom: j.name,                   // "Nouvel an" en français
        type: j.type                   // "public"
      }));

    res.json(joursFeries);
  } catch (err) {
    console.error('Erreur get jours feries:', err);
    res.status(500).json({ message: err.message });
  }
};
