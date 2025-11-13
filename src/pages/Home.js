// pages/Home.js 
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroSlider from '../components/HeroSlider';
import PhotoShowcase from '../components/PhotoShowcase';
import UpcomingEvents from '../components/UpcomingEvents';
import Stats from '../components/Stats';
import './Home.css';

const Home = ({ featuredPhotos }) => {
  const introRef = useRef(null);
  const ctaRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch upcoming events data
  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        setLoading(true);
        
        // Mock data - in real app, this would be an API call
        const mockEvents = [
          {
            id: "shutter-stories",
            title: "Shutter Stories Chapter IV",
            subtitle: "National Photography Exhibition",
            status: "upcoming",
            chapter: "Chapter IV",
            date: "Nov 15 - Dec 20, 2025",
            time: "9:00 AM - 8:00 PM",
            location: "Will be Announced SOON, Stay Tuned!",
            // registrationLink: "https://forms.gle/your-registration-link",
            entryFee: "Initially Free, 1000BDT per Single Photos & 2000BDT per Photo Story after shortlisting",
            submissionDeadline: "December 20, 2025",
            announcementDate: "December 20, 2025",
            description: "A prestigious national-level photography exhibition that brings together photography enthusiasts from across the country.",
          },
         {
            id: "Member-Recruitemet",
            title: "Member Recruitment Fall 2025",
            subtitle: "Join with Us!",
            status: "upcoming",
            chapter: "Fall'25",
            date: "November 15, November 19 2025",
            time: "8:30 PM - 4:00 PM",
            location: "UIU Campus, Dhaka",
            registrationLink: "/join",
            entryFee: "1st Phase : Interview & Selected Members 500BDT",
            description: "If any enquiry please contact us via Facebook or Instagram. or you come to the club room #Basement Table 03 ",
          },
          /*{
            id: "photo-editing-masterclass",
            title: "Photo Editing Masterclass",
            subtitle: "Adobe Lightroom & Photoshop",
            status: "upcoming",
            chapter: "Skill Development",
            date: "February 5, 2025",
            time: "10:00 AM - 4:00 PM",
            location: "UIU Computer Lab",
            registrationLink: "#",
            entryFee: "500 BDT",
            submissionDeadline: "February 1, 2025",
            description: "Comprehensive photo editing workshop covering advanced techniques.",
            image: "/api/placeholder/600/400",
            highlights: [
              "Professional editing techniques",
              "Color grading mastery",
              "Workflow optimization",
              "Before & after analysis"
            ],
            stats: {
              participants: "25",
              duration: "6 hours",
              software: "Lightroom & Photoshop"
            }
          } */
        ];

        // Simulate API delay
        setTimeout(() => {
          setEvents(mockEvents);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching events:', error);
        setLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, []);

  useEffect(() => {
    const currentIntroRef = introRef.current;
    const currentCtaRef = ctaRef.current;

    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          // Add staggered animation for child elements
          if (entry.target.querySelector('.intro-actions')) {
            const buttons = entry.target.querySelectorAll('.btn-primary, .btn-secondary');
            buttons.forEach((button, index) => {
              button.style.animationDelay = `${index * 0.2}s`;
            });
          }
        }
      });
    }, observerOptions);

    if (currentIntroRef) observer.observe(currentIntroRef);
    if (currentCtaRef) observer.observe(currentCtaRef);

    return () => {
      if (currentIntroRef) observer.observe(currentIntroRef);
    if (currentCtaRef) observer.observe(currentCtaRef);
    };
  }, []);

  // Floating background elements
  const FloatingBackground = () => (
    <div className="floating-elements">
      <div className="floating-element"></div>
      <div className="floating-element"></div>
      <div className="floating-element"></div>
      <div className="floating-camera"></div>
      <div className="floating-lens"></div>
      <div className="floating-aperture"></div>
    </div>
  );

  return (
    <div className="home-page">
      <FloatingBackground />
      <HeroSlider />
      
      <section className="intro-section" ref={introRef}>
        <div className="container">
          <div className="intro-content glass-card">
            <h2 className="gradient-text">Welcome to UIU Photography Club</h2>
            <p className="tagline pulse-animation">Capturing Moments, Creating Memories</p>
            <p className="description">
              We are a community of passionate photographers at United International University 
              dedicated to exploring the art of photography, sharing knowledge, and capturing 
              the beautiful moments of campus life and beyond.
            </p>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <Stats />
      </section>
      
      <section className="photo-showcase-section">
        <PhotoShowcase photos={featuredPhotos} />
      </section>
      
      <section className="events-section">
        <div className="container">
          <div className="section-header">
            <h2>Upcoming Events</h2>
            <p>Don't miss these exciting photography events and workshops</p>
            <div className="header-decoration">
              <div className="decoration-line"></div>
              <div className="decoration-icon">📸</div>
              <div className="decoration-line"></div>
            </div>
          </div>
          {loading ? (
            <div className="loading-events">
              <div className="loading-spinner"></div>
              <p>Loading upcoming events...</p>
            </div>
          ) : (
            <UpcomingEvents events={events} />
          )}
          <div className="events-cta">
            <Link to="/events" className="btn-secondary">
              View All Events
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>
      
      <section className="cta-section" ref={ctaRef}>
        <div className="container">
          <div className="cta-content glass-card">
            <h2 className="gradient-text">Ready to Capture with Us?</h2>
            <p>Join our community of photographers and start your creative journey today.</p>
            <Link to="/join" className="btn-primary glow-effect">
              <span>Become a Member</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20 8V14M23 11H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;