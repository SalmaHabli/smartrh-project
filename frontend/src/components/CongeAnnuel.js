import { useNavigate } from 'react-router-dom';

const CongeAnnuel = () => {
  const navigate = useNavigate();

  return (
    <div className="centered-content">
      <h2>Congé Annuel</h2>
      <p>Informations sur vos congés annuels.</p>
      <p>Nombre de jours restants : 15</p>
      <p>Dernière mise à jour : 01/01/2026</p>
      <button onClick={() => navigate('/dashboard')}>Retour au Dashboard</button>
    </div>
  );
};

export default CongeAnnuel;