import { useNavigate } from 'react-router-dom';

const AttestationTravail = () => {
  const navigate = useNavigate();

  const handleDownload = () => {
    alert('Téléchargement de l\'Attestation de Travail simulé. En production, cela téléchargerait un fichier PDF.');
  };

  return (
    <div className="centered-content">
      <h2>Attestation de Travail</h2>
      <p>Consultez et téléchargez votre attestation de travail.</p>
      <button onClick={handleDownload}>Télécharger Attestation de Travail</button>
      <button onClick={() => navigate('/dashboard')}>Retour au Dashboard</button>
    </div>
  );
};

export default AttestationTravail;