import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileSubmenuOpen, setProfileSubmenuOpen] = useState(false);
  const [congesSubmenuOpen, setCongesSubmenuOpen] = useState(false);
  const [mesCongesSubmenuOpen, setMesCongesSubmenuOpen] = useState(false); // NOUVEAU
  const [reclamationsSubmenuOpen, setReclamationsSubmenuOpen] = useState(false);
  const [fichesSubmenuOpen, setFichesSubmenuOpen] = useState(false);
  const [documentsSubmenuOpen, setDocumentsSubmenuOpen] = useState(false);
  const [inventaireSubmenuOpen, setInventaireSubmenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const centeredContentRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('dashboard-page');
    return () => {
      document.body.classList.remove('dashboard-page');
    };
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/notifications', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.error('Erreur notifications:', err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleProfileSubmenu = () => {
    setProfileSubmenuOpen(!profileSubmenuOpen);
  };

  const toggleCongesSubmenu = () => {
    setCongesSubmenuOpen(!congesSubmenuOpen);
  };

  // NOUVEAU : Toggle pour le sous-menu Mes Congés
  const toggleMesCongesSubmenu = () => {
    setMesCongesSubmenuOpen(!mesCongesSubmenuOpen);
  };

  const toggleReclamationsSubmenu = () => {
    setReclamationsSubmenuOpen(!reclamationsSubmenuOpen);
  };

  const toggleFichesSubmenu = () => {
    setFichesSubmenuOpen(!fichesSubmenuOpen);
  };

  const toggleDocumentsSubmenu = () => {
    setDocumentsSubmenuOpen(!documentsSubmenuOpen);
  };

  const toggleInventaireSubmenu = () => {
    setInventaireSubmenuOpen(!inventaireSubmenuOpen);
  };

  const handleGlobalSearch = (e) => {
    e.preventDefault();
    if (globalSearch.trim()) {
      const term = globalSearch.toLowerCase();
      if (term.includes('profil') || term.includes('profile')) {
        navigate('/profile');
      } else if (term.includes('fiches') || term.includes('significatifs') || term.includes('files')) {
        navigate('/fiches/fonctionnement');
      } else if (term.includes('conge') || term.includes('congé') || term.includes('vacation')) {
        navigate('/conges/demander');
      } else if (term.includes('mes conges') || term.includes('mes congés') || term.includes('mes demandes')) {
        navigate('/conges/mes-conges');
      } else if (term.includes('solde')) {
        navigate('/conges/solde');
      } else if (term.includes('reclamation') || term.includes('complaint') || term.includes('plainte')) {
        navigate('/reclamations/soumettre');
      } else if (term.includes('documents') || term.includes('administratifs') || term.includes('bulletin') || term.includes('paie') || term.includes('attestation') || term.includes('travail') || term.includes('contrat') || term.includes('certificat') || term.includes('medical')) {
        navigate('/documents/bulletin-paie');
      } else if (term.includes('inventaire') || term.includes('inventory') || term.includes('materiel') || term.includes('matériel')) {
        navigate('/inventory');
      } else if (term.includes('notification')) {
        navigate('/notifications');
      } else {
        navigate('/dashboard');
      }
      setGlobalSearch('');
    }
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
  };

  const profileImage = user?.profile_image || 'https://via.placeholder.com/40';

  useEffect(() => {
    if (centeredContentRef.current) {
      if (sidebarOpen) {
        centeredContentRef.current.style.maxWidth = '600px';
        centeredContentRef.current.style.margin = '0 auto';
      } else {
        centeredContentRef.current.style.maxWidth = 'none';
        centeredContentRef.current.style.margin = '0';
        centeredContentRef.current.style.width = '100%';
      }
    }
  }, [sidebarOpen]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="dashboard-container">
      <button className={`hamburger ${sidebarOpen ? 'open' : ''}`} onClick={toggleSidebar} title="Menu">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <form onSubmit={handleGlobalSearch} style={{ position: 'fixed', top: '15px', left: '50%', transform: 'translateX(-50%)', zIndex: 1001 }}>
        <input
          type="text"
          placeholder="Rechercher globalement..."
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
          style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', width: '200px' }}
        />
        <button type="submit" style={{ padding: '8px 12px', background: '#667eea', color: 'white', border: 'none', borderRadius: '4px', marginLeft: '5px' }}>
          Rechercher
        </button>
      </form>

      <div style={{ position: 'fixed', top: '15px', right: '15px', zIndex: 1001, display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'relative', marginRight: '10px' }}>
          <button onClick={toggleNotifications} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>
            
            {notifications.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                background: 'red',
                color: 'white',
                borderRadius: '50%',
                padding: '2px 6px',
                fontSize: '12px'
              }}>
                {notifications.length}
              </span>
            )}
          </button>
          {notificationsOpen && (
            <div style={{
              position: 'absolute',
              top: '35px',
              right: '0',
              background: 'white',
              border: '1px solid #ddd',
              borderRadius: '10px',
              width: '320px',
              maxHeight: '400px',
              overflowY: 'auto',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              zIndex: 1002
            }}>
              <div style={{ padding: '15px', fontWeight: 'bold', borderBottom: '2px solid #667eea', color: '#1e3c72' }}>
                🔔 Notifications ({notifications.length})
              </div>
              {notifications.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                  Aucune notification
                </div>
              ) : (
                notifications.map((notif) => (
                  <div key={notif.id} style={{ 
                    padding: '15px', 
                    borderBottom: '1px solid #eee',
                    background: 'linear-gradient(90deg, #f8f9fa, white)',
                    transition: 'background 0.3s'
                  }}>
                    <strong style={{ color: '#1e3c72', fontSize: '14px' }}>{notif.title}</strong>
                    <p style={{ margin: '5px 0', fontSize: '13px', color: '#555' }}>{notif.message}</p>
                    <small style={{ color: '#999', fontSize: '11px' }}>
                      {new Date(notif.created_at).toLocaleString()}
                    </small>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        <img
          src={profileImage}
          alt="Profil"
          style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #667eea' }}
        />
      </div>

      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <h2>SmartHR Menu</h2>
        <ul>
          <li><Link to="/dashboard" onClick={toggleSidebar}>Dashboard</Link></li>
          
          <li className="submenu-container">
            <button onClick={toggleProfileSubmenu} className="submenu-toggle">Mon Profil</button>
            {profileSubmenuOpen && (
              <ul className="submenu horizontal">
                <li><Link to="/profile?section=personal" onClick={toggleSidebar}>Informations Personnelles</Link></li>
                <li><Link to="/profile?section=professional" onClick={toggleSidebar}>Informations Professionnelles</Link></li>
                <li><Link to="/profile?section=additional" onClick={toggleSidebar}>Informations Complémentaires</Link></li>
              </ul>
            )}
          </li>

        

          {/* NOUVEAU : Menu Mes Congés */}
          <li className="submenu-container">
            <button onClick={toggleMesCongesSubmenu} className="submenu-toggle"> Mes Congés</button>
            {mesCongesSubmenuOpen && (
              <ul className="submenu horizontal">
                <li><Link to="/conges/mes-conges" onClick={toggleSidebar}> Mes demandes</Link></li>
                <li><Link to="/conges/solde" onClick={toggleSidebar}> Mon solde</Link></li>
                {(user.role === 'Admin' || user.role === 'RH') && (
                  <li><Link to="/conges/admin" onClick={toggleSidebar}> Gérer les demandes</Link></li>
                )}
              </ul>
            )}
          </li>

          <li className="submenu-container">
            <button onClick={toggleReclamationsSubmenu} className="submenu-toggle">Réclamations</button>
            {reclamationsSubmenuOpen && (
              <ul className="submenu horizontal">
                <li><Link to="/reclamations/soumettre" onClick={toggleSidebar}>Soumettre une Réclamation</Link></li>
                <li><Link to="/reclamations/mes-reclamations" onClick={toggleSidebar}>Voir mes Réclamations</Link></li>
                <li><Link to="/reclamations/statut" onClick={toggleSidebar}>Statut des Réclamations</Link></li>
              </ul>
            )}
          </li>

          <li className="submenu-container">
            <button onClick={toggleFichesSubmenu} className="submenu-toggle">Fiches Significatives</button>
            {fichesSubmenuOpen && (
              <ul className="submenu horizontal">
                <li><Link to="/fiches/date-entree" onClick={toggleSidebar}>Date d'Entrée</Link></li>
                <li><Link to="/fiches/poste" onClick={toggleSidebar}>Poste</Link></li>
                <li><Link to="/fiches/statut" onClick={toggleSidebar}>Statut</Link></li>
                <li><Link to="/fiches/direction-responsable" onClick={toggleSidebar}>Direction Responsable</Link></li>
                <li><Link to="/fiches/fonctionnement" onClick={toggleSidebar}>Fonctionnement</Link></li>
              </ul>
            )}
          </li>

          <li className="submenu-container">
            <button onClick={toggleDocumentsSubmenu} className="submenu-toggle">Documents Administratifs</button>
            {documentsSubmenuOpen && (
              <ul className="submenu horizontal">
                <li><Link to="/documents/bulletin-paie" onClick={toggleSidebar}>Bulletin de Paie</Link></li>
                <li><Link to="/documents/attestation-travail" onClick={toggleSidebar}>Attestation de Travail</Link></li>
                <li><Link to="/documents/contrat-travail" onClick={toggleSidebar}>Contrat de Travail</Link></li>
                <li><Link to="/documents/certificat-medical" onClick={toggleSidebar}>Certificat Médical</Link></li>
              </ul>
            )}
          </li>

          <li className="submenu-container">
            <button onClick={toggleInventaireSubmenu} className="submenu-toggle">Inventaire</button>
            {inventaireSubmenuOpen && (
              <ul className="submenu horizontal">
                <li><Link to="/inventory" onClick={toggleSidebar}>Voir Inventaire</Link></li>
                <li><Link to="/my-inventory" onClick={toggleSidebar}>Mes Matériels</Link></li>
                {(user.role === 'Admin' || user.role === 'RH') && (
                  <li><Link to="/add-inventory" onClick={toggleSidebar}>Ajouter Matériel</Link></li>
                )}
              </ul>
            )}
          </li>

          <li><Link to="/employees" onClick={toggleSidebar}>Liste des Employés</Link></li>
          
          {(user.role === 'Admin' || user.role === 'RH') && (
            <>
              <li><Link to="/add-employee" onClick={toggleSidebar}>Ajouter Employé</Link></li>
            </>
          )}
          
          {user.role === 'Admin' && (
            <li><Link to="/notifications" onClick={toggleSidebar}>🔔 Notifications</Link></li>
          )}
          
          <li><button onClick={() => { handleLogout(); toggleSidebar(); }} className="logout-btn">Déconnexion</button></li>
        </ul>
      </div>

      {sidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}

      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div ref={centeredContentRef} className="centered-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;