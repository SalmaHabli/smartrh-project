import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const InventoryList = () => {
  const [inventory, setInventory] = useState([]);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  const fetchInventory = async () => {
    try {
      const res = await api.get('/inventory');
      console.log('Inventory Data:', res.data); // Log temporaire pour vérifier les données jointes
      setInventory(res.data);
    } catch (err) {
      setError('Erreur lors du chargement de l\'inventaire');
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
    fetchInventory();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce matériel ?')) {
      try {
        await api.delete(`/inventory/${id}`);
        setInventory(inventory.filter(item => item.id !== id));
      } catch (err) {
        setError('Erreur lors de la suppression du matériel');
      }
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      await api.put(`/inventory/${id}`, updatedData);
      alert('Matériel mis à jour');
      fetchInventory(); // Recharger la liste après mise à jour
    } catch (err) {
      setError('Erreur lors de la mise à jour du matériel');
    }
  };

  const isAdminOrRH = user && (user.role === 'Admin' || user.role === 'RH');

  return (
    <div className="centered-content">
      <h2>Inventaire des Matériels</h2>
      {error && <p className="error">{error}</p>}
      {isAdminOrRH && <Link to="/add-inventory">Ajouter un Matériel</Link>}
      <table>
        <thead>
          <tr>
            <th>Référence</th>
            <th>Serial Number</th>
            <th>Type de Matériel</th>
            <th>Affecté</th>
            <th>Propriétaire</th>
            <th>Employé Assigné</th>
            {isAdminOrRH && <th>Actions</th>}
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
              <td>{item.first_name && item.last_name ? `${item.first_name} ${item.last_name}` : ''}</td>
              {isAdminOrRH && (
                <td>
                  <Link to={`/edit-inventory/${item.id}`}>Modifier</Link>
                  <button onClick={() => handleDelete(item.id)}>Supprimer</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryList;