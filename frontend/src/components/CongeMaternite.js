import { useNavigate } from 'react-router-dom';

const CongeMaternite = () => {
  const navigate = useNavigate();

  return (
    <div className="centered-content">
      <h2>Congé Maternité</h2>
      <p>Informations sur vos congés maternité.</p>
      <p>Durée maximale : 16 semaines</p>
      <p>Éligibilité : Selon la loi</p>
      <button onClick={() => navigate('/dashboard')}>Retour au Dashboard</button>
    </div>
  );
};

export default CongeMaternite;