import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

const EditEmployee = () => {
  const { id } = useParams();
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    salary: '',
    hire_date: '',
    responsable: '',
    matricule: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await api.get(`/employees/${id}`);
        setForm(res.data);
      } catch (err) {
        setError('Erreur lors du chargement de l\'employé');
      }
    };
    fetchEmployee();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.put(`/employees/${id}`, form);
      navigate('/employees');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour de l\'employé');
    }
  };

  return (
    <div className="centered-content">
      <h2>Modifier l'Employé</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Prénom" 
          value={form.first_name} 
          onChange={(e) => setForm({ ...form, first_name: e.target.value })} 
          required 
        />
        <input 
          type="text" 
          placeholder="Nom" 
          value={form.last_name} 
          onChange={(e) => setForm({ ...form, last_name: e.target.value })} 
          required 
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={form.email} 
          onChange={(e) => setForm({ ...form, email: e.target.value })} 
          required 
        />
        <input 
          type="tel" 
          placeholder="Téléphone" 
          value={form.phone} 
          onChange={(e) => setForm({ ...form, phone: e.target.value })} 
          required 
        />
        <input 
          type="text" 
          placeholder="Poste" 
          value={form.position} 
          onChange={(e) => setForm({ ...form, position: e.target.value })} 
          required 
        />
        <input 
          type="text" 
          placeholder="Département" 
          value={form.department} 
          onChange={(e) => setForm({ ...form, department: e.target.value })} 
          required 
        />
        <input 
          type="number" 
          placeholder="Salaire" 
          value={form.salary} 
          onChange={(e) => setForm({ ...form, salary: e.target.value })} 
          required 
        />
        <input 
          type="date" 
          value={form.hire_date} 
          onChange={(e) => setForm({ ...form, hire_date: e.target.value })} 
          required 
        />
        <input 
          type="text" 
          placeholder="Responsable" 
          value={form.responsable} 
          onChange={(e) => setForm({ ...form, responsable: e.target.value })} 
        />
        <input 
          type="text" 
          placeholder="Matricule" 
          value={form.matricule} 
          onChange={(e) => setForm({ ...form, matricule: e.target.value })} 
        />
        <button type="submit">Mettre à Jour</button>
      </form>
      <Link to="/employees">Retour à la Liste des Employés</Link>
    </div>
  );
};

export default EditEmployee;