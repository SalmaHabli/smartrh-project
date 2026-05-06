import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', password: '', role: 'Employé' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Ajouter la classe login-page au body pour le background
  useEffect(() => {
    document.body.classList.add('login-page');
    return () => {
      document.body.classList.remove('login-page');
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
    }
  };

  return (
    <div className="form-container">
      <h2>Inscription</h2>
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
          type="password" 
          placeholder="Mot de passe" 
          value={form.password} 
          onChange={(e) => setForm({ ...form, password: e.target.value })} 
          required 
        />
        <select 
          value={form.role} 
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="Employé">Employé</option>
          <option value="RH">RH</option>
          <option value="Admin">Admin</option>
        </select>
        <button type="submit">S'inscrire</button>
      </form>
      <p>Déjà un compte ? <a href="/login">Se Connecter</a></p>
    </div>
  );
};

export default Register;