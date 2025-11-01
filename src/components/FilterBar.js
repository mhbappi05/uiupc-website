// components/FilterBar.js
import React from 'react';
import './FilterBar.css';

const FilterBar = ({ categories, events, activeFilter, filterType, onFilterChange }) => {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <h3>Filter by:</h3>
        <div className="filter-options">
          <button 
            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => onFilterChange('all', 'category')}
          >
            All Photos
          </button>
          
          <div className="filter-dropdown">
            <span>Categories:</span>
            <select 
              value={filterType === 'category' ? activeFilter : 'all'}
              onChange={(e) => onFilterChange(e.target.value, 'category')}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-dropdown">
            <span>Events:</span>
            <select 
              value={filterType === 'event' ? activeFilter : 'all'}
              onChange={(e) => onFilterChange(e.target.value, 'event')}
            >
              <option value="all">All Events</option>
              {events.map(event => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;