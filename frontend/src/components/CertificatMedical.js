import { useNavigate } from 'react-router-dom';

const CertificatMedical = () => {
  const navigate = useNavigate();

  const handleDownload = () => {
    alert('Téléchargement du Certificat Médical simulé. En production, cela téléchargerait un fichier PDF.');
  };

  return (
    <div className="centered-content">
      <h2>Certificat Médical</h2>
      <p>Consultez et téléchargez votre certificat médical.</p>
      <button onClick={handleDownload}>Télécharger Certificat Médical</button>
      <button onClick={() => navigate('/dashboard')}>Retour au Dashboard</button>
    </div>
  );
};

export default CertificatMedical;