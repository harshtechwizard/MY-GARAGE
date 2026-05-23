import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function BookService() {
  const [garages, setGarages] = useState([]);
  const [selectedGarage, setSelectedGarage] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [carModel, setCarModel] = useState('');
  const [phone, setPhone] = useState('');
  const [garageId, setGarageId] = useState('');
  const [problem, setProblem] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [garagesLoading, setGaragesLoading] = useState(true);

  useEffect(() => {
    // Load garages from API
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

  const handleGarageSelect = (e) => {
    const val = e.target.value;
    setSelectedGarage(val);
    setGarageId(val);
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;

      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          userName: customerName,
          phone,
          service: `${carModel} - ${problem}`,
          garageId
        })
      });

      const result = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: '✓ ' + (result.message || 'Booking confirmed! Initiating payment...') });

        // Trigger Razorpay payment
        await handleRazorpayPayment(result.booking);

        setCustomerName('');
        setCarModel('');
        setPhone('');
        setGarageId('');
        setProblem('');
        setSelectedGarage('');
      } else {
        throw new Error(result.message || 'Booking failed');
      }
    } catch (error) {
      setMessage({ type: 'error', text: '✗ ' + (error.message || 'Network error. Please try again.') });
    } finally {
      setIsLoading(false);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async (bookingDetails) => {
    const res = await loadRazorpayScript();
    if (!res) {
      setMessage({ type: 'error', text: '✗ Failed to load Razorpay SDK. Please check your connection.' });
      return;
    }

    try {
      const token = await auth.currentUser?.getIdToken();
      
      // Create order on our backend
      const orderRes = await fetch(`${API_URL}/api/payments/create-order`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ amount: 500, receipt: `receipt_${Date.now()}` }), // Fixed amount 500 INR for demo
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error('Failed to create Razorpay order');
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'AutoCare Pro',
        description: `Service Booking at Garage ${garageId}`,
        order_id: orderData.order.id,
        handler: async function (response) {
          // Verify payment on the backend
          const verifyRes = await fetch(`${API_URL}/api/payments/verify`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            setMessage({ type: 'success', text: '✓ Payment successful! Your booking is confirmed.' });
          } else {
            setMessage({ type: 'error', text: '✗ Payment verification failed.' });
          }
        },
        prefill: {
          name: customerName,
          contact: phone,
        },
        theme: {
          color: '#667eea',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Payment error:', error);
      setMessage({ type: 'error', text: '✗ Error initiating payment.' });
    }
  };

  return (
    <div className="booking-page">
      <div className="booking-container">
        <div className="booking-card">
          <div className="booking-header">
            <span className="booking-icon">📅</span>
            <h1 className="booking-title">Book Your Service</h1>
            <p className="booking-subtitle">Schedule your car maintenance appointment</p>
          </div>

          <div className="info-box">
            ℹ️ <strong>Quick Tip:</strong> Browse available garages below or enter a specific garage ID if you already know it.
          </div>

          {/* Google Maps Placeholder - will be activated with API key */}
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px dashed rgba(255,255,255,0.2)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--spacing-lg)',
            marginBottom: 'var(--spacing-lg)',
            textAlign: 'center',
            color: 'var(--text-2)'
          }}>
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>🗺️</span>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>Google Maps will load here showing nearby garages</p>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-3)' }}>(Requires Google Maps API key)</p>
          </div>

          {/* Garage Selection */}
          <div className="form-group">
            <label htmlFor="garageSelect" className="form-label">🔧 Select Garage</label>
            <select id="garageSelect" className="form-control" value={selectedGarage} onChange={handleGarageSelect}>
              <option value="">
                {garagesLoading ? 'Loading garages...' : 'Choose a garage...'}
              </option>
              {garages.map((g) => (
                <option key={g._id} value={g._id}>{g.name} - {g.location}</option>
              ))}
            </select>
            <small style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
              Or enter garage ID manually below
            </small>
          </div>

          <form onSubmit={handleBooking}>
            <div className="form-group">
              <label htmlFor="customerName" className="form-label">👤 Full Name</label>
              <input type="text" id="customerName" className="form-control" placeholder="John Doe" required autoComplete="name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="carModel" className="form-label">🚗 Car Model</label>
                <input type="text" id="carModel" className="form-control" placeholder="Toyota Camry 2020" required value={carModel} onChange={(e) => setCarModel(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="phone" className="form-label">📞 Phone Number</label>
                <input type="tel" id="phone" className="form-control" placeholder="+91 98765 43210" required autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="garageIdInput" className="form-label">🔧 Garage ID</label>
              <input type="text" id="garageIdInput" className="form-control" placeholder="Enter the garage identifier" required value={garageId} onChange={(e) => setGarageId(e.target.value)} />
            </div>

            <div className="form-group">
              <label htmlFor="problem" className="form-label">🔍 Service Description</label>
              <textarea id="problem" className="form-control" placeholder="Describe the service you need (e.g., oil change, brake inspection, engine diagnostics...)" required rows="4" value={problem} onChange={(e) => setProblem(e.target.value)}></textarea>
            </div>

            {/* Razorpay Payment Info */}
            <div style={{
              background: 'rgba(61, 219, 132, 0.08)',
              border: '1px solid rgba(61, 219, 132, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--spacing-md)',
              marginBottom: 'var(--spacing-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <span style={{ fontSize: '1.5rem' }}>💳</span>
              <div>
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>Secure Payment via Razorpay</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-2)' }}>You will be redirected to Razorpay checkout after confirming your booking</p>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary btn-full" disabled={isLoading}>
                {isLoading ? (
                  <><span className="loading-spinner"></span> Processing...</>
                ) : (
                  <span>🚀 Confirm Booking & Pay</span>
                )}
              </button>
              <Link to="/" className="btn btn-outline btn-full">← Back to Home</Link>
            </div>
          </form>

          {message && (
            <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`} style={{ marginTop: '1.5rem' }}>
              {message.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookService;
