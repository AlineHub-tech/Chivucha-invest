import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User } from 'lucide-react';
import { authAPI } from '../api/authApi'; // Updated to point directly to our modular authApi file
import '../styles/Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🛡️ RECOVERY GATEKEEPER: Instantly forwards authenticated sessions straight to the dashboard
  useEffect(() => {
    const token = localStorage.getItem('chivucha_jwt_token');
    if (token) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Dispatch payload to Render backend API cluster
      const data = await authAPI.login(username, password);

      // Securely lock transactional authorization parameters inside localStorage
      localStorage.setItem('chivucha_jwt_token', data.token);
      localStorage.setItem('chivucha_logged_user', data.username);
      localStorage.setItem('chivucha_user_role', data.role); // Sets ADMIN or GUEST layout access profiles

      alert(`Clearance approved. Welcome back ${data.username}!`);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication clearance node interface failure.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg-page-wrapper">
      <div className="lg-card">
        <div className="lg-card-header">
          <div className="lg-logo-icon"><ShieldCheck size={28} /></div>
          <h3>Chivucha Terminal Gateway</h3>
          <p>Provide secure authorization clearance keys to access database inventory networks.</p>
        </div>

        {error && <div className="lg-error-message">{error}</div>}

        <form onSubmit={handleLoginSubmit} className="lg-form-suite">
          <div className="lg-form-group">
            <label>Username Link</label>
            <div className="lg-input-wrapper">
              <User size={16} />
              <input 
                type="text" 
                required 
                placeholder="Enter username (e.g., jazyy)" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                disabled={loading}
              />
            </div>
          </div>

          <div className="lg-form-group">
            <label>Security Key Password</label>
            <div className="lg-input-wrapper">
              <Lock size={16} />
              <input 
                type="password" 
                required 
                placeholder="Enter password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                disabled={loading}
              />
            </div>
          </div>

          <button type="submit" className="lg-submit-btn" disabled={loading}>
            {loading ? 'Verifying Clearance...' : 'Authorize Node Access'}
          </button>
        </form>

        <div className="lg-footer-notice">
          <p>Authorized access points monitored securely by ByteFlow encryption systems.</p>
        </div>
      </div>
    </div>
  );
}
