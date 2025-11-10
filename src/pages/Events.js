// pages/Events.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaCamera,
  FaTrophy,
  FaArrowRight,
  FaPlay,
  FaPause,
} from "react-icons/fa";
import "./Events.css";

const Events = () => {
  const [activeEvent, setActiveEvent] = useState("shutter-stories");
  const [isPlaying, setIsPlaying] = useState(true);
  const [timeLeft, setTimeLeft] = useState({});
  const navigate = useNavigate();

  // Calculate time until December 15, 2024
  const calculateTimeLeft = () => {
    const eventDate = new Date("November 15, 2025 11:00:00").getTime();
    const now = new Date().getTime();
    const difference = eventDate - now;

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Add this function to handle registration
  const handleRegisterClick = (eventId) => {
    if (eventId === "shutter-stories") {
      // Open registration form in a new tab or modal
      window.open("/register/shutter-stories", "_blank");
      // Or use navigate if you want same page
      // navigate('/register/shutter-stories');
    } else {
      navigate(`/events/${eventId}`);
    }
  };

  const signatureEvents = {
    "shutter-stories": {
      id: "shutter-stories",
      title: "Shutter Stories",
      subtitle: "National Photography Exhibition",
      status: "upcoming",
      chapter: "Chapter IV",
      date: " Photo Submission Started from November 15, 2025",
      // time: "9:00 AM - 8:00 PM",
      // location: "UIU Campus & National Museum",
      location: "Will be Announced SOON, Stay Tuned!",
      description:
        "A prestigious national-level photography exhibition that brings together photography enthusiasts from across the country. Featuring both single photographs and compelling photo stories that narrate powerful visual tales.",
      fullDescription: `
        Shutter Stories Chapter IV is our flagship national photography exhibition that celebrates the art of visual storytelling. This year, we're taking it to new heights with expanded categories, prestigious jury members, and exciting prizes.

        ## Event Highlights:
        - **National-level participation** from photography enthusiasts
        - **Photo Story Competition** with cash prizes
        - **Single Photo Categories**: Portrait, Landscape, Street, Wildlife
        - **Expert Jury Panel** featuring renowned photographers
        - **Exhibition at National Museum** for top entries
        - **Workshops & Seminars** by industry professionals

        ## Categories:
        1. **Single Photo**
           Open Theme

        2. **Photo Story** (3-5 images)
           Open Theme

        ## Prizes:
        - **Grand Prize**: 50,000 BDT + Crest + Certificates + Gift Packs

        Don't miss this opportunity to showcase your talent on a national platform!
      `,
      // registrationLink: "https://forms.gle/your-registration-link",
      entryFee: "Initially Free entry",
      submissionDeadline: "December 20, 2025",
      highlights: [
        "National-level participation",
        "Photo story competitions",
        "Expert jury panel",
        "Cash prizes & awards",
        "Exhibition at National Museum",
        "Professional workshops",
      ],
      stats: {
        participants: "500+",
        photos: "2000+",
        chapters: "3",
        awards: "50+",
      },
      image: "https://res.cloudinary.com/do0e8p5d2/image/upload/v1762799836/Blog5_lbkrue.png",
      gallery: [
        "https://res.cloudinary.com/do0e8p5d2/image/upload/v1762114875/ss2_lmeeau.jpg",
        "https://res.cloudinary.com/do0e8p5d2/image/upload/v1762114876/ss3_cn8xru.jpg",
        "/api/placeholder/400/300",
      ],
    },
    muthography: {
      id: "muthography",
      title: "মুঠোgraphy",
      subtitle: "Intra-University Mobile Photography",
      status: "completed",
      chapter: "Chapter 3 Completed",
      date: "March 20-22, 2022",
      location: "UIU Permanent Campus",
      description:
        "An exclusive intra-university mobile photography exhibition celebrating the art of smartphone photography. Three successful chapters completed with overwhelming participation from UIU students.",
      highlights: [
        "Mobile photography only",
        "UIU students exclusive",
        "Three successful chapters",
        "Creative theme-based competitions",
      ],
      stats: {
        participants: "300+",
        photos: "800+",
        chapters: "3",
        awards: "30+",
      },
      image:
        "https://res.cloudinary.com/do0e8p5d2/image/upload/v1762113860/muthography2_rvnrai.jpg",
      gallery: [
        "/api/placeholder/400/300",
        "https://res.cloudinary.com/do0e8p5d2/image/upload/v1762113860/muthography2_rvnrai.jpg",
        "https://res.cloudinary.com/do0e8p5d2/image/upload/v1762114587/muthography3_tri0zz.jpg",
      ],
    },
    "photo-carnival": {
      id: "photo-carnival",
      title: "Photo Carnival",
      subtitle: "Intra-University Photography Festival",
      status: "completed",
      chapter: "3 Phase Completed",
      date: "August 26, 2023",
      location: "UIU Permanent Campus",
      description:
        "A vibrant intra-university photography festival welcoming both mobile and camera photography. A celebration of visual storytelling through diverse photographic mediums.",
      highlights: [
        "Mobile & Camera photography",
        "Multiple categories",
        "Workshops & seminars",
        "Live photography contests",
      ],
      stats: {
        participants: "400+",
        photos: "1200+",
        chapters: "Annual",
        awards: "40+",
      },
      image:
        "https://res.cloudinary.com/do0e8p5d2/image/upload/v1762114645/Carnival23_wqmjw6.jpg",
      gallery: [
        "https://res.cloudinary.com/do0e8p5d2/image/upload/v1762114645/Carnival01_frfe4k.jpg",
        "https://res.cloudinary.com/do0e8p5d2/image/upload/v1762114645/Carnival22_firfhw.jpg",
        "https://res.cloudinary.com/do0e8p5d2/image/upload/v1762114645/Carnival23_wqmjw6.jpg",
      ],
    },
    "friday-exposures": {
      id: "friday-exposures",
      title: "Friday Exposures",
      subtitle: "Year-Round Photography Exhibition",
      status: "ongoing",
      chapter: "Weekly Selections",
      date: "Every Friday",
      location: "UIU Photography Club Gallery",
      description:
        "A continuous exhibition showcasing the 52 best photographs selected throughout the year. Each week features new selections from our talented club members.",
      highlights: [
        "52 selected photos annually",
        "Weekly new selections",
        "Member exclusive",
        "Year-round exhibition",
      ],
      stats: {
        participants: "Club Members",
        photos: "52 selected",
        frequency: "Weekly",
        duration: "Year-round",
      },
      image:
        "https://res.cloudinary.com/do0e8p5d2/image/upload/v1762114757/FE01_sav4cs.jpg",
      gallery: [
        "https://res.cloudinary.com/do0e8p5d2/image/upload/v1762114757/FE01_sav4cs.jpg",
        "/api/placeholder/400/300",
        "/api/placeholder/400/300",
      ],
    },
  };

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        const events = Object.keys(signatureEvents);
        const currentIndex = events.indexOf(activeEvent);
        const nextIndex = (currentIndex + 1) % events.length;
        setActiveEvent(events[nextIndex]);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [activeEvent, isPlaying]);

  const currentEvent = signatureEvents[activeEvent];

  // const handleRegisterClick = (eventId) => {
  //   navigate(`/events/${eventId}`);
  // };
  /* 
  const handleViewDetails = (eventId) => {
    navigate(`/events/${eventId}`);
  }; */

  return (
    <div className="events-page">
      {/* Grand Header */}
      <section className="events-hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
          <div className="floating-elements">
            <div className="floating-camera"></div>
            <div className="floating-lens"></div>
            <div className="floating-aperture"></div>
          </div>
        </div>
        <div className="hero-content">
          <div className="container">
            <div className="hero-text">
              <h1 className="hero-title">
                <span className="title-line">UIU Photography Club</span>
                <span className="title-line highlight">Signature Events</span>
              </h1>
              <p className="hero-subtitle">
                Experience the pinnacle of photographic excellence through our
                signature events that celebrate creativity, talent, and visual
                storytelling
              </p>
              <div className="hero-stats">
                {/* <div className="stat">
                  <span className="stat-number">10+</span>
                  <span className="stat-label">Events</span>
                </div>
                <div className="stat">
                  <span className="stat-number">2000+</span>
                  <span className="stat-label">Participants</span>
                </div> */}
                <div className="stat">
                  <span className="stat-number">50K+</span>
                  <span className="stat-label">Prize Pools</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-scroll-indicator">
          <div className="scroll-arrow"></div>
        </div>
      </section>

      {/* Upcoming Event Banner */}
      <section className="upcoming-banner">
        <div className="container">
          <div className="banner-content">
            <div className="banner-badge">
              <span className="badge-text">Upcoming Event</span>
              <div className="badge-pulse"></div>
            </div>
            <h2 className="banner-title">Shutter Stories</h2>
            <h2 className="banner-title">Chapter clearInterval</h2>
            <p className="banner-subtitle">
              National Photography Exhibition • November 15, 2025
            </p>

            {/* Working Countdown Timer */}
            <div className="banner-countdown">
              <div className="countdown-item">
                <span className="countdown-number">
                  {String(timeLeft.days).padStart(2, "0")}
                </span>
                <span className="countdown-label">Days</span>
              </div>
              <div className="countdown-item">
                <span className="countdown-number">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="countdown-label">Hours</span>
              </div>
              <div className="countdown-item">
                <span className="countdown-number">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="countdown-label">Minutes</span>
              </div>
              <div className="countdown-item">
                <span className="countdown-number">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
                <span className="countdown-label">Seconds</span>
              </div>
            </div>

            <div className="banner-actions">
              <button
                className="btn-primary banner-btn"
                onClick={() => handleRegisterClick("shutter-stories")}
              >
                Submit Now <FaArrowRight />
              </button>
              {/* <button
                className="btn-secondary banner-btn"
                onClick={() => handleViewDetails("shutter-stories")}
              >
                View Details
              </button> */}
            </div>
          </div>
          <div className="banner-visual">
            <div className="visual-glow"></div>
            <div className="visual-frame">
              <img src="https://res.cloudinary.com/do0e8p5d2/image/upload/v1762799836/Blog5_lbkrue.png" alt="Shutter Stories" />
            </div>
          </div>
        </div>
      </section>

      {/* Signature Events Section */}
      <section className="signature-events">
        <div className="container">
          <div className="section-header">
            <h2>Signature Events</h2>
            <p>
              Discover our premier photography events that define excellence
            </p>
            <div className="header-decoration">
              <div className="decoration-line"></div>
              <FaCamera className="decoration-icon" />
              <div className="decoration-line"></div>
            </div>
          </div>

          {/* Event Navigation */}
          <div className="events-navigation">
            <div className="nav-controls">
              {Object.values(signatureEvents).map((event) => (
                <button
                  key={event.id}
                  className={`nav-item ${
                    activeEvent === event.id ? "active" : ""
                  }`}
                  onClick={() => setActiveEvent(event.id)}
                >
                  <span className="nav-icon">
                    {event.id === "shutter-stories"
                      ? "🎭"
                      : event.id === "muthography"
                      ? "📱"
                      : event.id === "photo-carnival"
                      ? "🎪"
                      : "📸"}
                  </span>
                  <span className="nav-text">{event.title}</span>
                </button>
              ))}
            </div>
            <button
              className="auto-play-btn"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
          </div>

          {/* Event Details - Updated with navigation */}
          <div className="event-details">
            <div className="event-hero">
              <div className="event-image">
                <img src={currentEvent.image} alt={currentEvent.title} />
                <div className="event-status">
                  <span className={`status-badge ${currentEvent.status}`}>
                    {currentEvent.status === "upcoming"
                      ? "Upcoming"
                      : currentEvent.status === "ongoing"
                      ? "Ongoing"
                      : "Completed"}
                  </span>
                </div>
              </div>

              <div className="event-content">
                <div className="event-header">
                  <h3 className="event-title">{currentEvent.title}</h3>
                  <p className="event-subtitle">{currentEvent.subtitle}</p>
                  <div className="event-chapter">{currentEvent.chapter}</div>
                </div>

                <div className="event-info">
                  <div className="info-item">
                    <FaCalendarAlt className="info-icon" />
                    <span>{currentEvent.date}</span>
                  </div>
                  {currentEvent.time && (
                    <div className="info-item">
                      <FaCalendarAlt className="info-icon" />
                      <span>{currentEvent.time}</span>
                    </div>
                  )}
                  <div className="info-item">
                    <FaMapMarkerAlt className="info-icon" />
                    <span>{currentEvent.location}</span>
                  </div>
                  <div className="info-item">
                    <FaUsers className="info-icon" />
                    <span>{currentEvent.stats.participants} Participants</span>
                  </div>
                </div>

                <p className="event-description">{currentEvent.description}</p>

                <div className="event-highlights">
                  <h4>Event Highlights</h4>
                  <div className="highlights-grid">
                    {currentEvent.highlights.map((highlight, index) => (
                      <div key={index} className="highlight-item">
                        <div className="highlight-bullet"></div>
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="event-stats">
                  {Object.entries(currentEvent.stats).map(([key, value]) => (
                    <div key={key} className="stat-card">
                      <span className="stat-value">{value}</span>
                      <span className="stat-name">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="event-actions">
                  {currentEvent.status === "upcoming" && (
                    <button
                      className="btn-primary"
                      onClick={() => handleRegisterClick(currentEvent.id)}
                    >
                      Submit Now <FaArrowRight />
                    </button>
                  )}
                  {/*  <button
                    className="btn-secondary"
                    onClick={() => handleViewDetails(currentEvent.id)}
                  >
                    View Details
                  </button> */}
                  {currentEvent.registrationLink && (
                    <button className="btn-secondary">Download Brochure</button>
                  )}
                </div>
              </div>
            </div>

            {/* Event Gallery Preview */}
            <div className="event-gallery">
              <h4>Gallery Preview</h4>
              <div className="gallery-grid">
                {currentEvent.gallery.map((image, index) => (
                  <div key={index} className="gallery-item">
                    <img
                      src={image}
                      alt={`${currentEvent.title} ${index + 1}`}
                    />
                    <div className="gallery-overlay">
                      <span>View</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Timeline */}
      <section className="events-timeline">
        <div className="container">
          <div className="section-header">
            <h2>Event Timeline</h2>
            <p>Our journey through remarkable photographic events</p>
          </div>
          <div className="timeline">
            {Object.values(signatureEvents).map((event, index) => (
              <div key={event.id} className={`timeline-item ${event.status}`}>
                <div className="timeline-marker">
                  <div className="marker-dot"></div>
                  <div className="marker-line"></div>
                </div>
                <div className="timeline-content">
                  <div className="timeline-header">
                    <h3>{event.title}</h3>
                    <span className="timeline-date">{event.date}</span>
                  </div>
                  <p className="timeline-description">{event.description}</p>
                  <div className="timeline-stats">
                    <span>{event.stats.participants}</span>
                    <span>{event.stats.photos}</span>
                    <span>{event.chapter}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="events-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Capture Moments With Us?</h2>
            <p>
              Join our next event and showcase your photography talent to the
              world
            </p>
            <div className="cta-actions">
              <button className="btn-primary cta-btn">View All Events</button>
              <button className="btn-secondary cta-btn">Become a Member</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Events;
