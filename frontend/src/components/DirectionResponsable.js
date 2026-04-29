import { useNavigate } from 'react-router-dom';

const DirectionResponsable = () => {
  const navigate = useNavigate();

  return (
    <div className="centered-content">
      <h2>Direction Responsable</h2>
      <p>Votre direction responsable : IT</p>
      <button onClick={() => navigate('/dashboard')}>Retour au Dashboard</button>
    </div>
  );
};

export default DirectionResponsable;