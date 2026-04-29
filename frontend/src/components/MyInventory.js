import { useEffect, useState } from 'react';
import api from '../services/api';

const MyInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log('User ID:', user.id); // Log l'ID utilisateur pour vérifier
    const fetchMyInventory = async () => {
      try {
        const res = await api.get('/inventory/my-items');
        console.log('API Response:', res.data); // Log la réponse pour voir les données
        setInventory(res.data);
      } catch (err) {
        console.error('Erreur API détaillée:', err.response?.status, err.response?.data, err.message); // Log le statut et message d'erreur
        setError('Erreur lors du chargement de vos matériels');
      } finally {
        setLoading(false);
      }
    };
    fetchMyInventory();
  }, []);

  if (loading) return <div className="centered-content">Chargement de vos matériels...</div>;

  return (
    <div className="centered-content">
      <h2>Mes Matériels</h2>
      {error && <p className="error">{error}</p>}
      {inventory.length === 0 ? (
        <p>Aucun matériel vous est affecté.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Référence</th>
              <th>Numéro de Série</th>
              <th>Type</th>
              <th>Affecté</th>
              <th>Propriétaire</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => (
              <tr key={item.id}>
                <td>{item.reference}</td>
                <td>{item.serial_number}</td>
                <td>{item.type}</td>
                <td>{item.assigned_to}</td>
                <td>{item.owner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyInventory;