// components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <span className="logo-icon">📷</span>
              <span>UIU Photography Club</span>
            </div>
            <p>Capturing Moments, Creating Memories at United International University</p>
            <div className="social-links">
              <a href="https://facebook.com/UIUPC" target="_blank" rel="noopener noreferrer">
                <span className="social-icon">📘</span>
              </a>
              <a href="https://instagram.com/uiuphotography" target="_blank" rel="noopener noreferrer">
                <span className="social-icon">📷</span>
              </a>
              <a href="https://twitter.com/uiuphotography" target="_blank" rel="noopener noreferrer">
                <span className="social-icon">🐦</span>
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/gallery">Gallery</Link></li>
              <li><Link to="/events">Events</Link></li>
              <li><Link to="/members">Members</Link></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Get Involved</h3>
            <ul>
              <li><Link to="/join">Join the Club</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><a href="#volunteer">Volunteer</a></li>
              <li><a href="#sponsor">Sponsor Us</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Contact Info</h3>
            <div className="contact-info">
              <p>📧 photography@uiu.ac.bd</p>
              <p>📞 +880 XXXX-XXXXXX</p>
              <p>📍 United International University</p>
              <p>Madani Avenue, Dhaka 1212</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} UIU Photography Club. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;