import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [activeStatus, setActiveStatus] = useState('live');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const renderStatus = () => {
    if (activeStatus === 'error') {
      return <div className="status-message error-state" role="status">Unable to load availability. Please try again.</div>;
    }
    if (activeStatus === 'empty') {
      return <div className="status-message empty-state" role="status">No open slots right now. Check back in a few minutes.</div>;
    }
    return (
      <>
        <div className="status-row">
          <span className="dot ok"></span>
          <div><p className="status-title">Downtown Garage</p><p className="status-meta">Available in 30 min</p></div>
        </div>
        <div className="status-row">
          <span className="dot warn"></span>
          <div><p className="status-title">West End Motors</p><p className="status-meta">2 slots left today</p></div>
        </div>
        <div className="status-row">
          <span className="dot error"></span>
          <div><p className="status-title">Prime Auto Hub</p><p className="status-meta">Booked for today</p></div>
        </div>
      </>
    );
  };

  return (
    <>
      {/* Hero */}
      <section className="landing-section hero" aria-labelledby="hero-title">
        <div className="container hero-grid">
          <div className={`hero-copy reveal ${isVisible ? 'is-visible' : ''}`}>
            <p className="hero-kicker">Trusted by drivers and service teams nationwide</p>
            <h1 id="hero-title">Book reliable car care in under two minutes.</h1>
            <p className="hero-subtitle">
              AutoCare Pro connects you with verified garages, transparent pricing, and real-time service slots so your vehicle stays road-ready.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary">Start Booking</Link>
              <Link to="/login" className="btn btn-outline">Customer Login</Link>
            </div>
            <p className="hero-meta">No calls, no waiting room guesswork, no hidden fees.</p>
          </div>
          <aside className={`hero-panel glass-card reveal ${isVisible ? 'is-visible' : ''}`} aria-live="polite">
            <h2>Service availability</h2>
            <p className="panel-label">Live booking status</p>
            <div className="status-list" id="statusList">
              {renderStatus()}
            </div>
            <div className="status-actions">
              <button type="button" className={`btn btn-outline status-btn ${activeStatus === 'live' ? 'active' : ''}`} onClick={() => setActiveStatus('live')}>Live</button>
              <button type="button" className={`btn btn-outline status-btn ${activeStatus === 'empty' ? 'active' : ''}`} onClick={() => setActiveStatus('empty')}>Empty</button>
              <button type="button" className={`btn btn-outline status-btn ${activeStatus === 'error' ? 'active' : ''}`} onClick={() => setActiveStatus('error')}>Error</button>
            </div>
          </aside>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="landing-section section-how" aria-labelledby="how-title">
        <div className="container">
          <div className={`section-head reveal ${isVisible ? 'is-visible' : ''}`}>
            <p className="section-eyebrow">How it works</p>
            <h2 id="how-title">From request to repair in three simple steps</h2>
          </div>
          <div className="step-grid">
            {[
              { num: '01', title: 'Select your service', desc: 'Choose maintenance, diagnostics, repairs, or inspections based on your vehicle needs.' },
              { num: '02', title: 'Pick a nearby garage', desc: 'Compare ratings, turnaround time, and available slots before you confirm.' },
              { num: '03', title: 'Track and return', desc: 'Receive updates, manage upcoming appointments, and keep your service history organized.' }
            ].map((step, i) => (
              <article key={i} className={`step-card reveal ${isVisible ? 'is-visible' : ''}`}>
                <span className="step-index">{step.num}</span>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="landing-section section-features" aria-labelledby="feature-title">
        <div className="container">
          <div className={`section-head reveal ${isVisible ? 'is-visible' : ''}`}>
            <p className="section-eyebrow">Platform features</p>
            <h2 id="feature-title">Built for modern vehicle owners and garage teams</h2>
          </div>
          <div className="feature-grid">
            {[
              { title: 'Verified providers', desc: 'Every listed garage is vetted for quality, equipment readiness, and customer experience.' },
              { title: 'Instant confirmation', desc: 'Get booking confirmation right away with clear timing and service expectations.' },
              { title: 'Transparent pricing', desc: 'Know what you will pay before checkout with clear service line items.' },
              { title: 'Smart reminders', desc: 'Stay ahead of preventive maintenance with timely alerts and booking prompts.' }
            ].map((feat, i) => (
              <article key={i} className={`feature-item reveal ${isVisible ? 'is-visible' : ''}`}>
                <h3>{feat.title}</h3>
                <p>{feat.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="landing-section section-stats" aria-labelledby="stats-title">
        <div className={`container stats-box glass-card reveal ${isVisible ? 'is-visible' : ''}`}>
          <div className="section-head">
            <p className="section-eyebrow">Performance</p>
            <h2 id="stats-title">Proof that service operations are running at scale</h2>
          </div>
          <div className="stats-grid">
            {[
              { value: '10K+', label: 'Active drivers' },
              { value: '500+', label: 'Garage partners' },
              { value: '50K+', label: 'Services completed' },
              { value: '4.9/5', label: 'Average rating' }
            ].map((stat, i) => (
              <article key={i} className="stat-item">
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-section section-cta" aria-labelledby="cta-title">
        <div className={`container cta-box reveal ${isVisible ? 'is-visible' : ''}`}>
          <h2 id="cta-title">Ready to simplify car service booking?</h2>
          <p>Join AutoCare Pro today as a customer or partner garage.</p>
          <div className="hero-actions" style={{ justifyContent: 'center' }}>
            <Link to="/register" className="btn btn-primary">Create Customer Account</Link>
            <Link to="/garage-register" className="btn btn-secondary">Register Your Garage</Link>
            <Link to="/garage-login" className="btn btn-outline">Garage Login</Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
