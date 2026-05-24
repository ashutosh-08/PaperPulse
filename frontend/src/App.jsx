import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CertificatesPage from './pages/CertificatesPage';

/**
 * Main Application Index for PaperPulse.
 * Configures the AuthProvider and orchestrates site-wide routing logic.
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Auth Stream */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Operational Stream */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/certificates" element={<CertificatesPage />} />
          </Route>

          {/* Redirect Root to Dashboard/Login Context */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
