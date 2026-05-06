import { useNavigate } from 'react-router-dom';

const Statut = () => {
  const navigate = useNavigate();

  return (
    <div className="centered-content">
      <h2>Statut</h2>
      <p>Votre statut : Employé permanent</p>
      <button onClick={() => navigate('/dashboard')}>Retour au Dashboard</button>
    </div>
  );
};

export default Statut;