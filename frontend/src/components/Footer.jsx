import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-wrap">
        <p>AutoCare Pro</p>
        <div className="footer-links">
          <Link to="/login">Customer Login</Link>
          <Link to="/register">Customer Signup</Link>
          <Link to="/garage-login">Garage Login</Link>
          <Link to="/garage-register">Garage Signup</Link>
          <Link to="/book">Book Service</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
