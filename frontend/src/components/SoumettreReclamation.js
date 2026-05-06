import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SoumettreReclamation = () => {
  const [form, setForm] = useState({
    sujet: '',
    description: '',
    categorie: 'salaire'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      console.log('Réclamation soumise:', form);
      alert('Réclamation soumise avec succès !');
      navigate('/dashboard');
    } catch (err) {
      setError('Erreur lors de la soumission');
    }
  };

  return (
    <div className="centered-content">
      <h2>Soumettre une Réclamation</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Sujet" 
          value={form.sujet} 
          onChange={(e) => setForm({ ...form, sujet: e.target.value })} 
          required 
        />
        <select 
          value={form.categorie} 
          onChange={(e) => setForm({ ...form, categorie: e.target.value })}
        >
          <option value="salaire">Salaire</option>
          <option value="conditions">Conditions de travail</option>
          <option value="autre">Autre</option>
        </select>
        <textarea 
          placeholder="Description" 
          value={form.description} 
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows="4"
          required
        />
        <button type="submit">Soumettre</button>
      </form>
      <button onClick={() => navigate('/dashboard')}>Retour au Dashboard</button>
    </div>
  );
};

export default SoumettreReclamation;