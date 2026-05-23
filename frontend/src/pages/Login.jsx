import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, signInWithEmailAndPassword } from '../firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Login() {
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

      // 2. Sync with our backend
      const res = await fetch(`${API_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('userType', 'user');
        localStorage.setItem('userName', data.user?.name || userCredential.user.email);
        setMessage({ type: 'success', text: '✓ Login successful! Redirecting...' });
        setTimeout(() => navigate('/book'), 800);
      } else {
        // User exists in Firebase but not in our DB — still allow navigation
        localStorage.setItem('userType', 'user');
        localStorage.setItem('userName', userCredential.user.email);
        setMessage({ type: 'success', text: '✓ Signed in! Redirecting...' });
        setTimeout(() => navigate('/book'), 800);
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
            <span className="login-icon">🔐</span>
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Sign in to access your account</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">📧 Email Address</label>
              <input type="email" id="email" className="form-control" placeholder="you@example.com" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">🔒 Password</label>
              <input type="password" id="password" className="form-control" placeholder="Enter your password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={isLoading}>
              {isLoading ? (<><span className="loading-spinner"></span> Signing in...</>) : (<span>🚀 Sign In</span>)}
            </button>
          </form>

          {message && (
            <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`} style={{ marginTop: '1.5rem' }}>{message.text}</div>
          )}

          <div className="text-link" style={{ textAlign: 'center', marginTop: '1.5rem', color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--accent-gold)', textDecoration: 'none', fontWeight: '600' }}>Sign up here</Link>
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

export default Login;
