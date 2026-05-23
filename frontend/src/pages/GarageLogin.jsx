import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, signInWithEmailAndPassword } from '../firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function GarageLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      // 1. Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();

      // 2. Sync with our backend (garage login)
      const res = await fetch(`${API_URL}/api/garages/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('userType', 'garage');
        localStorage.setItem('garageId', data.garage?.id || '');
        localStorage.setItem('garageName', data.garage?.name || '');
        setMessage({ type: 'success', text: '✓ Login successful! Redirecting...' });
        setTimeout(() => navigate('/dashboard'), 800);
      } else {
        // Garage not found in DB — prompt them to register
        setMessage({ type: 'error', text: '✗ Garage not found. Please register your garage first.' });
        setIsLoading(false);
      }
    } catch (error) {
      let msg = 'Login failed. Please try again.';
      if (error.code === 'auth/user-not-found') msg = 'No account found with this email.';
      else if (error.code === 'auth/wrong-password') msg = 'Incorrect password.';
      else if (error.code === 'auth/invalid-credential') msg = 'Invalid email or password.';
      else if (error.code === 'auth/too-many-requests') msg = 'Too many attempts. Please try again later.';
      else if (error.message) msg = error.message;

      setMessage({ type: 'error', text: '✗ ' + msg });
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <span className="login-icon">🔧</span>
            <h1 className="login-title">Garage Login</h1>
            <p className="login-subtitle">Access your garage dashboard</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="garage-email" className="form-label">📧 Email Address</label>
              <input type="email" id="garage-email" className="form-control" placeholder="garage@example.com" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="form-group">
              <label htmlFor="garage-password" className="form-label">🔒 Password</label>
              <input type="password" id="garage-password" className="form-control" placeholder="Enter your password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <button type="submit" className="btn btn-secondary btn-full" disabled={isLoading}>
              {isLoading ? (<><span className="loading-spinner"></span> Signing in...</>) : (<span>🚀 Sign In</span>)}
            </button>
          </form>

          {message && (
            <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`} style={{ marginTop: '1.5rem' }}>{message.text}</div>
          )}

          <div className="text-link" style={{ textAlign: 'center', marginTop: '1.5rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
            Don't have an account? <Link to="/garage-register" style={{ color: 'var(--accent-teal)', textDecoration: 'none', fontWeight: '600' }}>Register your garage</Link>
          </div>

          <div className="divider"><span>or</span></div>

          <div className="form-footer">
            <Link to="/" className="btn btn-outline btn-full">← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GarageLogin;
