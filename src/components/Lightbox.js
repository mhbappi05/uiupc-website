// components/Lightbox.js
import React from 'react';
import './Lightbox.css';

const Lightbox = ({ photo, onClose }) => {
  if (!photo) return null;

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose}>×</button>
        <div className="lightbox-image">
          <img src={photo.imageUrl} alt={photo.title} />
        </div>
        <div className="lightbox-info">
          <h3>{photo.title || 'Untitled'}</h3>
          <p className="photographer">By {photo.photographerName}</p>
          {photo.description && (
            <p className="description">{photo.description}</p>
          )}
          {photo.category && (
            <p className="category">Category: {photo.category}</p>
          )}
          <div className="photo-meta">
            <span className="upload-date">
              Uploaded: {new Date(photo.uploadedAt?.toDate()).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lightbox;