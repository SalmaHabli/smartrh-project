import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AddInventory = () => {
  const [form, setForm] = useState({
    reference: '',
    serial_number: '',
    type: '',
    assigned_to: '',
    owner: '',
    employee_id: ''
  });
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user || !['Admin', 'RH'].includes(user.role)) {
      setError('Accès refusé : Vous n\'avez pas les permissions pour ajouter du matériel.');
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token manquant. Veuillez vous reconnecter.');
      setLoading(false);
      return;
    }

    const fetchEmployees = async () => {
      try {
        console.log('Fetching employees for inventory...');
        console.log('Token:', token);
        // Changement d'endpoint vers /employees pour charger les vrais employés
        const res = await api.get('/employees');
        console.log('Employees loaded:', res.data);
        if (Array.isArray(res.data)) {
          setEmployees(res.data);
        } else {
          throw new Error('Données des employés non valides (pas un array)');
        }
      } catch (err) {
        console.error('Error loading employees:', err.response?.status, err.response?.data || err.message);
        setError(`Erreur ${err.response?.status || 'inconnue'}: ${err.response?.data?.message || err.message || 'Accès refusé'}`);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, [user]);

  const handleEmployeeChange = (e) => {
    const selectedId = e.target.value;
    const selectedEmployee = employees.find(emp => emp.id === selectedId);
    setForm({
      ...form,
      employee_id: selectedId,
      assigned_to: selectedEmployee ? `${selectedEmployee.first_name} ${selectedEmployee.last_name}` : ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      console.log('Submitting inventory form:', form);
      await api.post('/inventory', form);
      navigate('/inventory');
    } catch (err) {
      console.error('Error adding inventory:', err.response?.data || err);
      setError(err.response?.data?.message || 'Erreur lors de l\'ajout du matériel');
    }
  };

  if (loading) return <div className="centered-content">Chargement des employés...</div>;

  return (
    <div className="centered-content">
      <h2>Ajouter un Matériel</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Référence" 
          value={form.reference} 
          onChange={(e) => setForm({ ...form, reference: e.target.value })} 
          required 
        />
        <input 
          type="text" 
          placeholder="Serial Number" 
          value={form.serial_number} 
          onChange={(e) => setForm({ ...form, serial_number: e.target.value })} 
          required 
        />
        <input 
          type="text" 
          placeholder="Type de Matériel" 
          value={form.type} 
          onChange={(e) => setForm({ ...form, type: e.target.value })} 
          required 
        />
        <input 
          type="text" 
          placeholder="Affecté" 
          value={form.assigned_to} 
          readOnly 
          required 
        />
        <input 
          type="text" 
          placeholder="Propriétaire" 
          value={form.owner} 
          onChange={(e) => setForm({ ...form, owner: e.target.value })} 
          required 
        />
        <select 
          value={form.employee_id} 
          onChange={handleEmployeeChange} 
          required
        >
          <option value="">Sélectionner un employé</option>
          {employees.length > 0 ? (
            employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name}</option>
            ))
          ) : (
            <option disabled>Aucun employé disponible</option>
          )}
        </select>
        <button type="submit" disabled={employees.length === 0 || !!error}>Ajouter</button>
      </form>
      <button onClick={() => navigate('/inventory')}>Retour à l'Inventaire</button>
    </div>
  );
};

export default AddInventory;