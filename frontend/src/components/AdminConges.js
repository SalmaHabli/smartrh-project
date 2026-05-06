// frontend/src/components/AdminConges.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminConges = () => {
  const [conges, setConges] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchConges();
  }, []);

  const fetchConges = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/conges/admin', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConges(response.data);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, statut) => {
    if (!window.confirm(`Êtes-vous sûr de ${statut === 'approuve' ? 'approuver' : 'refuser'} cette demande ?`)) return;
    
    try {
      await axios.put(`http://localhost:5000/api/conges/${id}`, { statut }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(`Demande ${statut === 'approuve' ? 'approuvée' : 'refusée'} !`);
      fetchConges();
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur');
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString('fr-FR');

  const StatusBadge = ({ statut }) => {
    const styles = {
      en_attente: 'badge bg-warning text-dark',
      approuve: 'badge bg-success',
      refuse: 'badge bg-danger',
      annule: 'badge bg-secondary'
    };
    const texts = {
      en_attente: 'En attente',
      approuve: 'Approuvé',
      refuse: 'Refusé',
      annule: 'Annulé'
    };
    return <span className={styles[statut]}>{texts[statut]}</span>;
  };

  if (loading) return <div className="text-center mt-5">Chargement...</div>;

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header bg-dark text-white">
          <h4 className="mb-0"> Gestion des demandes de congés</h4>
        </div>
        <div className="card-body">
          {conges.length === 0 ? (
            <p className="text-muted">Aucune demande en attente</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Employé</th>
                    <th>Type</th>
                    <th>Du</th>
                    <th>Au</th>
                    <th>Jours</th>
                    <th>Statut</th>
                    <th>Motif</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {conges.map((conge) => (
                    <tr key={conge.id}>
                      <td>{conge.id}</td>
                      <td>{conge.first_name} {conge.last_name}</td>
                      <td>{conge.type_conge === 'conges_payes' ? 'Congés payés' : conge.type_conge === 'rtt' ? '⚡ RTT' : '🤒 Congé maladie'}</td>
                      <td>{formatDate(conge.date_debut)}</td>
                      <td>{formatDate(conge.date_fin)}</td>
                      <td>{conge.nombre_jours_reels}</td>
                      <td><StatusBadge statut={conge.statut} /></td>
                      <td>{conge.motif || '-'}</td>
                      <td>
                        {conge.statut === 'en_attente' && (
                          <>
                            <button className="btn btn-sm btn-success me-1" onClick={() => handleUpdate(conge.id, 'approuve')}>✅</button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleUpdate(conge.id, 'refuse')}>❌</button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminConges;