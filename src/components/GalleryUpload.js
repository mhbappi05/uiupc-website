// components/GalleryUpload.js
import React, { useState, useEffect } from "react";
import { FaPlus, FaUpload, FaSync, FaTimes, FaImages, FaCalendar, FaUser, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import Loading from "./Loading";
import "./GalleryUpload.css";

const GalleryUpload = ({ user, scripts, onUploadSuccess }) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPhoto, setEditingPhoto] = useState(null);
  
  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    eventId: "",
    facebookPost: "",
    imageUrl: "",
  });

  // Fetch gallery photos
  const fetchGalleryPhotos = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching gallery photos...");

      // Use the correct action name "getGallery"
      const response = await fetch(`${scripts.gallery}?action=getGallery`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Gallery photos response:", result);

      if (result.status === "success") {
        const photos = result.data || [];
        const sortedPhotos = photos.sort(
          (a, b) => new Date(b.uploadedAt || b.timestamp) - new Date(a.uploadedAt || a.timestamp)
        );
        setGalleryPhotos(sortedPhotos);
      } else {
        throw new Error(result.message || "Failed to fetch gallery photos");
      }
    } catch (error) {
      console.error("Error fetching gallery photos:", error);
      setError("Unable to load gallery photos: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryPhotos();
  }, []);

  const handleImageUrlChange = (url) => {
    setUploadForm({ ...uploadForm, imageUrl: url });
    setImagePreview(url);
  };

  const handleGalleryUpload = async (e) => {
    e.preventDefault();

    try {
      setUploading(true);

      // Validate required fields
      if (!uploadForm.title || !uploadForm.imageUrl || !uploadForm.eventId) {
        alert("Please fill in all required fields: Title, Image URL, and Event");
        return;
      }

      const submissionData = {
        action: editingPhoto ? "updateGallery" : "addToGallery",
        title: uploadForm.title,
        description: uploadForm.description,
        eventId: uploadForm.eventId,
        facebookPost: uploadForm.facebookPost,
        imageUrl: uploadForm.imageUrl,
        uploadedBy: user.email,
        timestamp: new Date().toISOString(),
      };

      if (editingPhoto) {
        submissionData.photoId = editingPhoto.id;
      }

      const response = await fetch(scripts.gallery, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(submissionData),
      });

      const result = await response.json();

      if (result.status === "success") {
        alert(`Photo ${editingPhoto ? "updated" : "added"} successfully!`);
        setShowUploadModal(false);
        resetForm();
        fetchGalleryPhotos();
        
        if (onUploadSuccess) {
          onUploadSuccess();
        }
      } else {
        throw new Error(result.message || `Failed to ${editingPhoto ? "update" : "upload"} to gallery`);
      }
    } catch (error) {
      console.error("Error uploading to gallery:", error);
      alert(`Failed to ${editingPhoto ? "update" : "upload"} to gallery: ` + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (photo) => {
    setEditingPhoto(photo);
    setUploadForm({
      title: photo.title,
      description: photo.description,
      eventId: photo.eventId,
      facebookPost: photo.facebookPost,
      imageUrl: photo.url || photo.imageUrl,
    });
    setImagePreview(photo.url || photo.imageUrl);
    setShowUploadModal(true);
  };

  const handleDelete = async (photoId) => {
    if (!confirm("Are you sure you want to delete this photo? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(scripts.gallery, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          action: "deleteFromGallery",
          photoId: photoId,
          deletedBy: user.email,
        }),
      });

      const result = await response.json();

      if (result.status === "success") {
        alert("Photo deleted successfully!");
        fetchGalleryPhotos();
      } else {
        throw new Error(result.message || "Failed to delete photo");
      }
    } catch (error) {
      console.error("Error deleting photo:", error);
      alert("Failed to delete photo: " + error.message);
    }
  };

  const resetForm = () => {
    setUploadForm({
      title: "",
      description: "",
      eventId: "",
      facebookPost: "",
      imageUrl: "",
    });
    setImagePreview("");
    setEditingPhoto(null);
  };

  const handleNewPhoto = () => {
    resetForm();
    setShowUploadModal(true);
  };

  const getEventName = (eventId) => {
    const events = {
      "1": "Friday Exposure",
      "2": "Photo Adda",
      "3": "Photo Walk",
      "4": "Exhibitions Visit",
      "5": "Workshops & Talks",
      "6": "Shutter Stories"
    };
    return events[eventId] || "Unknown Event";
  };

  const truncateDescription = (description, maxLength = 100) => {
    if (!description) return "No description";
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <div className="gallery-upload-container">
        <div className="gallery-upload">
          <div className="gallery-header">
            <h2>Gallery Management</h2>
          </div>
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-upload-container">
      <div className="gallery-upload">
        <div className="gallery-header">
          <h2>
            <FaImages /> Gallery Management
          </h2>
          <p>Upload and manage photos in the gallery</p>
        </div>

        <div className="gallery-controls">
          <div className="gallery-stats">
            <span>
              Total Photos: <strong>{galleryPhotos.length}</strong>
            </span>
            <span>
              Latest Upload: <strong>
                {galleryPhotos.length > 0 
                  ? new Date(galleryPhotos[0].uploadedAt || galleryPhotos[0].timestamp).toLocaleDateString()
                  : "None"
                }
              </strong>
            </span>
          </div>

          <div className="gallery-actions">
            <button
              onClick={fetchGalleryPhotos}
              className="btn-secondary"
              disabled={loading}
            >
              <FaSync /> Refresh
            </button>
            <button
              onClick={handleNewPhoto}
              className="btn-primary upload-btn"
            >
              <FaPlus />
              Add to Gallery
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchGalleryPhotos} className="btn-secondary">
              Try Again
            </button>
          </div>
        )}

        {galleryPhotos.length === 0 && !error ? (
          <div className="no-photos">
            <FaImages size={48} />
            <h3>No Photos Yet</h3>
            <p>Start by uploading your first photo to the gallery!</p>
            <button onClick={handleNewPhoto} className="btn-primary">
              <FaPlus /> Upload First Photo
            </button>
          </div>
        ) : (
          <div className="gallery-photos-grid">
            {galleryPhotos.map((photo) => (
              <div key={photo.id} className="gallery-photo-card">
                <div className="photo-preview">
                  <img
                    src={photo.url || photo.imageUrl}
                    alt={photo.title}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div className="image-error" style={{ display: 'none' }}>
                    <FaImages size={24} />
                    <span>Image not available</span>
                  </div>
                </div>

                <div className="photo-content">
                  <h3 className="photo-title">{photo.title}</h3>
                  <p className="photo-description">
                    {truncateDescription(photo.description)}
                  </p>

                  <div className="photo-meta">
                    <span className="photo-event">
                      <FaCalendar /> {getEventName(photo.eventId)}
                    </span>
                    <span className="photo-date">
                      {new Date(photo.uploadedAt || photo.timestamp).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="photo-footer">
                    <span className="photo-author">
                      <FaUser /> by {photo.uploadedBy || user.email}
                    </span>
                    <span className="photo-id">
                      ID: {photo.id}
                    </span>
                  </div>
                </div>

                <div className="photo-actions">
                  <button
                    onClick={() => window.open(photo.url || photo.imageUrl, '_blank')}
                    className="btn-view"
                    title="View Image"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => handleEdit(photo)}
                    className="btn-edit"
                    title="Edit Photo"
                  >
                    <FaEdit />
                  </button>
                  {photo.facebookPost && (
                    <button
                      onClick={() => window.open(photo.facebookPost, '_blank')}
                      className="btn-facebook"
                      title="View Facebook Post"
                    >
                      FB
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(photo.id)}
                    className="btn-delete"
                    title="Delete Photo"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload/Edit Modal */}
        {showUploadModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>{editingPhoto ? "Edit Photo" : "Add Photo to Gallery"}</h3>
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    resetForm();
                  }}
                  className="modal-close"
                  disabled={uploading}
                >
                  <FaTimes />
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleGalleryUpload} className="upload-form">
                  <div className="form-group">
                    <label>Title *</label>
                    <input
                      type="text"
                      value={uploadForm.title}
                      onChange={(e) =>
                        setUploadForm({ ...uploadForm, title: e.target.value })
                      }
                      placeholder="Enter photo title"
                      required
                      disabled={uploading}
                    />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={uploadForm.description}
                      onChange={(e) =>
                        setUploadForm({
                          ...uploadForm,
                          description: e.target.value,
                        })
                      }
                      placeholder="Enter photo description"
                      rows="4"
                      disabled={uploading}
                    />
                  </div>

                  <div className="form-group">
                    <label>Event *</label>
                    <select
                      value={uploadForm.eventId}
                      onChange={(e) =>
                        setUploadForm({ ...uploadForm, eventId: e.target.value })
                      }
                      required
                      disabled={uploading}
                    >
                      <option value="">Select an event</option>
                      <option value="1">Friday Exposure</option>
                      <option value="2">Photo Adda</option>
                      <option value="3">Photo Walk</option>
                      <option value="4">Exhibitions Visit</option>
                      <option value="5">Workshops & Talks</option>
                      <option value="6">Shutter Stories</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Facebook Post URL</label>
                    <input
                      type="url"
                      value={uploadForm.facebookPost}
                      onChange={(e) =>
                        setUploadForm({
                          ...uploadForm,
                          facebookPost: e.target.value,
                        })
                      }
                      placeholder="https://facebook.com/..."
                      disabled={uploading}
                    />
                  </div>

                  <div className="form-group">
                    <label>Image URL *</label>
                    <input
                      type="url"
                      value={uploadForm.imageUrl}
                      onChange={(e) => handleImageUrlChange(e.target.value)}
                      placeholder="https://res.cloudinary.com/..."
                      required
                      disabled={uploading}
                    />
                    {imagePreview && (
                      <div className="image-preview">
                        <p>Preview:</p>
                        <img
                          src={imagePreview}
                          alt="Preview"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      </div>
                    )}
                    <small
                      style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}
                    >
                      Supported: Cloudinary, Imgur, or direct image URLs
                    </small>
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      onClick={() => {
                        setShowUploadModal(false);
                        resetForm();
                      }}
                      className="btn-secondary"
                      disabled={uploading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={uploading}
                    >
                      {uploading ? <FaSync className="spinner" /> : <FaUpload />}
                      {uploading ? (editingPhoto ? "Updating..." : "Uploading...") : (editingPhoto ? "Update Photo" : "Upload to Gallery")}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryUpload;