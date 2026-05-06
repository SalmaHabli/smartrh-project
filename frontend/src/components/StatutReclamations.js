import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StatutReclamations = () => {
  const [statuts, setStatuts] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Simulation
    setStatuts([
      { id: 1, sujet: 'Problème de salaire', statut: 'En cours', date: '2026-01-01' },
      { id: 2, sujet: 'Conditions de travail', statut: 'Résolue', date: '2026-02-15' }
    ]);
  }, []);

  return (
    <div className="centered-content">
      <h2>Statut des Réclamations</h2>
      {error && <p className="error">{error}</p>}
      {statuts.length === 0 ? (
        <p>Aucun statut disponible.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Sujet</th>
              <th>Statut</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {statuts.map(stat => (
              <tr key={stat.id}>
                <td>{stat.sujet}</td>
                <td>{stat.statut}</td>
                <td>{stat.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button onClick={() => navigate('/dashboard')}>Retour au Dashboard</button>
    </div>
  );
};

export default StatutReclamations;