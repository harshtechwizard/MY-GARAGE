import { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="site-header" aria-label="Primary">
      <div className="container nav-wrap">
        <Link to="/" className="brand" aria-label="AutoCare Pro home">AutoCare Pro</Link>
        <button 
          className="nav-toggle" 
          aria-expanded={isOpen} 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
        >
          <span></span><span></span><span></span>
        </button>
        <nav id="site-nav" className={`site-nav ${isOpen ? 'is-open' : ''}`} aria-label="Main navigation">
          <Link to="/">How it works</Link>
          <Link to="/">Features</Link>
          <Link to="/">Stats</Link>
          <Link to="/garage-register">For Garages</Link>
          <Link to="/login" className="btn btn-outline nav-btn">Login</Link>
          <Link to="/register" className="btn btn-primary nav-btn">Get Started</Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
