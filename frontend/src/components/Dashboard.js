import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="centered-content">
      <header>
        <h1>Bienvenue sur SmartHR, {user.first_name}!</h1>
        <p>Rôle : {user.role}</p>
      </header>
      <div>
        <h2>Aperçu du Dashboard</h2>
        <p>Ceci est votre dashboard principal. Utilisez la barre latérale pour naviguer.</p>
        {user.role === 'Employé' && (
          <div className="employee-section">
            <h3>Votre Profil</h3>
            <p>Nom : {user.first_name} {user.last_name}</p>
            <p>Email : {user.email}</p>
            <p>Rôle : {user.role}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;