import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const EditInventory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    reference: '', serial_number: '', type: '', assigned_to: '', owner: '', employee_id: ''
  });
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    api.get(`/inventory/${id}`).then(res => setForm(res.data));
    api.get('/inventory/employees/list').then(res => setEmployees(res.data));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.put(`/inventory/${id}`, form);
    navigate('/inventory');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={form.reference} onChange={e => setForm({...form, reference: e.target.value})} />
      <input value={form.serial_number} onChange={e => setForm({...form, serial_number: e.target.value})} />
      <input value={form.type} onChange={e => setForm({...form, type: e.target.value})} />
      <input value={form.assigned_to} onChange={e => setForm({...form, assigned_to: e.target.value})} />
      <input value={form.owner} onChange={e => setForm({...form, owner: e.target.value})} />
      <select value={form.employee_id} onChange={e => setForm({...form, employee_id: e.target.value})}>
        <option value="">Sélectionner</option>
        {employees.map(emp => (
          <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name}</option>
        ))}
      </select>
      <button type="submit">Sauvegarder</button>
    </form>
  );
};

export default EditInventory;