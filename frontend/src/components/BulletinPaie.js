import { useNavigate } from 'react-router-dom';

const BulletinPaie = () => {
  const navigate = useNavigate();

  const handleDownload = () => {
    alert('Téléchargement du Bulletin de Paie simulé. En production, cela téléchargerait un fichier PDF.');
    // Simulation : window.open('/path/to/bulletin.pdf');
  };

  return (
    <div className="centered-content">
      <h2>Bulletin de Paie</h2>
      <p>Consultez et téléchargez votre bulletin de paie.</p>
      <button onClick={handleDownload}>Télécharger Bulletin de Paie</button>
      <button onClick={() => navigate('/dashboard')}>Retour au Dashboard</button>
    </div>
  );
};

export default BulletinPaie;