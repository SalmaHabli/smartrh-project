// frontend/src/components/MesConges.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MesConges.css';  // ← Import du CSS dédié

const MesConges = () => {
  const [conges, setConges] = useState([]);
  const [solde, setSolde] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    type_conge: 'conges_payes',
    date_debut: '',
    date_fin: '',
    motif: ''
  });

  const token = localStorage.getItem('token');

  // Charger mes congés
  useEffect(() => {
    fetchMesConges();
  }, []);

  const fetchMesConges = async () => {
    try {
      const response = await axios.get('/api/conges/mes-conges', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConges(response.data.conges);
      setSolde(response.data.solde);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/conges', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ Demande envoyée !');
      setFormData({ type_conge: 'conges_payes', date_debut: '', date_fin: '', motif: '' });
      fetchMesConges();
    } catch (err) {
      alert(err.response?.data?.message || '❌ Erreur');
    }
  };

  // Formater la date
  const formatDate = (date) => new Date(date).toLocaleDateString('fr-FR');

  // Status badge
  const getStatutClass = (statut) => {
    switch(statut) {
      case 'en_attente': return 'en-attente';
      case 'approuve': return 'approuve';
      case 'refuse': return 'refuse';
      default: return '';
    }
  };

  const getStatutText = (statut) => {
    switch(statut) {
      case 'en_attente': return 'En attente';
      case 'approuve': return 'Approuvé';
      case 'refuse': return 'Refusé';
      default: return statut;
    }
  };

  if (loading) return <div className="text-center mt-5">Chargement...</div>;

  return (
    <div className="conges-container">
      {/* Cartes de solde */}
      <div className="solde-grid">
        <div className="solde-card conges-payes">
          <h3> Congés payés</h3>
          <div className="jours">{solde?.conges_payes || 0}</div>
          <div className="label">jours restants</div>
        </div>
        <div className="solde-card conges-maladie">
          <h3> Congés maladie</h3>
          <div className="jours">{solde?.conges_maladie || 0}</div>
          <div className="label">jours restants</div>
        </div>
      </div>

      {/* Formulaire de demande */}
      <div className="demande-form">
        <h3> Demander un congé</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group-conge">
              <label>Type</label>
              <select name="type_conge" value={formData.type_conge} onChange={handleChange} required>
                <option value="conges_payes"> Congés payés</option>
                <option value="maladie"> Congé maladie</option>
              </select>
            </div>
            <div className="form-group-conge">
              <label>Date début</label>
              <input type="date" name="date_debut" value={formData.date_debut} onChange={handleChange} required />
            </div>
            <div className="form-group-conge">
              <label>Date fin</label>
              <input type="date" name="date_fin" value={formData.date_fin} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group-conge">
            <label>Motif (optionnel)</label>
            <textarea name="motif" rows="2" value={formData.motif} onChange={handleChange} placeholder="Raison du congé..."></textarea>
          </div>
          <button type="submit" className="btn-envoyer">
             Envoyer la demande
          </button>
        </form>
      </div>

      {/* Tableau des demandes */}
      <div className="demandes-table">
        <h3> Mes demandes de congés</h3>
        {conges.length === 0 ? (
          <div className="empty-message">Aucune demande de congé</div>
        ) : (
          <table className="table-conges">
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Du</th>
                <th>Au</th>
                <th>Jours</th>
                <th>Statut</th>
                <th>Motif</th>
              </tr>
            </thead>
            <tbody>
              {conges.map((conge) => (
                <tr key={conge.id}>
                  <td>{conge.id}</td>
                  <td>{conge.type_conge === 'conges_payes' ? ' Congés payés' : ' Congé maladie'}</td>
                  <td>{formatDate(conge.date_debut)}</td>
                  <td>{formatDate(conge.date_fin)}</td>
                  <td>{conge.nombre_jours_reels}</td>
                  <td><span className={`statut-badge ${getStatutClass(conge.statut)}`}>{getStatutText(conge.statut)}</span></td>
                  <td>{conge.motif || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MesConges;