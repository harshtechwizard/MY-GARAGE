import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, createUserWithEmailAndPassword } from '../firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function GarageRegister() {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [services, setServices] = useState('');
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

      // 2. Register garage in our MongoDB backend
      const res = await fetch(`${API_URL}/api/garages/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          location,
          email,
          services: services.split(',').map(s => s.trim()).filter(Boolean),
        }),
      });

      const data = await res.json();

      localStorage.setItem('userType', 'garage');
      localStorage.setItem('garageId', data.garage?.id || '');
      localStorage.setItem('garageName', name);

      setMessage({ type: 'success', text: '✓ Garage registered successfully! Redirecting...' });
      setTimeout(() => navigate('/dashboard'), 800);
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
    <div className="login-page" style={{ padding: 'var(--spacing-xl) var(--spacing-md)' }}>
      <div className="login-container" style={{ maxWidth: '600px' }}>
        <div className="login-card">
          <div className="login-header">
            <span className="login-icon" style={{ animation: 'float 3s ease-in-out infinite' }}>🔧</span>
            <h1 className="login-title">Register Your Garage</h1>
            <p className="login-subtitle">Join our network of trusted service providers</p>
          </div>

          {/* Benefits Box */}
          <div style={{
            background: 'rgba(76, 205, 196, 0.1)',
            border: '1px solid rgba(76, 205, 196, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--spacing-md)',
            marginBottom: 'var(--spacing-lg)'
          }}>
            <h3 style={{ color: 'var(--accent-teal)', fontSize: '1rem', marginBottom: 'var(--spacing-xs)' }}>🌟 Partner Benefits</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {['Access to thousands of potential customers', 'Easy booking management system', 'Increase your business visibility', 'Professional dashboard and analytics'].map((item, i) => (
                <li key={i} style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', padding: '0.25rem 0' }}>
                  <span style={{ color: 'var(--accent-teal)', fontWeight: 'bold', marginRight: '0.5rem' }}>✓</span>{item}
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label htmlFor="garage-name" className="form-label">🏢 Garage Name</label>
              <input type="text" id="garage-name" className="form-control" placeholder="AutoCare Service Center" required autoComplete="organization" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
              <div className="form-group">
                <label htmlFor="garage-location" className="form-label">📍 Location</label>
                <input type="text" id="garage-location" className="form-control" placeholder="City, State" required value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="garage-reg-email" className="form-label">📧 Email</label>
                <input type="email" id="garage-reg-email" className="form-control" placeholder="garage@example.com" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="garage-reg-password" className="form-label">🔒 Password</label>
              <input type="password" id="garage-reg-password" className="form-control" placeholder="Create a secure password" required autoComplete="new-password" minLength="6" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <div className="form-group">
              <label htmlFor="garage-services" className="form-label">🛠️ Services Offered</label>
              <textarea id="garage-services" className="form-control" placeholder="Oil Change, Brake Repair, Engine Diagnostics, Tire Service, AC Repair..." required rows="3" value={services} onChange={(e) => setServices(e.target.value)}></textarea>
              <small style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>Separate services with commas</small>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-lg)' }}>
              <button type="submit" className="btn btn-secondary btn-full" disabled={isLoading}>
                {isLoading ? (<><span className="loading-spinner"></span> Registering...</>) : (<span>🚀 Register Now</span>)}
              </button>
              <Link to="/" className="btn btn-outline btn-full">← Back to Home</Link>
            </div>
          </form>

          {message && (
            <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`} style={{ marginTop: '1.5rem' }}>{message.text}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GarageRegister;
