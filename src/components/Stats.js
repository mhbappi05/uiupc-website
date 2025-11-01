// components/Stats.js
import React from 'react';
import './Stats.css';

const Stats = () => {
  const stats = [
    { number: '50+', label: 'Active Members' },
    { number: '1000+', label: 'Photos Captured' },
    { number: '25+', label: 'Events Organized' },
    { number: '15+', label: 'Awards Won' }
  ];

  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;