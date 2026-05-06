import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);

    const fetchEmployees = async () => {
      try {
        const res = await api.get('/employees');
        setEmployees(res.data);
        setFilteredEmployees(res.data);
      } catch (err) {
        setError('Erreur lors du chargement des employés');
      }
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    const filtered = employees.filter(emp =>
      emp.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp.responsable && emp.responsable.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredEmployees(filtered);
  }, [searchTerm, employees]);

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) {
      try {
        await api.delete(`/employees/${id}`);
        setEmployees(employees.filter(emp => emp.id !== id));
      } catch (err) {
        setError('Erreur lors de la suppression de l\'employé');
      }
    }
  };

  const isAdminOrRH = user && (user.role === 'Admin' || user.role === 'RH');

  return (
    <div className="centered-content">
      <h2>Liste des Employés</h2>
      {error && <p className="error">{error}</p>}
      {isAdminOrRH && <Link to="/add-employee">Ajouter un Nouvel Employé</Link>}
      
      {/* Barre de recherche */}
      <input
        type="text"
        placeholder="Rechercher par nom, email, poste, département ou responsable..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '4px' }}
      />
      
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Poste</th>
            <th>Département</th>
            <th>Responsable</th>
            {isAdminOrRH && <th>Matricule</th>}
            {isAdminOrRH && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map(emp => (
            <tr key={emp.id}>
              <td>{emp.first_name} {emp.last_name}</td>
              <td>{emp.email}</td>
              <td>{emp.position}</td>
              <td>{emp.department}</td>
              <td>{emp.responsable || 'Non spécifié'}</td>
              {isAdminOrRH && <td>{emp.matricule || 'Non spécifié'}</td>}
              {isAdminOrRH && (
                <td>
                  <Link to={`/edit-employee/${emp.id}`}>Modifier</Link>
                  <button onClick={() => handleDelete(emp.id)}>Supprimer</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;