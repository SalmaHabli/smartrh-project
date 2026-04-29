import { useNavigate } from 'react-router-dom';

const Poste = () => {
  const navigate = useNavigate();

  return (
    <div className="centered-content">
      <h2>Poste</h2>
      <p>Votre poste actuel : Développeur</p>
      <button onClick={() => navigate('/dashboard')}>Retour au Dashboard</button>
    </div>
  );
};

export default Poste;