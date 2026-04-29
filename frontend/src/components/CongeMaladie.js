import { useNavigate } from 'react-router-dom';

const CongeMaladie = () => {
  const navigate = useNavigate();

  return (
    <div className="centered-content">
      <h2>Congé Maladie</h2>
      <p>Informations sur vos congés maladie.</p>
      <p>Nombre de jours utilisés cette année : 5</p>
      <p>Justificatif requis : Oui</p>
      <button onClick={() => navigate('/dashboard')}>Retour au Dashboard</button>
    </div>
  );
};

export default CongeMaladie;