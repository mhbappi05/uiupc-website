// components/UpcomingEvents.js
import React from 'react';
import { Link } from 'react-router-dom';
import './UpcomingEvents.css';

const UpcomingEvents = ({ events }) => {
  const upcomingEvents = events.slice(0, 3);

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <section className="events-section">
      <div className="container">
        <div className="section-header">
          <h2>Upcoming Events</h2>
          <p>Join us for our next photography adventures</p>
        </div>
        
        <div className="events-grid">
          {upcomingEvents.map(event => (
            <div key={event.id} className="event-card">
              <div className="event-image">
                <img src={event.imageUrl || '/default-event.jpg'} alt={event.title} />
              </div>
              <div className="event-content">
                <h3>{event.title}</h3>
                <div className="event-meta">
                  <span className="event-date">📅 {formatDate(event.date)}</span>
                  <span className="event-location">📍 {event.location}</span>
                </div>
                <p className="event-description">
                  {event.description?.substring(0, 100)}...
                </p>
                <div className="event-actions">
                  <Link to={`/events/${event.id}`} className="btn-primary">Learn More</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {upcomingEvents.length === 0 && (
          <div className="no-events">
            <p>No upcoming events scheduled. Check back later!</p>
          </div>
        )}
        
        <div className="events-actions">
          <Link to="/events" className="btn-secondary">View All Events</Link>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;