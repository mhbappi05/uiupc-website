// pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import HeroSlider from '../components/HeroSlider';
import PhotoShowcase from '../components/PhotoShowcase';
import UpcomingEvents from '../components/UpcomingEvents';
import Stats from '../components/Stats';
import './Home.css';

const Home = ({ featuredPhotos, events }) => {
  return (
    <div className="home-page">
      <HeroSlider />
      
      <section className="intro-section">
        <div className="container">
          <div className="intro-content">
            <h2>Welcome to UIU Photography Club</h2>
            <p className="tagline">Capturing Moments, Creating Memories</p>
            <p className="description">
              We are a community of passionate photographers at United International University 
              dedicated to exploring the art of photography, sharing knowledge, and capturing 
              the beautiful moments of campus life and beyond.
            </p>
            <div className="intro-actions">
              <Link to="/join" className="btn-primary">Join Our Club</Link>
              <Link to="/gallery" className="btn-secondary">View Our Work</Link>
            </div>
          </div>
        </div>
      </section>

      <Stats />
      
      <PhotoShowcase photos={featuredPhotos} />
      
      <UpcomingEvents events={events} />
      
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Capture with Us?</h2>
            <p>Join our community of photographers and start your creative journey today.</p>
            <Link to="/join" className="btn-primary">Become a Member</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;