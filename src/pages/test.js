// pages/EventDetail.js
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaUsers, 
  FaMoneyBillWave,
  FaClock,
  FaArrowLeft,
  FaExternalLinkAlt,
  FaDownload,
  FaShare
} from 'react-icons/fa';
import './EventDetail.css';

const EventDetail = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  // Mock data - in real app, fetch from API
  const eventData = {
    'shutter-stories': {
      id: 'shutter-stories',
      title: 'Shutter Stories Chapter 4',
      subtitle: 'National Photography Exhibition',
      status: 'upcoming',
      chapter: 'Chapter 4',
      date: 'December 15-17, 2024',
      time: '9:00 AM - 8:00 PM',
      location: 'UIU Campus & National Museum, Dhaka',
      registrationLink: 'https://forms.gle/your-registration-link',
      entryFee: '₵500 per entry',
      submissionDeadline: 'December 5, 2024',
      announcementDate: 'December 20, 2024',
      description: 'A prestigious national-level photography exhibition that brings together photography enthusiasts from across the country.',
      fullDescription: `
        # Shutter Stories Chapter 4
        ## National Photography Exhibition
        
        Welcome to the most anticipated photography event of the year! Shutter Stories Chapter 4 continues our legacy of celebrating visual storytelling through the lens. This national-level exhibition brings together amateur and professional photographers from across Bangladesh.

        ## 🎯 Event Overview
        Shutter Stories is more than just a competition; it's a platform for photographers to share their unique perspectives, tell compelling stories, and connect with like-minded individuals. This year, we're expanding our reach with new categories and exciting opportunities.

        ## 📸 Competition Categories

        ### Single Photo Categories:
        1. **Portrait & People** - Capturing human emotions and relationships
        2. **Landscape & Nature** - Showcasing the beauty of our natural world
        3. **Street Photography** - Life and moments in public spaces
        4. **Wildlife & Animals** - Wildlife in natural habitats
        5. **Abstract & Creative** - Experimental and artistic expressions
        6. **Architectural** - Buildings and structural designs

        ### Photo Story Category (3-5 images):
        - **Documentary** - Real-life events and social issues
        - **Personal Narrative** - Your personal stories and experiences
        - **Conceptual Series** - Themed series with a clear concept

        ## 🏆 Prizes & Recognition

        ### Grand Prizes:
        - **1st Place**: ₵50,000 + Trophy + Featured Exhibition
        - **2nd Place**: ₵30,000 + Trophy
        - **3rd Place**: ₵20,000 + Trophy

        ### Category Winners:
        - Each category winner: ₵15,000 + Medal
        - Special mentions in each category

        ### Additional Awards:
        - **People's Choice Award**: ₵10,000 (Online voting)
        - **Best Student Photographer**: ₵8,000
        - **Emerging Talent Award**: ₵8,000

        ## 👥 Jury Panel
        Our esteemed jury includes:
        - **Dr. Ahmed Hassan** - Renowned photojournalist
        - **Ms. Fatima Begum** - Award-winning portrait photographer
        - **Mr. Rajib Chowdhury** - Landscape photography expert
        - **Ms. Nusrat Jahan** - Fine art photography specialist

        ## 📝 Submission Guidelines
        1. **Format**: JPEG/PNG, minimum 2000px on longer side
        2. **Size**: Maximum 10MB per image
        3. **Editing**: Basic edits allowed, no heavy manipulation
        4. **Metadata**: Must contain camera and shooting details
        5. **Originality**: Must be your own work

        ## ⏰ Important Dates
        - **Registration Opens**: November 1, 2024
        - **Submission Deadline**: December 5, 2024
        - **Jury Review**: December 6-12, 2024
        - **Exhibition**: December 15-17, 2024
        - **Award Ceremony**: December 17, 2024

        ## 💰 Registration Fees
        - **Single Category**: ₵500
        - **Additional Categories**: ₵300 each
        - **Photo Story**: ₵800
        - **Student Discount**: 20% off (Valid ID required)

        ## 🎪 Event Schedule

        ### Day 1 - December 15, 2024
        - 9:00 AM: Exhibition Opening
        - 11:00 AM: Workshop - "The Art of Visual Storytelling"
        - 2:00 PM: Seminar - "Modern Photography Techniques"
        - 4:00 PM: Portfolio Review Session

        ### Day 2 - December 16, 2024
        - 10:00 AM: Street Photography Walk
        - 1:00 PM: Panel Discussion - "Future of Photography"
        - 3:00 PM: Technical Workshop - "Lighting & Composition"

        ### Day 3 - December 17, 2024
        - 10:00 AM: Final Exhibition Viewing
        - 3:00 PM: Award Ceremony
        - 6:00 PM: Gala Dinner & Networking

        ## 📍 Venue Details
        **Main Exhibition**: UIU Campus Auditorium
        **Award Ceremony**: National Museum Auditorium
        **Workshops**: UIU Photography Club Studio

        ## 🤝 Sponsors & Partners
        - Platinum Sponsor: Canon Bangladesh
        - Gold Sponsor: Nikon
        - Media Partner: The Daily Star
        - Community Partner: Bangladesh Photographic Society

        Don't miss this incredible opportunity to showcase your talent, learn from experts, and connect with the photography community!
      `,
      highlights: [
        'National-level participation',
        'Expert jury panel from industry leaders',
        'Cash prizes totaling ₵200,000+',
        'Exhibition at prestigious venues',
        'Professional workshops and seminars',
        'Networking with photography community',
        'Media coverage in major publications',
        'Certificate of participation for all'
      ],
      gallery: [
        '/api/placeholder/600/400',
        '/api/placeholder/600/400', 
        '/api/placeholder/600/400',
        '/api/placeholder/600/400',
        '/api/placeholder/600/400',
        '/api/placeholder/600/400'
      ],
      contact: {
        email: 'shutterstories@uiupc.com',
        phone: '+880 1XXX-XXXXXX',
        coordinator: 'Ms. Anika Rahman'
      }
    },
    // Add similar detailed data for other events
  };

  const event = eventData[eventId];

  if (!event) {
    return (
      <div className="event-detail-page">
        <div className="container">
          <div className="event-not-found">
            <h2>Event Not Found</h2>
            <p>The event you're looking for doesn't exist.</p>
            <button onClick={() => navigate('/events')} className="btn-primary">
              Back to Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleRegister = () => {
    window.open(event.registrationLink, '_blank');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Event link copied to clipboard!');
    }
  };

  return (
    <div className="event-detail-page">
      {/* Navigation Header */}
      <header className="event-detail-header">
        <div className="container">
          <button onClick={() => navigate('/events')} className="back-button">
            <FaArrowLeft />
            Back to Events
          </button>
          <div className="header-actions">
            <button onClick={handleShare} className="share-button">
              <FaShare />
              Share
            </button>
            <button className="download-button">
              <FaDownload />
              Brochure
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="event-detail-hero">
        <div className="container">
          <div className="hero-content">
            <div className="event-badge">
              <span className={`status-badge ${event.status}`}>
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </span>
              <span className="chapter-badge">{event.chapter}</span>
            </div>
            <h1 className="event-title">{event.title}</h1>
            <p className="event-subtitle">{event.subtitle}</p>
            
            <div className="event-meta">
              <div className="meta-item">
                <FaCalendarAlt className="meta-icon" />
                <div>
                  <strong>Date</strong>
                  <span>{event.date}</span>
                </div>
              </div>
              <div className="meta-item">
                <FaClock className="meta-icon" />
                <div>
                  <strong>Time</strong>
                  <span>{event.time}</span>
                </div>
              </div>
              <div className="meta-item">
                <FaMapMarkerAlt className="meta-icon" />
                <div>
                  <strong>Venue</strong>
                  <span>{event.location}</span>
                </div>
              </div>
              <div className="meta-item">
                <FaMoneyBillWave className="meta-icon" />
                <div>
                  <strong>Entry Fee</strong>
                  <span>{event.entryFee}</span>
                </div>
              </div>
            </div>

            <div className="hero-actions">
              <button onClick={handleRegister} className="btn-primary register-btn">
                Register Now <FaExternalLinkAlt />
              </button>
              <button className="btn-secondary">
                Add to Calendar
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="event-detail-content">
        <div className="container">
          <div className="content-grid">
            {/* Main Content */}
            <div className="main-content">
              <div className="content-section">
                <h2>About the Event</h2>
                <div className="description-content">
                  {event.fullDescription.split('\n').map((paragraph, index) => {
                    if (paragraph.startsWith('# ')) {
                      return <h1 key={index}>{paragraph.replace('# ', '')}</h1>;
                    } else if (paragraph.startsWith('## ')) {
                      return <h2 key={index}>{paragraph.replace('## ', '')}</h2>;
                    } else if (paragraph.startsWith('### ')) {
                      return <h3 key={index}>{paragraph.replace('### ', '')}</h3>;
                    } else if (paragraph.trim() === '') {
                      return <br key={index} />;
                    } else {
                      return <p key={index}>{paragraph}</p>;
                    }
                  })}
                </div>
              </div>

              {/* Gallery Section */}
              <div className="content-section">
                <h2>Event Gallery</h2>
                <div className="detail-gallery">
                  {event.gallery.map((image, index) => (
                    <div key={index} className="gallery-item">
                      <img src={image} alt={`${event.title} ${index + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="sidebar">
              {/* Quick Info Card */}
              <div className="info-card">
                <h3>Quick Information</h3>
                <div className="info-list">
                  <div className="info-item">
                    <strong>Registration Deadline</strong>
                    <span>{event.submissionDeadline}</span>
                  </div>
                  <div className="info-item">
                    <strong>Announcement Date</strong>
                    <span>{event.announcementDate}</span>
                  </div>
                  <div className="info-item">
                    <strong>Entry Fee</strong>
                    <span>{event.entryFee}</span>
                  </div>
                  <div className="info-item">
                    <strong>Categories</strong>
                    <span>6 Single + Photo Story</span>
                  </div>
                </div>
              </div>

              {/* Highlights Card */}
              <div className="highlights-card">
                <h3>Event Highlights</h3>
                <ul className="highlights-list">
                  {event.highlights.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
              </div>

              {/* Contact Card */}
              <div className="contact-card">
                <h3>Contact Information</h3>
                <div className="contact-info">
                  <div className="contact-item">
                    <strong>Event Coordinator</strong>
                    <span>{event.contact.coordinator}</span>
                  </div>
                  <div className="contact-item">
                    <strong>Email</strong>
                    <a href={`mailto:${event.contact.email}`}>{event.contact.email}</a>
                  </div>
                  <div className="contact-item">
                    <strong>Phone</strong>
                    <a href={`tel:${event.contact.phone}`}>{event.contact.phone}</a>
                  </div>
                </div>
              </div>

              {/* CTA Card */}
              <div className="cta-card">
                <h3>Ready to Participate?</h3>
                <p>Don't miss this opportunity to showcase your talent!</p>
                <button onClick={handleRegister} className="btn-primary full-width">
                  Register Now <FaExternalLinkAlt />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventDetail;