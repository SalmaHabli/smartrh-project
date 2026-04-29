import { useNavigate } from 'react-router-dom';

const ContratTravail = () => {
  const navigate = useNavigate();

  const handleDownload = () => {
    alert('Téléchargement du Contrat de Travail simulé. En production, cela téléchargerait un fichier PDF.');
  };

  return (
    <div className="centered-content">
      <h2>Contrat de Travail</h2>
      <p>Consultez et téléchargez votre contrat de travail.</p>
      <button onClick={handleDownload}>Télécharger Contrat de Travail</button>
      <button onClick={() => navigate('/dashboard')}>Retour au Dashboard</button>
    </div>
  );
};

export default ContratTravail;