import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  // Hide header on public profile view for strict mobile-first appearance
  if (location.pathname.startsWith('/p/')) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" className="navbar-brand text-gradient">
          <span style={{ fontSize: '1.8rem' }}>⚡</span> QRGen
        </Link>
        <div className="nav-links">
          {token ? (
            <>
              <Link to="/dashboard" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                Dashboard
              </Link>
              <Link to="/create-profile" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                Edit Profile
              </Link>
              <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
