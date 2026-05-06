import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import EmployeeList from './components/EmployeeList';
import AddEmployee from './components/AddEmployee';
import Profile from './components/Profile';
import CongeAnnuel from './components/CongeAnnuel';
import CongeMaladie from './components/CongeMaladie';
import CongeMaternite from './components/CongeMaternite';
import DemanderConge from './components/DemanderConge';
import SoumettreReclamation from './components/SoumettreReclamation';
import MesReclamations from './components/MesReclamations';
import StatutReclamations from './components/StatutReclamations';
import DateEntree from './components/DateEntree';
import Poste from './components/Poste';
import Statut from './components/Statut';
import DirectionResponsable from './components/DirectionResponsable';
import Fonctionnement from './components/Fonctionnement';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import EditEmployee from './components/EditEmployee';
import BulletinPaie from './components/BulletinPaie';
import AttestationTravail from './components/AttestationTravail';
import ContratTravail from './components/ContratTravail';
import CertificatMedical from './components/CertificatMedical';
import InventoryList from './components/InventoryList';
import AddInventory from './components/AddInventory';
import MyInventory from './components/MyInventory';
import EditInventory from './components/EditInventory';
import Chatbot from './components/Chatbot';
import NotificationList from './components/NotificationList';
import MesConges from './components/MesConges';
import SoldeConges from './components/SoldeConges';
import AdminConges from './components/AdminConges';
import './styles.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Routes publiques */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Login />} />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Profil */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Module Congés */}
          <Route
            path="/conges/annuel"
            element={
              <ProtectedRoute>
                <Layout>
                  <CongeAnnuel />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/conges/maladie"
            element={
              <ProtectedRoute>
                <Layout>
                  <CongeMaladie />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/conges/maternite"
            element={
              <ProtectedRoute>
                <Layout>
                  <CongeMaternite />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/conges/demander"
            element={
              <ProtectedRoute>
                <Layout>
                  <DemanderConge />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/conges/mes-conges"
            element={
              <ProtectedRoute>
                <Layout>
                  <MesConges />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/conges/solde"
            element={
              <ProtectedRoute>
                <Layout>
                  <SoldeConges />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/conges/admin"
            element={
              <ProtectedRoute roles={['Admin', 'RH']}>
                <Layout>
                  <AdminConges />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Module Réclamations */}
          <Route
            path="/reclamations/soumettre"
            element={
              <ProtectedRoute>
                <Layout>
                  <SoumettreReclamation />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reclamations/mes-reclamations"
            element={
              <ProtectedRoute>
                <Layout>
                  <MesReclamations />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reclamations/statut"
            element={
              <ProtectedRoute>
                <Layout>
                  <StatutReclamations />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Module Fiches Significatives */}
          <Route
            path="/fiches/date-entree"
            element={
              <ProtectedRoute>
                <Layout>
                  <DateEntree />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/fiches/poste"
            element={
              <ProtectedRoute>
                <Layout>
                  <Poste />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/fiches/statut"
            element={
              <ProtectedRoute>
                <Layout>
                  <Statut />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/fiches/direction-responsable"
            element={
              <ProtectedRoute>
                <Layout>
                  <DirectionResponsable />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/fiches/fonctionnement"
            element={
              <ProtectedRoute>
                <Layout>
                  <Fonctionnement />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Module Employés */}
          <Route
            path="/employees"
            element={
              <ProtectedRoute roles={['Admin', 'RH', 'Employé']}>
                <Layout>
                  <EmployeeList />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-employee"
            element={
              <ProtectedRoute roles={['Admin', 'RH']}>
                <Layout>
                  <AddEmployee />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-employee/:id"
            element={
              <ProtectedRoute roles={['Admin', 'RH']}>
                <Layout>
                  <EditEmployee />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Module Documents Administratifs */}
          <Route
            path="/documents/bulletin-paie"
            element={
              <ProtectedRoute>
                <Layout>
                  <BulletinPaie />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/documents/attestation-travail"
            element={
              <ProtectedRoute>
                <Layout>
                  <AttestationTravail />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/documents/contrat-travail"
            element={
              <ProtectedRoute>
                <Layout>
                  <ContratTravail />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/documents/certificat-medical"
            element={
              <ProtectedRoute>
                <Layout>
                  <CertificatMedical />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Module Inventaire */}
          <Route
            path="/inventory"
            element={
              <ProtectedRoute>
                <Layout>
                  <InventoryList />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-inventory"
            element={
              <ProtectedRoute roles={['Admin', 'RH']}>
                <Layout>
                  <AddInventory />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-inventory"
            element={
              <ProtectedRoute>
                <Layout>
                  <MyInventory />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-inventory/:id"
            element={
              <ProtectedRoute roles={['Admin', 'RH']}>
                <Layout>
                  <EditInventory />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Notifications */}
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Layout>
                  <NotificationList />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;