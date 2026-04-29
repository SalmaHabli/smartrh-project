import { useNavigate } from 'react-router-dom';

const Fonctionnement = () => {
  const navigate = useNavigate();

  return (
    <div className="centered-content">
      <h2>Fonctionnement</h2>
      <h3>CIN</h3>
      <p>Numéro CIN : BJ474704</p>
      <h3>Banque</h3>
      <p>Informations bancaires : Compte XXXX</p>
      <h3>Cadre</h3>
      <p>Cadre : Oui</p>
      <h3>Déclaration CNSS</h3>
      <p>Numéro CNSS : 98765432</p>
      <h3>Mutuelle</h3>
      <p>Mutuelle : Active</p>
      <h3>Diplôme</h3>
      <p>Diplôme : Bac+5</p>
      <button onClick={() => navigate('/dashboard')}>Retour au Dashboard</button>
    </div>
  );
};

export default Fonctionnement;