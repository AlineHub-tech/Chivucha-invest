import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, MinusCircle, Layers, FileText, QrCode } from 'lucide-react';
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
            <p className="ch-footer-text">
              A legally registered enterprise providing end-to-end operational software infrastructure. We engineer robust technology frameworks that streamline internal business workflows and scale market credibility.
            </p>
          </div>

          {/* Column 2: Quick Links Directory Links */}
          <div className="ch-footer-col links-col">
            <h4 className="ch-footer-heading">Quick Links</h4>
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
            <span className="ch-node-badge">Terminal: Kigali Node #2</span>
            <span className="ch-credit-pill">
              Engineered by <a href="https://vercel.app" target="_blank" rel="noreferrer" className="ch-bf-credit-link">ByteFlow Ltd</a>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
