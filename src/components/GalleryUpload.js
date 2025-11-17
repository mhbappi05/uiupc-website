// components/GalleryUpload.js
import React, { useState } from "react";
import { FaPlus, FaUpload, FaSync, FaTimes } from "react-icons/fa";
import "./GalleryUpload.css";

const GalleryUpload = ({ user, scripts, onUploadSuccess }) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    eventId: "",
    facebookPost: "",
    imageUrl: "",
  });

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
        alert(
          "Please fill in all required fields: Title, Image URL, and Event"
        );
        return;
      }

      const response = await fetch(scripts.gallery, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          action: "addToGallery",
          title: uploadForm.title,
          description: uploadForm.description,
          eventId: uploadForm.eventId,
          facebookPost: uploadForm.facebookPost,
          imageUrl: uploadForm.imageUrl,
          uploadedBy: user.email,
          timestamp: new Date().toISOString(),
        }),
      });

      const result = await response.json();

      if (result.status === "success") {
        alert("Photo successfully added to gallery!");
        setShowUploadModal(false);
        setUploadForm({
          title: "",
          description: "",
          eventId: "",
          facebookPost: "",
          imageUrl: "",
        });

        // Notify parent component about successful upload
        if (onUploadSuccess) {
          onUploadSuccess();
        }
      } else {
        throw new Error(result.message || "Failed to upload to gallery");
      }
    } catch (error) {
      console.error("Error uploading to gallery:", error);
      alert("Failed to upload to gallery: " + error.message);
    } finally {
      setUploading(false);
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
  };

  return (
    <>
      <button
        onClick={() => setShowUploadModal(true)}
        className="btn-primary upload-btn"
      >
        <FaPlus />
        Add to Gallery
      </button>

      {showUploadModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add Photo to Gallery</h3>
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
                    {uploading ? "Uploading..." : "Upload to Gallery"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GalleryUpload;
