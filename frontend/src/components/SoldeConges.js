// frontend/src/components/SoldeConges.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SoldeConges = () => {
  const [solde, setSolde] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchSolde();
  }, []);

  const fetchSolde = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/conges/solde', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Solde reçu:', response.data);
      setSolde(response.data);
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.response?.data?.message || 'Erreur de chargement du solde');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-5">Chargement...</div>;
  if (error) return <div className="alert alert-danger m-4">{error}</div>;

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0"> Mon Solde de Congés</h4>
        </div>
        <div className="card-body">
          <div className="row text-center">
            {/* Congés payés - 18 jours selon loi marocaine */}
            <div className="col-md-6 mb-3">
              <div className="card bg-success text-white">
                <div className="card-body">
                  <h5> Congés payés</h5>
                  <h2 className="display-4">{solde?.conges_payes || 0}</h2>
                  <span>jours restants</span>
                  <p className="small mt-2">(18 jours/an selon Code du Travail)</p>
                </div>
              </div>
            </div>

            {/* Congés maladie - 180 jours selon loi marocaine */}
            <div className="col-md-6 mb-3">
              <div className="card bg-warning text-dark">
                <div className="card-body">
                  <h5> Congés maladie</h5>
                  <h2 className="display-4">{solde?.conges_maladie || 0}</h2>
                  <span>jours restants</span>
                  <p className="small mt-2">(180 jours de protection CNSS)</p>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-muted text-center mt-3">
            Année de référence : {solde?.annee || new Date().getFullYear()}
          </p>
          
          <div className="alert alert-info mt-3 small">
             <strong>Information légale (Maroc) :</strong><br />
            • Congés payés : 1,5 jour par mois de travail (18 jours/an)<br />
            • Congés maladie : 180 jours de protection contre le licenciement sur 12 mois
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoldeConges;