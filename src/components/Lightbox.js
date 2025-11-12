// components/Lightbox.js
import React from 'react';
import './Lightbox.css';

const Lightbox = ({ photo, onClose }) => {
  if (!photo) return null;

  const formatUploadDate = (uploadedAt) => {
    if (!uploadedAt) return 'Unknown date';
    
    try {
      const date = new Date(uploadedAt);
      return date.toLocaleDateString();
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose}>×</button>
        <div className="lightbox-image">
          <img src={photo.url} alt={photo.title} />
        </div>
        <div className="lightbox-info">
          <h3>{photo.title || 'Untitled'}</h3>
          {photo.description && (
            <p className="description">{photo.description}</p>
          )}
          <div className="photo-meta">
            <span className="upload-date">
              Uploaded: {formatUploadDate(photo.uploadedAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lightbox;