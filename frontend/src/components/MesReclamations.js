import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MesReclamations = () => {
  const [reclamations, setReclamations] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Simulation
    setReclamations([
      { id: 1, sujet: 'Problème de salaire', categorie: 'salaire', statut: 'En cours' },
      { id: 2, sujet: 'Conditions de travail', categorie: 'conditions', statut: 'Résolue' }
    ]);
  }, []);

  return (
    <div className="centered-content">
      <h2>Mes Réclamations</h2>
      {error && <p className="error">{error}</p>}
      {reclamations.length === 0 ? (
        <p>Aucune réclamation.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Sujet</th>
              <th>Catégorie</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {reclamations.map(rec => (
              <tr key={rec.id}>
                <td>{rec.sujet}</td>
                <td>{rec.categorie}</td>
                <td>{rec.statut}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button onClick={() => navigate('/dashboard')}>Retour au Dashboard</button>
    </div>
  );
};

export default MesReclamations;