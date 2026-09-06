import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Menu, X, LayoutDashboard, PlusCircle, MinusCircle, FileText, QrCode, Layers, LogOut, User } from 'lucide-react';
import LogoImg from '../assets/logo.png';
import '../styles/Navbar.css';
import { readSession } from '../api/apiService';

const deleteCookie = (name) => {
  document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
};

const clearStoredSession = () => {
  localStorage.removeItem('chivucha_jwt_token');
  localStorage.removeItem('chivucha_logged_user');
  localStorage.removeItem('chivucha_user_role');
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const session = readSession();
  const token = session?.token || '';
  const loggedUser = session?.username || 'Guest';

  useEffect(() => {
    document.body.classList.toggle('menu-open', isOpen);
    return () => document.body.classList.remove('menu-open');
  }, [isOpen]);

  if (!token) {
    return null;
  }

  // ENGINE CLEAR CLEARANCE SESSION
  const handleSystemLogout = () => {
    if (window.confirm("Are you sure you want to log out of Chivucha Terminal Network?")) {
      deleteCookie('chivucha_jwt_token');
      deleteCookie('chivucha_token');
      deleteCookie('chivucha_user');
      deleteCookie('chivucha_role');
      clearStoredSession();
      navigate('/login');
      window.location.reload();
    }
  };
  return (
    <nav className={`navbar-elite ${isOpen ? 'menu-open' : ''}`}>
      <div className={`nav-backdrop ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(false)} />
      
      <div className="container nav-container">
        <Link to="/dashboard" className="nav-brand" onClick={() => setIsOpen(false)}>
          <div className="nav-logo-wrapper">
            <img src={LogoImg} alt="Chivucha Logo" className="nav-brand-logo" />
          </div>
          <div className="brand-copy">
            <span className="brand-title">Chivucha <span className="accent">Ltd</span></span>
            <span className="brand-subtitle">Investment & Inventory System</span>
          </div>
        </Link>

        <div id="navbar-menu" className={`nav-links ${isOpen ? 'active' : ''}`} role="menu">
          <div className="nav-panel-header">
            <span className="nav-panel-title">Menu Portal</span>
            <button type="button" className="nav-close" onClick={() => setIsOpen(false)}>
              <X size={22} />
            </button>
          </div>
          
          <NavLink to="/dashboard" className="nav-link" onClick={() => setIsOpen(false)}>
            <div className="nav-link-main"><LayoutDashboard size={20} /> <span className="nav-link-title">Dashboard</span></div>
          </NavLink>
          
          <NavLink to="/stackin" className="nav-link" onClick={() => setIsOpen(false)}>
            <div className="nav-link-main"><PlusCircle size={20} /> <span className="nav-link-title">Stack In / CRUD</span></div>
          </NavLink>
          
          <NavLink to="/stackout" className="nav-link" onClick={() => setIsOpen(false)}>
            <div className="nav-link-main"><MinusCircle size={20} /> <span className="nav-link-title">Stack Out</span></div>
          </NavLink>

          <NavLink to="/stock" className="nav-link" onClick={() => setIsOpen(false)}>
            <div className="nav-link-main"><Layers size={20} /> <span className="nav-link-title">Stock Ledger</span></div>
          </NavLink>
          
          <NavLink to="/reports" className="nav-link" onClick={() => setIsOpen(false)}>
            <div className="nav-link-main"><FileText size={20} /> <span className="nav-link-title">Reports</span></div>
          </NavLink>

          <NavLink to="/qrcode" className="nav-link" onClick={() => setIsOpen(false)}>
            <div className="nav-link-main"><QrCode size={20} /> <span className="nav-link-title">QR Scanner</span></div>
          </NavLink>

          {/* 🎯 MOBILE ACCESS PROFILE VIEW LOGOUT TILES */}
          <div className="nav-mobile-user-profile-block">
            <div className="nav-user-badge"><User size={14} /> <span>{loggedUser}</span></div>
            <button className="nav-logout-action-trigger" onClick={handleSystemLogout}><LogOut size={16} /> <span>Sign Out</span></button>
          </div>
        </div>

        {/* 🎯 DESKTOP ONLY PROFILE AREA METRICS */}
        <div className="nav-desktop-profile-suite desktop-only">
          <div className="nav-user-badge"><User size={16} /> <span>{loggedUser}</span></div>
          <button className="nav-logout-btn-trigger" onClick={handleSystemLogout} title="Sign Out NetworkNode"><LogOut size={18} /></button>
        </div>

        <button type="button" className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>
    </nav>
  );
}
