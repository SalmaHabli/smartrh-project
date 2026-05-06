import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const navigate = useNavigate();
  const section = searchParams.get('section') || 'personal';
  
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    console.log('Stored user:', storedUser);
    console.log('Token:', token ? 'Present' : 'Missing');
    if (storedUser && token) {
      setUser(storedUser);
      setFormData(storedUser);
      setProfileImage(storedUser.profile_image || '');
    } else {
      console.log('No user or token, redirecting to login');
      navigate('/login');
    }
  }, [navigate]);

  const changeSection = (newSection) => {
    setSearchParams({ section: newSection });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setError('');
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageData = reader.result;
        setProfileImage(imageData);
        setFormData({ ...formData, profile_image: imageData });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    console.log('Starting save process');
    console.log('Form data:', formData);
    
    // Validation basique
    if (!formData.first_name || !formData.last_name) {
      setError('Le prénom et le nom sont requis');
      return;
    }
    
    try {
      console.log('Sending PUT request to /auth/update');
      const res = await api.put('/auth/update', formData);
      console.log('Response received:', res);
      console.log('Response data:', res.data);
      
      if (res.data.user) {
        setUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setIsEditing(false);
        alert('Profil mis à jour avec succès !');
        window.location.reload(); // Rechargement pour mettre à jour Layout.js
      } else {
        setError('Réponse invalide du serveur');
      }
    } catch (err) {
      console.error('Error during save:', err);
      console.error('Error response:', err.response);
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour du profil');
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="centered-content">
      <h2>Mon Profil</h2>
      {error && <p className="error">{error}</p>}
      
      {/* Section image de profil */}
      <div className="profile-image-section">
        <h3>Image de Profil</h3>
        {profileImage && <img src={profileImage} alt="Profil" style={{ width: '100px', height: '100px', borderRadius: '50%', border: '2px solid #007bff' }} />}
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>
      
      <div className="profile-actions">
        {!isEditing ? (
          <button onClick={handleEditToggle}>Modifier le Profil</button>
        ) : (
          <>
            <button onClick={handleSave}>Sauvegarder</button>
            <button onClick={handleEditToggle}>Annuler</button>
          </>
        )}
      </div>
      
      <div className="profile-tabs">
        <button 
          className={section === 'personal' ? 'active' : ''} 
          onClick={() => changeSection('personal')}
        >
          Info Personnelle
        </button>
        <button 
          className={section === 'professional' ? 'active' : ''} 
          onClick={() => changeSection('professional')}
        >
          Info Professionnelle
        </button>
        <button 
          className={section === 'additional' ? 'active' : ''} 
          onClick={() => changeSection('additional')}
        >
          Info Complémentaire
        </button>
      </div>

      {section === 'personal' && (
        <div className="profile-section">
          <h3>Informations Personnelles</h3>
          {isEditing ? (
            <>
              <input 
                type="text" 
                name="first_name" 
                value={formData.first_name || ''} 
                onChange={handleInputChange} 
                placeholder="Prénom" 
                required
              />
              <input 
                type="text" 
                name="last_name" 
                value={formData.last_name || ''} 
                onChange={handleInputChange} 
                placeholder="Nom" 
                required
              />
              <input 
                type="email" 
                name="email" 
                value={formData.email || ''} 
                onChange={handleInputChange} 
                placeholder="Email" 
                required
              />
            </>
          ) : (
            <>
              <p>Prénom : {user.first_name}</p>
              <p>Nom : {user.last_name}</p>
              <p>Email : {user.email}</p>
            </>
          )}
        </div>
      )}

      {section === 'professional' && (
        <div className="profile-section">
          <h3>Informations Professionnelles</h3>
          {isEditing ? (
            <>
              <input 
                type="text" 
                name="position" 
                value={formData.position || ''} 
                onChange={handleInputChange} 
                placeholder="Poste" 
              />
              <input 
                type="text" 
                name="department" 
                value={formData.department || ''} 
                onChange={handleInputChange} 
                placeholder="Département" 
              />
              <input 
                type="number" 
                name="salary" 
                value={formData.salary || ''} 
                onChange={handleInputChange} 
                placeholder="Salaire" 
              />
              <input 
                type="date" 
                name="hire_date" 
                value={formData.hire_date || ''} 
                onChange={handleInputChange} 
              />
            </>
          ) : (
            <>
              <p>Poste : {user.position || 'Non spécifié'}</p>
              <p>Département : {user.department || 'Non spécifié'}</p>
              <p>Salaire : {user.salary || 'Non spécifié'}</p>
              <p>Date d'embauche : {user.hire_date || 'Non spécifié'}</p>
            </>
          )}
        </div>
      )}

      {section === 'additional' && (
        <div className="profile-section">
          <h3>Informations Complémentaires</h3>
          {isEditing ? (
            <>
              <input 
                type="tel" 
                name="phone" 
                value={formData.phone || ''} 
                onChange={handleInputChange} 
                placeholder="Téléphone" 
              />
              <input 
                type="text" 
                name="address" 
                value={formData.address || ''} 
                onChange={handleInputChange} 
                placeholder="Adresse" 
              />
              <textarea 
                name="notes" 
                value={formData.notes || ''} 
                onChange={handleInputChange} 
                placeholder="Notes" 
                rows="4"
              />
            </>
          ) : (
            <>
              <p>Téléphone : {user.phone || 'Non spécifié'}</p>
              <p>Adresse : {user.address || 'Non spécifié'}</p>
              <p>Notes : {user.notes || 'Aucune note'}</p>
            </>
          )}
        </div>
      )}

      <button onClick={() => navigate('/dashboard')}>Retour au Dashboard</button>
    </div>
  );
};

export default Profile;