// components/Navbar.js
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import './Navbar.css';

const Navbar = ({ user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <div className="logo">
            <span className="logo-icon">📷</span>
            <span>UIU Photography Club</span>
          </div>
        </Link>

        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/gallery" 
            className={`nav-link ${isActive('/gallery') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Gallery
          </Link>
          <Link 
            to="/members" 
            className={`nav-link ${isActive('/members') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Members
          </Link>
          <Link 
            to="/events" 
            className={`nav-link ${isActive('/events') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Events
          </Link>
          <Link 
            to="/blog" 
            className={`nav-link ${isActive('/blog') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Blog
          </Link>
          <Link 
            to="/join" 
            className={`nav-link ${isActive('/join') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Join Us
          </Link>
          <Link 
            to="/contact" 
            className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
          
          {user && (
            <Link 
              to="/admin" 
              className={`nav-link admin-link ${isActive('/admin') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Admin
            </Link>
          )}
          
          {user ? (
            <button className="btn-secondary nav-btn" onClick={handleSignOut}>
              Sign Out
            </button>
          ) : (
            <Link 
              to="/join" 
              className="btn-primary nav-btn"
              onClick={() => setIsMenuOpen(false)}
            >
              Join Now
            </Link>
          )}
        </div>

        <div 
          className={`nav-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;