// components/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { FaCamera, FaTimes, FaBars } from 'react-icons/fa';
import myLogo from '../assests/logo.jpg';
import './Navbar.css';

const Navbar = ({ user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/members', label: 'Members' },
    { path: '/events', label: 'Events' },
    { path: '/blog', label: 'Blog' },
    { path: '/join', label: 'Join Us' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo" onClick={() => setIsMenuOpen(false)}>
          <img src={myLogo} alt="UIUPC Logo" className="logo-icon" />
          <div className="logo-text">
            <span className="logo-main">UIUPC</span>
            <span className="logo-sub">Photography Club</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="nav-menu">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
          
          {user && (
            <Link to="/admin" className={`nav-link admin-link ${isActive('/admin') ? 'active' : ''}`}>
              Admin
            </Link>
          )}
          
          <div className="nav-actions">
            {user ? (
              <button className="nav-btn sign-out" onClick={handleSignOut}>
                Sign Out
              </button>
            ) : (
              <Link to="/join" className="nav-btn join-btn">
                Join Now
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="nav-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-content">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`mobile-nav-link ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          
          {user && (
            <Link 
              to="/admin" 
              className="mobile-nav-link admin-link"
              onClick={() => setIsMenuOpen(false)}
            >
              Admin
            </Link>
          )}
          
          <div className="mobile-actions">
            {user ? (
              <button className="mobile-btn sign-out" onClick={handleSignOut}>
                Sign Out
              </button>
            ) : (
              <Link 
                to="/join" 
                className="mobile-btn join-btn"
                onClick={() => setIsMenuOpen(false)}
              >
                Join Now
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Backdrop for mobile menu */}
      {isMenuOpen && (
        <div 
          className="menu-backdrop"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;