import { useEffect, useState } from 'react';
import api from '../services/api';

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [newNotif, setNewNotif] = useState({ title: '', message: '' });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/notifications', newNotif);
      setNewNotif({ title: '', message: '' });
      fetchNotifications();
    } catch (err) {
      alert('Erreur lors de la création');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Voulez-vous supprimer cette notification ?')) {
      try {
        await api.delete(`/notifications/${id}`);
        fetchNotifications();
      } catch (err) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  const isAdmin = user?.role === 'Admin';

  return (
    <div>
      <h2>Notifications</h2>
      
      {/* Formulaire pour Admin */}
      {isAdmin && (
        <div style={{ marginBottom: '30px', padding: '20px', background: '#f8f9fa', borderRadius: '10px' }}>
          <h3>Créer une notification</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Titre"
              value={newNotif.title}
              onChange={(e) => setNewNotif({ ...newNotif, title: e.target.value })}
              required
              style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
            />
            <textarea
              placeholder="Message"
              value={newNotif.message}
              onChange={(e) => setNewNotif({ ...newNotif, message: e.target.value })}
              required
              style={{ width: '100%', padding: '10px', marginBottom: '10px', minHeight: '80px' }}
            />
            <button type="submit">Publier</button>
          </form>
        </div>
      )}

      {/* Liste des notifications */}
      <div>
        {notifications.length === 0 ? (
          <p>Aucune notification</p>
        ) : (
          notifications.map((notif) => (
            <div key={notif.id} style={{ 
              padding: '15px', 
              marginBottom: '15px', 
              background: 'white', 
              borderRadius: '10px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              borderLeft: '4px solid #667eea'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h4 style={{ margin: '0 0 5px 0', color: '#1e3c72' }}>{notif.title}</h4>
                  <p style={{ margin: 0, color: '#666' }}>{notif.message}</p>
                  <small style={{ color: '#999' }}>{new Date(notif.created_at).toLocaleString()}</small>
                </div>
                {isAdmin && (
                  <button 
                    onClick={() => handleDelete(notif.id)}
                    style={{ background: '#ff6b6b', padding: '5px 10px', fontSize: '12px' }}
                  >
                    Supprimer
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationList;