import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Pages publiques
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/LoginPage';
import BDEListPage from './pages/public/BDEListPage';
import EventListPage from './pages/public/EventListPage';
import PartnersPage from './pages/public/PartnersPage';

// Pages admin
import ValidationDashboard from './pages/admin/ValidationDashboard';
import EventsDashboard from './pages/admin/EventsDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/bdes" element={<BDEListPage />} />
          <Route path="/events" element={<EventListPage />} />
          <Route path="/partners" element={<PartnersPage />} />
          
          {/* Routes admin */}
          <Route
            path="/admin/validation"
            element={
              <ProtectedRoute requireRole="admin_interasso">
                <ValidationDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/events"
            element={
              <ProtectedRoute requireRole="admin_bde">
                <EventsDashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-4xl font-bold">404 - Page non trouvée</h1></div>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

