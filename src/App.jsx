import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import StackIn from './pages/StackIn';
import StackOut from './pages/StackOut';
import Stock from './pages/Stock';
import Reports from './pages/Reports';
import QrScanner from './pages/QrScanner';
import Footer from './components/Footer';
import Login from './pages/Login';

const isAuthenticated = () => Boolean(localStorage.getItem('chivucha_jwt_token'));

function ProtectedRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Router>
      <div className="bf-dashboard-app">
        <Navbar />
        <main className="bf-main-content">
          <div className="bf-content-container">
            <Routes>
              <Route path="/" element={<Navigate to={isAuthenticated() ? '/dashboard' : '/login'} replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/stackin" element={<ProtectedRoute><StackIn /></ProtectedRoute>} />
              <Route path="/stackout" element={<ProtectedRoute><StackOut /></ProtectedRoute>} />
              <Route path="/stock" element={<ProtectedRoute><Stock /></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
              <Route path="/qrcode" element={<ProtectedRoute><QrScanner /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to={isAuthenticated() ? '/dashboard' : '/login'} replace />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
