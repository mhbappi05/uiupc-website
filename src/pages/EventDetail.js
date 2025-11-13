// pages/EventDetail.js
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaClock,
  FaExternalLinkAlt,
} from "react-icons/fa";
import "./EventDetail.css";

const EventDetail = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  // Mock data - in real app, fetch from API
  const eventData = {
    "shutter-stories": {
      id: "shutter-stories",
      title: "Shutter Stories Chapter IV",
      subtitle: "National Photography Exhibition",
      status: "upcoming",
      chapter: "Chapter 4",
      date: "Nov 15 - Dec 15, 2025",
      time: "9:00 AM - 8:00 PM",
      //   location: 'UIU Campus & National Museum, Dhaka',
      location: "Will be Announced SOON, Stay Tuned!",
       registrationLink: "/register/shutter-stories",
      entryFee: "Initially Free , 1000BDT per Single Photos & 2000BDT per Photo Story after shortlisting",
      submissionDeadline: "December 15, 2025",
      announcementDate: "November 15, 2025",
      categories: ["Single Photo", "Photo Story"],
      description:
        "A prestigious national-level photography exhibition that brings together photography enthusiasts from across the country.",
      fullDescription: `
        # Shutter Stories Chapter IV
        ## National Photography Exhibition
        
        Welcome to the most anticipated photography event of the year! Shutter Stories Chapter IV continues our legacy of celebrating visual storytelling through the lens. This national-level exhibition brings together amateur and professional photographers from across Bangladesh.

        ## 🎯 Event Overview
        Shutter Stories is more than just a competition; it's a platform for photographers to share their unique perspectives, tell compelling stories, and connect with like-minded individuals. This year, we're expanding our reach with new categories and exciting opportunities.

        ## 📸 Competition Categories

        ### Single Photo Categories:
            Open Theme (Single Image)

        ### Photo Story Category (3-5 images):
            Open Theme (Photo Story)

        ## 🏆 Prizes & Recognition

        ### Grand Prizes: (Single Photo Category)
        - **Winner**: 15,000BDT + Crest + Certificates + Gift Packs
        - **1st Runner up**: 10,000BDT + Crest + Certificates + Gift Packs
        - **2nd Runner up**: 5000BDT + Crest + Certificates + Gift Packs
        - **Honorable Mention**: 5000BDT + Crest + Certificates + Gift Packs

        ### Grand Prizes: (Photo Story Category)
        - **Winner**: 15,000BDT + Crest + Certificates + Gift Packs

        - **For All Participantes**: Certificates + Gift Packs

        ## 👥 Jury Panel
        Our esteemed jury includes:
        - Will be Announced SOON, Stay Tuned!

        ## 📝 Submission Guidelines
        1. **Format**: JPEG/PNG, minimum 2000px on longer side
        2. **Size**: Maximum 10MB per image
        3. **Editing**: Basic edits allowed, no heavy manipulation
        4. **Metadata**: Must contain camera and shooting details
        5. **Originality**: Must be your own work

        ## ⏰ Important Dates
        - **Registration Opens**: November 15, 2025
        - **Submission Deadline**: December 15, 2025
        - **Jury Review**: December 6-12, 2025
        - **Exhibition**: January 10-25, 2026
        - **Award Ceremony**: January , 2026

        ## 💰 Registration Fees
        - **Single Category**: 1000BDT each
        - **Photo Story**: 2000BDT each

        ## 🎪 Event Schedule

        Will be Announced SOON, Stay Tuned!

        ## 📍 Venue Details
        
        Will be Announced SOON, Stay Tuned!

        ## 🤝 Sponsors & Partners
        - Tittle Sponsor: United Medical

        Don't miss this incredible opportunity to showcase your talent, learn from experts, and connect with the photography community!
      `,
      highlights: [
        "National-level participation",
        "Expert jury panel from industry leaders",
        "Cash prizes totaling 50K BDT",
        "Exhibition at prestigious venues",
        "Professional workshops and seminars",
        "Networking with photography community",
        "Media coverage in major publications",
        "Certificate of participation for all",
      ],
      gallery: [
        "/api/placeholder/600/400",
        "/api/placeholder/600/400",
        "/api/placeholder/600/400",
        "/api/placeholder/600/400",
        "/api/placeholder/600/400",
        "/api/placeholder/600/400",
      ],
      contact: {
        email: "photographyclub@dccsa.uiu.ac.bd",
        phone: "+8801614886101",
        Head_of_PR: "Abdul Mohsen Rubay",
      },
    },
    "Member-Recruitemet": {
      id: "Member-Recruitemet",
      title: "Member Recruitment 2025",
      subtitle: "Join the UIU Photography Club",
      status: "ongoing",
      chapter: "Fall'25",
      date: "Nov 15-16 , 2025",
      time: "9:00 AM - 4:00 PM",
      location: "UIU Gallery, 1st Floor",
      registrationLink: "/join",
      entryFee: "500BDT",
      submissionDeadline: "November 16, 2025",
      announcementDate: "November 15, 2025",
      description: "Join the vibrant community of photography enthusiasts at UIU Photography Club.",
      fullDescription: `
        # Member Recruitment 2025
        ## Join the UIU Photography Club
        Are you passionate about photography? Do you want to enhance your skills, participate in exciting events, and connect with fellow photography enthusiasts? The UIU Photography Club is thrilled to announce our Member Recruitment for the year 2024!

        ## 🎯 Why Join Us?
        By becoming a member of the UIU Photography Club, you'll gain access to:
        - Exclusive workshops and training sessions
        - Opportunities to showcase your work in exhibitions
        - Networking events with industry professionals
        - Collaborative projects and photo walks
        - A supportive community to share your passion
        ## 📝 How to Apply
        1. Fill out the online application form.
        2. Pay the membership fee of 500BDT.
        ## ⏰ Important Dates
        - **Application Deadline**: November 16, 2025
        ## 🤝 Contact Us
        For more information, reach out to us at:
        - Email: photographyclub@dccsa.uiu.ac.bd
        - Phone: +8801783503006
        Don't miss this opportunity to be part of a dynamic and creative community. We look forward to welcoming you to the UIU Photography Club!
      `,

      highlights: [
        "Exclusive workshops and training sessions",
        "Opportunities to showcase your work in exhibitions",
        "Networking events with industry professionals",
        "Collaborative projects and photo walks",
        "Supportive community to share your passion",
      ],
      gallery: [
        "/api/placeholder/600/400",
      ],
      contact: {
        email: "photographyclub@dccsa.uiu.ac.bd",
        phone: "+8801783503006",
        coordinator: "Md Zobayer Ahmed",
      },
      registrationLink: "/join",
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
            <button onClick={() => navigate("/events")} className="btn-primary">
              Back to Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleRegister = () => {
    window.open(event.registrationLink, "_blank");
  };

  /* const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Event link copied to clipboard!");
    }
  }; */

  return (
    <div className="event-detail-page">
      {/* Navigation Header */}
      {/* <header className="event-detail-header">
        <div className="container">
          <button onClick={() => navigate("/events")} className="back-button">
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
      </header> */}

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
                  <strong>Submission Dates</strong>
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
              <button
                onClick={handleRegister}
                className="btn-primary register-btn"
              >
                Register Now <FaExternalLinkAlt />
              </button>
              {/* <button className="btn-secondary">Add to Calendar</button> */}
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
                  {event.fullDescription.split("\n").map((paragraph, index) => {
                    if (paragraph.startsWith("# ")) {
                      return <h1 key={index}>{paragraph.replace("# ", "")}</h1>;
                    } else if (paragraph.startsWith("## ")) {
                      return (
                        <h2 key={index}>{paragraph.replace("## ", "")}</h2>
                      );
                    } else if (paragraph.startsWith("### ")) {
                      return (
                        <h3 key={index}>{paragraph.replace("### ", "")}</h3>
                      );
                    } else if (paragraph.trim() === "") {
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
                    <span>{event.categories}</span>
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
                    <strong>Head of PR</strong>
                    <span>{event.contact.coordinator}</span>
                  
                    <strong>Email</strong>
                    <a href={`mailto:${event.contact.email}`}>
                      {event.contact.email}
                    </a>
                  
                    <strong>Phone</strong>
                    <a href={`tel:${event.contact.phone}`}>
                      {event.contact.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* CTA Card */}
              <div className="cta-card">
                <h3>Ready to Participate?</h3>
                <p>Don't miss this opportunity to showcase your talent!</p>
                <button
                  onClick={handleRegister}
                  className="btn-primary full-width"
                >
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
