import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const DemanderConge = () => {
  const [form, setForm] = useState({
    type: 'annuel',
    dateDebut: '',
    dateFin: '',
    raison: ''
  });
  const [conges, setConges] = useState([]); // Liste des congés
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Simulation de chargement des congés (remplacez par api.get('/conges'))
    const fetchConges = async () => {
      try {
        setConges([
          { id: 1, type: 'annuel', dateDebut: '2026-01-01', dateFin: '2026-01-05', statut: 'Approuvé' },
          { id: 2, type: 'maladie', dateDebut: '2026-02-10', dateFin: '2026-02-12', statut: 'En attente' }
        ]);
      } catch (err) {
        setError('Erreur lors du chargement des congés');
      }
    };
    fetchConges();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Simulation d'envoi (remplacez par api.post('/conges', form))
      console.log('Demande de congé soumise:', form);
      // Ajouter à la liste locale pour simulation
      setConges([...conges, { ...form, id: conges.length + 1, statut: 'En attente' }]);
      alert('Demande de congé soumise avec succès !');
      setForm({ type: 'annuel', dateDebut: '', dateFin: '', raison: '' }); // Réinitialiser le formulaire
    } catch (err) {
      setError('Erreur lors de la soumission');
    }
  };

  return (
    <div className="centered-content">
      <h2>Demander un Congé</h2>
      {error && <p className="error">{error}</p>}
      
      {/* Formulaire de demande */}
      <form onSubmit={handleSubmit}>
        <select 
          value={form.type} 
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          required
        >
          <option value="annuel">Congé Annuel</option>
          <option value="maladie">Congé Maladie</option>
          <option value="maternite">Congé Maternité</option>
        </select>
        <input 
          type="date" 
          placeholder="Date de début" 
          value={form.dateDebut} 
          onChange={(e) => setForm({ ...form, dateDebut: e.target.value })} 
          required 
        />
        <input 
          type="date" 
          placeholder="Date de fin" 
          value={form.dateFin} 
          onChange={(e) => setForm({ ...form, dateFin: e.target.value })} 
          required 
        />
        <textarea 
          placeholder="Raison (optionnel)" 
          value={form.raison} 
          onChange={(e) => setForm({ ...form, raison: e.target.value })}
          rows="4"
        />
        <button type="submit">Soumettre la Demande</button>
      </form>

      {/* Liste des congés */}
      <h3>Mes Congés</h3>
      {conges.length === 0 ? (
        <p>Aucun congé demandé.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Date de Début</th>
              <th>Date de Fin</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {conges.map(conge => (
              <tr key={conge.id}>
                <td>{conge.type}</td>
                <td>{conge.dateDebut}</td>
                <td>{conge.dateFin}</td>
                <td>{conge.statut}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button onClick={() => navigate('/dashboard')}>Retour au Dashboard</button>
    </div>
  );
};

export default DemanderConge;