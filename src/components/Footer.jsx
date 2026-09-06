import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, MinusCircle, Layers, FileText, QrCode, ShieldCheck, Circle } from 'lucide-react';
import LogoImg from '../assets/logo.png';
import '../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="ch-footer-modern">
      <div className="container ch-footer-container">
        
        {/* Row 1: Top Footer Layout split into grid columns */}
        <div className="ch-footer-top-grid">
          
          {/* Column 1: Company Profile Description */}
          <div className="ch-footer-col description-col">
            <div className="ch-footer-brand">
              <img src={LogoImg} alt="Chivucha Logo" className="ch-footer-logo" />
              <span className="ch-footer-title">Chivucha <span className="green-accent">Ltd</span></span>
            </div>
            <p className="ch-footer-text">A focused inventory command system for tracking stock, operations, and audit history in one clear workspace.</p>
            <div className="ch-footer-status"><span className="ch-footer-status-dot"></span><span>System operational</span><span className="ch-footer-status-divider"></span><ShieldCheck size={14} /><span>Protected workspace</span></div>
          </div>

          {/* Column 2: Quick Links Directory Links */}
          <div className="ch-footer-col links-col">
            <h4 className="ch-footer-heading">Workspace modules</h4>
            <div className="ch-footer-links-grid">
              <NavLink to="/dashboard" className="ch-footer-link">
                <LayoutDashboard size={14} /> <span>Dashboard</span>
              </NavLink>
              <NavLink to="/stackin" className="ch-footer-link">
                <PlusCircle size={14} /> <span>Stack In / CRUD</span>
              </NavLink>
              <NavLink to="/stackout" className="ch-footer-link">
                <MinusCircle size={14} /> <span>Stack Out</span>
              </NavLink>
              <NavLink to="/stock" className="ch-footer-link">
                <Layers size={14} /> <span>Stock Ledger</span>
              </NavLink>
              <NavLink to="/reports" className="ch-footer-link">
                <FileText size={14} /> <span>Reports</span>
              </NavLink>
              <NavLink to="/qrcode" className="ch-footer-link">
                <QrCode size={14} /> <span>QR Scanner</span>
              </NavLink>
            </div>
          </div>

        </div>

        {/* Row 2: Bottom Copyright Bar & Credits Link */}
        <div className="ch-footer-bottom-bar">
          <div className="ch-footer-copyright-area">
            <p className="ch-copyright-text">
              © {currentYear} <strong>Chivucha Investment Ltd</strong>. All rights reserved.
            </p>
            <div className="ch-legal-links">
              <Link to="/privacy" className="ch-legal-link">Privacy Policy</Link>
              <span className="ch-legal-divider" />
              <Link to="/terms" className="ch-legal-link">Terms of Service</Link>
            </div>
          </div>
          
          <div className="ch-footer-credits-area">
            <span className="ch-node-badge"><Circle size={8} fill="currentColor" /> Kigali Office</span>
            <span className="ch-credit-pill">
              Engineered by <a href="https://byte-flow-ltd.vercel.app/" target="_blank" rel="noreferrer" className="ch-bf-credit-link">ByteFlow Ltd</a>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
