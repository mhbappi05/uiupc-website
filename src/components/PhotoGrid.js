// components/PhotoGrid.js - Responsive grid for photos
import React from 'react';
import './PhotoGrid.css';

const PhotoGrid = ({ photos, onPhotoClick }) => {
  if (photos.length === 0) {
    return (
      <div className="no-photos">
        <p>No photos found. Check back later!</p>
      </div>
    );
  }

  return (
    <div className="photo-grid">
      {photos.map(photo => (
        <div 
          key={photo.id} 
          className="photo-item"
          onClick={() => onPhotoClick(photo)}
        >
          <img src={photo.imageUrl} alt={photo.title || 'Photography Club Photo'} />
          <div className="photo-overlay">
            <div className="photo-info">
              <h3>{photo.title || 'Untitled'}</h3>
              <p>By {photo.photographerName}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PhotoGrid;