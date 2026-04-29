import { useNavigate } from 'react-router-dom';

const DateEntree = () => {
  const navigate = useNavigate();

  return (
    <div className="centered-content">
      <h2>Date d'Entrée</h2>
      <p>Votre date d'entrée dans l'entreprise : 01/01/2020</p>
      <button onClick={() => navigate('/dashboard')}>Retour au Dashboard</button>
    </div>
  );
};

export default DateEntree;