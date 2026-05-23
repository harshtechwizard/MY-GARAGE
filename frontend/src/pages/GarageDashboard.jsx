import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { storage, ID } from '../appwrite';
import { auth } from '../firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function GarageDashboard() {
  const [garages, setGarages] = useState([]);
  const [selectedGarage, setSelectedGarage] = useState('');
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [message, setMessage] = useState(null);
  const [garagesLoading, setGaragesLoading] = useState(true);
  const [viewState, setViewState] = useState('empty'); // 'empty' | 'loading' | 'data'

  // Appwrite file upload state
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);

  useEffect(() => {
    const loadGarages = async () => {
      try {
        const res = await fetch(`${API_URL}/api/garages/nearby`);
        if (res.ok) {
          const data = await res.json();
          setGarages(data);
        }
      } catch (err) {
        console.error('Error loading garages:', err);
      } finally {
        setGaragesLoading(false);
      }
    };
    loadGarages();
  }, []);

  const fetchBookings = async () => {
    if (!selectedGarage) {
      setMessage({ type: 'warning', text: '⚠️ Please select a garage first' });
      return;
    }

    setViewState('loading');
    setMessage(null);
    setShowStats(false);

    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error("Authentication required");

      const res = await fetch(`${API_URL}/api/bookings/${selectedGarage}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();

      if (res.ok) {
        setBookings(data);
        setShowStats(data.length > 0);
        setViewState(data.length > 0 ? 'data' : 'empty-result');
      } else {
        throw new Error(data.message || 'Failed to fetch bookings');
      }
    } catch (error) {
      setMessage({ type: 'error', text: '✗ Error loading bookings. Please try again.' });
      setViewState('empty');
    }
  };

  const handleFileUpload = async () => {
    if (!uploadFile) {
      setUploadStatus({ type: 'error', text: 'Please select a file first' });
      return;
    }
    
    try {
      setUploadStatus({ type: 'info', text: 'Uploading to Appwrite...' });
      
      const bucketId = import.meta.env.VITE_APPWRITE_BUCKET_ID;
      if (!bucketId) {
        throw new Error('Appwrite Bucket ID is not configured');
      }

      await storage.createFile(bucketId, ID.unique(), uploadFile);
      
      setUploadStatus({ type: 'success', text: '✓ Photo uploaded successfully to Appwrite!' });
      setUploadFile(null);
    } catch (error) {
      console.error('Appwrite upload error:', error);
      setUploadStatus({ type: 'error', text: '✗ ' + (error.message || 'Failed to upload photo') });
    }
  };

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => !b.status || b.status === 'pending').length,
    completed: bookings.filter(b => b.status === 'completed').length
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">📊 Garage Dashboard</h1>
          <p className="dashboard-subtitle">Manage your bookings and track performance</p>
        </div>

        {/* Controls */}
        <div className="controls-card">
          <div className="controls-grid">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="dashGarageSelect" className="form-label">🔧 Select Garage</label>
              <select id="dashGarageSelect" className="form-control" value={selectedGarage} onChange={(e) => setSelectedGarage(e.target.value)}>
                <option value="">{garagesLoading ? 'Loading garages...' : 'Choose a garage...'}</option>
                {garages.map((g) => (
                  <option key={g._id} value={g._id}>{g.name} ({g.location})</option>
                ))}
              </select>
            </div>
            <button onClick={fetchBookings} className="btn btn-secondary" disabled={isLoading}>📥 Load Bookings</button>
            <Link to="/" className="btn btn-outline">← Home</Link>
          </div>
        </div>

        {/* Appwrite File Upload Section */}
        <div className="controls-card" style={{ marginBottom: 'var(--spacing-xl)' }}>
          <h3 style={{ marginBottom: 'var(--spacing-md)', color: 'var(--accent-teal)' }}>📸 Upload Garage Photos (Appwrite Storage)</h3>
          <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: '200px' }}>
              <label htmlFor="garagePhoto" className="form-label">Select Image</label>
              <input
                type="file"
                id="garagePhoto"
                className="form-control"
                accept="image/*"
                onChange={(e) => setUploadFile(e.target.files[0])}
                style={{ padding: '0.6rem' }}
              />
            </div>
            <button onClick={handleFileUpload} className="btn btn-secondary">
              ☁️ Upload to Appwrite
            </button>
          </div>
          {uploadStatus && (
            <div className={`alert ${uploadStatus.type === 'success' ? 'alert-success' : 'alert-error'}`} style={{ marginTop: '1rem' }}>
              {uploadStatus.text}
            </div>
          )}
        </div>

        {/* Stats */}
        {showStats && (
          <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)' }}>
            {[
              { icon: '📊', value: stats.total, label: 'Total Bookings', color: 'var(--accent-gold)' },
              { icon: '⏳', value: stats.pending, label: 'Pending', color: 'var(--warning)' },
              { icon: '✅', value: stats.completed, label: 'Completed', color: 'var(--success)' },
              { icon: '⭐', value: '4.8', label: 'Avg Rating', color: 'var(--accent-gold)' }
            ].map((stat, i) => (
              <div key={i} className="stat-card" style={{
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(10px)',
                padding: 'var(--spacing-lg)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--glass-border)',
                textAlign: 'center',
                transition: 'all var(--transition-base)',
              }}>
                <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: 'var(--spacing-xs)' }}>{stat.icon}</span>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: stat.color, marginBottom: 'var(--spacing-xs)' }}>{stat.value}</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Table */}
        <div className="table-card" style={{
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(20px)',
          padding: 'var(--spacing-xl)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--shadow-lg)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--white)', margin: 0 }}>Recent Bookings</h2>
          </div>

          {message && (
            <div className={`alert alert-${message.type}`} style={{ marginBottom: '1rem' }}>
              {message.text}
            </div>
          )}

          {/* Loading State */}
          {viewState === 'loading' && (
            <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
              <div className="loading-spinner-large" style={{
                display: 'inline-block', width: '48px', height: '48px',
                border: '4px solid rgba(255,255,255,0.2)', borderTopColor: 'var(--accent-gold)',
                borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: 'var(--spacing-md)'
              }}></div>
              <p style={{ color: 'rgba(255,255,255,0.8)' }}>Loading bookings...</p>
            </div>
          )}

          {/* Empty State */}
          {(viewState === 'empty' || viewState === 'empty-result') && (
            <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)', color: 'rgba(255,255,255,0.6)' }}>
              <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-md)', opacity: 0.5 }}>
                {viewState === 'empty-result' ? '📭' : '📋'}
              </div>
              <h3>{viewState === 'empty-result' ? 'No Bookings Found' : 'No Bookings Yet'}</h3>
              <p>{viewState === 'empty-result' ? "This garage doesn't have any bookings yet" : 'Select a garage and click "Load Bookings" to view appointments'}</p>
            </div>
          )}

          {/* Data Table */}
          {viewState === 'data' && (
            <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-md)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: 'rgba(255,255,255,0.03)' }}>
                <thead style={{ background: 'rgba(255, 215, 0, 0.1)' }}>
                  <tr>
                    <th style={thStyle}>👤 Customer</th>
                    <th style={thStyle}>🚗 Service</th>
                    <th style={thStyle}>📞 Contact</th>
                    <th style={thStyle}>📝 Status</th>
                    <th style={thStyle}>⏰ Date</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking, i) => {
                    const status = booking.status || 'pending';
                    return (
                      <tr key={i} style={{ transition: 'all 0.2s' }}>
                        <td style={tdStyle}>{booking.userName || 'N/A'}</td>
                        <td style={tdStyle}>{booking.service || 'N/A'}</td>
                        <td style={tdStyle}>{booking.phone || 'N/A'}</td>
                        <td style={tdStyle}>
                          <span style={{
                            display: 'inline-block',
                            padding: '0.25rem 0.75rem',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            background: status === 'completed' ? 'rgba(76,175,80,0.2)' : 'rgba(255,152,0,0.2)',
                            color: status === 'completed' ? 'var(--success)' : 'var(--warning)',
                            border: `1px solid ${status === 'completed' ? 'var(--success)' : 'var(--warning)'}`
                          }}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          {new Date(booking.createdAt || Date.now()).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const thStyle = {
  padding: 'var(--spacing-md)',
  textAlign: 'left',
  fontWeight: 600,
  color: 'var(--accent-gold)',
  borderBottom: '2px solid var(--glass-border)',
  whiteSpace: 'nowrap'
};

const tdStyle = {
  padding: 'var(--spacing-md)',
  borderBottom: '1px solid rgba(255,255,255,0.05)',
  color: 'rgba(255,255,255,0.9)'
};

export default GarageDashboard;
