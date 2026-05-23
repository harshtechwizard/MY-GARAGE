import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, createUserWithEmailAndPassword } from '../firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      // 1. Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();

      // 2. Register in our MongoDB backend
      const res = await fetch(`${API_URL}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();

      localStorage.setItem('userType', 'user');
      localStorage.setItem('userName', name);

      setMessage({ type: 'success', text: '✓ Account created successfully! Redirecting...' });
      setTimeout(() => navigate('/book'), 800);
    } catch (error) {
      let msg = 'Registration failed. Please try again.';
      if (error.code === 'auth/email-already-in-use') msg = 'An account with this email already exists.';
      else if (error.code === 'auth/weak-password') msg = 'Password should be at least 6 characters.';
      else if (error.code === 'auth/invalid-email') msg = 'Please enter a valid email address.';
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
            <span className="login-icon">👤</span>
            <h1 className="login-title">Create Account</h1>
            <p className="login-subtitle">Sign up to book car services</p>
          </div>

          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">👤 Full Name</label>
              <input type="text" id="name" className="form-control" placeholder="John Doe" required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">📧 Email Address</label>
              <input type="email" id="email" className="form-control" placeholder="you@example.com" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">🔒 Password</label>
              <input type="password" id="password" className="form-control" placeholder="Create a secure password" required autoComplete="new-password" minLength="6" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={isLoading}>
              {isLoading ? (<><span className="loading-spinner"></span> Creating account...</>) : (<span>🚀 Create Account</span>)}
            </button>
          </form>

          {message && (
            <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`} style={{ marginTop: '1.5rem' }}>{message.text}</div>
          )}

          <div className="text-link" style={{ textAlign: 'center', marginTop: '1.5rem', color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--accent-gold)', textDecoration: 'none', fontWeight: '600' }}>Sign in here</Link>
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

export default Register;
