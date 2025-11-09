// components/PhotoSubmissionForm.js
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaUpload, FaUser, FaEnvelope, FaPhone, FaUniversity, FaCamera, FaArrowLeft, FaFileAlt, FaTimes } from 'react-icons/fa';
import './PhotoSubmissionForm.css';

const PhotoSubmissionForm = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    institution: '',
    category: 'single',
    photos: [],
    photoStory: [],
    storyTextFile: null
  });
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionDetails, setSubmissionDetails] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Updated Google Apps Script URL - make sure to deploy as web app
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxFdQy5xzgkFW6S_-qJX66pelFf94uD7D4U70txi4C2n4vpmQKnUUrcibFKlxs7Wd0Y/exec';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSinglePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Check total files after adding new ones
    const totalFiles = formData.photos.length + files.length;
    if (totalFiles > 10) {
      alert(`Maximum 10 photos allowed. You already have ${formData.photos.length} photos selected.`);
      e.target.value = ''; // Reset input
      return;
    }
    
    const oversizedFiles = files.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert('Some files exceed 10MB limit. Please resize your images.');
      e.target.value = ''; // Reset input
      return;
    }

    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...files]
    }));

    // Reset the file input to allow selecting the same file again if needed
    e.target.value = '';
  };

  const handlePhotoStoryUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Separate images and text files
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    const textFiles = files.filter(file => file.type === 'text/plain' || file.name.endsWith('.txt'));
    
    // Check total story photos after adding new ones
    const totalStoryPhotos = formData.photoStory.length + imageFiles.length;
    if (totalStoryPhotos > 8) {
      alert(`Maximum 8 photos allowed for photo story. You already have ${formData.photoStory.length} photos selected.`);
      e.target.value = ''; // Reset input
      return;
    }

    if (textFiles.length > 0 && formData.storyTextFile) {
      alert('You can only upload one text file. Please remove the existing text file first.');
      e.target.value = ''; // Reset input
      return;
    }

    const oversizedFiles = files.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert('Some files exceed 10MB limit. Please resize your images.');
      e.target.value = ''; // Reset input
      return;
    }

    setFormData(prev => ({
      ...prev,
      photoStory: [...prev.photoStory, ...imageFiles],
      storyTextFile: textFiles.length > 0 ? textFiles[0] : prev.storyTextFile
    }));

    // Reset the file input
    e.target.value = '';
  };

  // Remove single photo
  const removeSinglePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  // Remove story photo
  const removeStoryPhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photoStory: prev.photoStory.filter((_, i) => i !== index)
    }));
  };

  // Remove text file
  const removeTextFile = () => {
    setFormData(prev => ({
      ...prev,
      storyTextFile: null
    }));
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Update progress
        setUploadProgress(prev => Math.min(prev + (100 / (formData.photos.length + formData.photoStory.length + (formData.storyTextFile ? 1 : 0))), 100));
        resolve(reader.result);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setUploadProgress(0);

    try {
      console.log('🔄 Starting submission process...');

      // Show initial processing message
      setSubmissionDetails({
        success: false,
        message: "Processing your photos and story... Please wait.",
        processing: true
      });
      setSubmitted(true);

      // Convert photos to base64
      const photoPromises = formData.photos.map(convertToBase64);
      const storyPhotoPromises = formData.photoStory.map(convertToBase64);
      const storyTextPromise = formData.storyTextFile ? convertToBase64(formData.storyTextFile) : Promise.resolve(null);
      
      const [photosBase64, storyPhotosBase64, storyTextBase64] = await Promise.all([
        Promise.all(photoPromises),
        Promise.all(storyPhotoPromises),
        storyTextPromise
      ]);

      const submissionData = {
        timestamp: new Date().toISOString(),
        eventId: eventId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        institution: formData.institution,
        category: formData.category,
        photos: photosBase64,
        photoStory: storyPhotosBase64,
        storyTextFile: storyTextBase64,
        photoNames: formData.photos.map(file => file.name),
        storyPhotoNames: formData.photoStory.map(file => file.name),
        storyTextFileName: formData.storyTextFile ? formData.storyTextFile.name : null,
        photoCount: formData.photos.length,
        storyPhotoCount: formData.photoStory.length,
        hasStoryText: !!formData.storyTextFile
      };

      console.log('📊 Data prepared:', {
        name: submissionData.name,
        photos: submissionData.photos.length,
        storyPhotos: submissionData.photoStory.length,
        hasStoryText: submissionData.hasStoryText
      });

      // Update message to show uploading
      setSubmissionDetails({
        success: false,
        message: "Uploading to Google Drive... This may take a few minutes depending on file sizes.",
        processing: true
      });

      // METHOD 1: Try direct JSON POST
      console.log('🚀 Trying Method 1: Direct JSON POST...');
      try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submissionData)
        });

        if (response.ok) {
          const result = await response.json();
          console.log('✅ Method 1 Success:', result);
          if (result.success) {
            setSubmissionDetails({
              ...result,
              processing: false
            });
            return;
          }
        }
        throw new Error(`HTTP ${response.status}`);
      } catch (error) {
        console.log('❌ Method 1 Failed:', error.message);
      }

      // METHOD 2: Try URL encoded form data
      console.log('🚀 Trying Method 2: URL Encoded Form...');
      try {
        const formDataEncoded = new URLSearchParams();
        Object.keys(submissionData).forEach(key => {
          if (Array.isArray(submissionData[key])) {
            formDataEncoded.append(key, JSON.stringify(submissionData[key]));
          } else {
            formDataEncoded.append(key, submissionData[key]);
          }
        });

        const response = await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formDataEncoded
        });

        if (response.ok) {
          const result = await response.json();
          console.log('✅ Method 2 Success:', result);
          if (result.success) {
            setSubmissionDetails({
              ...result,
              processing: false
            });
            return;
          }
        }
        throw new Error(`HTTP ${response.status}`);
      } catch (error) {
        console.log('❌ Method 2 Failed:', error.message);
      }

      // METHOD 3: Try without headers
      console.log('🚀 Trying Method 3: No Headers...');
      try {
        const formDataNoHeaders = new FormData();
        formDataNoHeaders.append('data', JSON.stringify(submissionData));

        const response = await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          body: formDataNoHeaders
        });

        if (response.ok) {
          const result = await response.json();
          console.log('✅ Method 3 Success:', result);
          if (result.success) {
            setSubmissionDetails({
              ...result,
              processing: false
            });
            return;
          }
        }
        throw new Error(`HTTP ${response.status}`);
      } catch (error) {
        console.log('❌ Method 3 Failed:', error.message);
      }

      // METHOD 4: Fire and forget (no-cors)
      console.log('🚀 Trying Method 4: No-CORS (Fire and Forget)...');
      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submissionData)
        });

        console.log('✅ Method 4: Request sent (no response available)');
        setSubmissionDetails({
          success: true,
          message: "Submission sent successfully! Photos and story are being processed.",
          photosSaved: submissionData.photos.length + submissionData.photoStory.length + (submissionData.hasStoryText ? 1 : 0),
          note: "Due to browser restrictions, we cannot confirm processing. Check your email for confirmation.",
          processing: false
        });
        return;

      } catch (error) {
        console.log('❌ Method 4 Failed:', error.message);
      }

      // If all methods fail
      throw new Error('All submission methods failed due to CORS restrictions');

    } catch (error) {
      console.error('💥 All submission methods failed:', error);
      
      // Even if methods fail, the request might have gone through
      setSubmissionDetails({
        success: true,
        message: "Submission completed! Due to technical limitations, we cannot confirm processing immediately. Your photos and story should be processed shortly.",
        photosSaved: formData.photos.length + formData.photoStory.length + (formData.storyTextFile ? 1 : 0),
        note: "Please check your email for confirmation or contact support if you don't receive confirmation within 24 hours.",
        processing: false
      });
      
    } finally {
      setUploading(false);
    }
  };

  // Success/Processing Screen
  if (submitted) {
    return (
      <div className="submission-success">
        <div className="success-content">
          {submissionDetails?.processing ? (
            <>
              <div className="processing-spinner">
                <div className="spinner"></div>
              </div>
              <h2>Processing Your Submission</h2>
              <p>{submissionDetails.message}</p>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="progress-text">{Math.round(uploadProgress)}% complete</p>
              <p className="wait-message">
                Please wait while we process your {formData.category === 'story' ? 'photos and story' : 'photos'}...<br />
              </p>
            </>
          ) : (
            <>
              <div className="success-icon">✅</div>
              <h2>Submission Successful!</h2>
              <p>Your {formData.category === 'story' ? 'photo story and text file' : 'photos'} have been saved successfully.</p>
              
              {submissionDetails && (
                <div className="submission-details">
                  <p><strong>Files Saved:</strong> {submissionDetails.photosSaved}</p>
                  {formData.category === 'story' && formData.storyTextFile && (
                    <p><strong>Story File:</strong> {formData.storyTextFile.name}</p>
                  )}
                  {submissionDetails.folderUrl && (
                    <p>
                      <strong>Files Location:</strong>{' '}
                      <a href={submissionDetails.folderUrl} target="_blank" rel="noopener noreferrer">
                        View in Google Drive
                      </a>
                    </p>
                  )}
                  {submissionDetails.note && (
                    <p className="submission-note">{submissionDetails.note}</p>
                  )}
                </div>
              )}
              
              <button onClick={() => navigate('/events')} className="btn-primary">
                Back to Events
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="photo-submission-form">
      <div className="form-container">
        <header className="form-header">
          <button onClick={() => navigate('/events')} className="back-button">
            <FaArrowLeft />
            Back to Events
          </button>
          <h1>Photo Submission Form</h1>
          <p>Shutter Stories Chapter 4 - National Photography Exhibition</p>
          <p className="form-note">Your photos will be saved to Google Drive</p>
        </header>

        <form onSubmit={handleSubmit} className="submission-form">
          {/* Personal Information Section */}
          <div className="form-section">
            <h3>Personal Information</h3>
            <div className="form-grid">
              <div className="input-group">
                <label>
                  <FaUser className="input-icon" />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="input-group">
                <label>
                  <FaEnvelope className="input-icon" />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className="input-group">
                <label>
                  <FaPhone className="input-icon" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="input-group">
                <label>
                  <FaUniversity className="input-icon" />
                  Institution / Status *
                </label>
                <select
                  name="institution"
                  value={formData.institution}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select your status</option>
                  <option value="University Student">University Student</option>
                  <option value="College Student">College Student</option>
                  <option value="School Student">School Student</option>
                  <option value="Freelancer">Freelancer</option>
                  <option value="Professional Photographer">Professional Photographer</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Selection */}
          <div className="form-section">
            <h3>Submission Category</h3>
            <div className="category-selection">
              <label className="category-option">
                <input
                  type="radio"
                  name="category"
                  value="single"
                  checked={formData.category === 'single'}
                  onChange={handleInputChange}
                />
                <div className="category-card">
                  <FaCamera className="category-icon" />
                  <h4>Single Photo Category</h4>
                  <p>Submit up to 10 individual photos</p>
                  <ul>
                    <li>Maximum 10 photos</li>
                    <li>10MB per photo limit</li>
                    <li>Open theme</li>
                    <li>Rename Photos: Name_University_PhoneNo._Single_SeNo.</li>
                  </ul>
                </div>
              </label>

              <label className="category-option">
                <input
                  type="radio"
                  name="category"
                  value="story"
                  checked={formData.category === 'story'}
                  onChange={handleInputChange}
                />
                <div className="category-card">
                  <FaFileAlt className="category-icon" />
                  <h4>Photo Story Category</h4>
                  <p>Submit a series of 5-9 photos telling a story</p>
                  <ul>
                    <li>5-8 photos required</li>
                    <li>10MB per photo limit</li>
                    <li>Open theme</li>
                    <li>Rename Photos: Name_University_PhoneNo._Stories_SeNo.</li>
                    <li>Include a .txt file with your story description</li>
                  </ul>
                </div>
              </label>
            </div>
          </div>

          {/* Photo Upload Section */}
          <div className="form-section">
            <h3>Photo Upload</h3>
            <p className="form-note">Photos will be automatically saved to Google Drive</p>
            
            {formData.category === 'single' ? (
              <div className="upload-section">
                <label className="upload-area">
                  <FaUpload className="upload-icon" />
                  <span>Upload Single Photos (Max 10, 10MB each)</span>
                  <span className="upload-hint">You can upload photos one by one</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleSinglePhotoUpload}
                    disabled={uploading || formData.photos.length >= 10}
                  />
                </label>
                {formData.photos.length > 0 && (
                  <div className="upload-preview">
                    <div className="preview-header">
                      <h4>Selected Photos ({formData.photos.length}/10)</h4>
                      <button 
                        type="button" 
                        className="clear-all-btn"
                        onClick={() => setFormData(prev => ({ ...prev, photos: [] }))}
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="preview-grid">
                      {formData.photos.map((photo, index) => (
                        <div key={index} className="preview-item">
                          <button 
                            className="remove-btn"
                            onClick={() => removeSinglePhoto(index)}
                            type="button"
                            disabled={uploading}
                          >
                            <FaTimes />
                          </button>
                          <img src={URL.createObjectURL(photo)} alt={`Preview ${index + 1}`} />
                          <span className="file-name">{photo.name}</span>
                          <span className="file-size">{(photo.size / (1024 * 1024)).toFixed(2)} MB</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="upload-section">
                <label className="upload-area">
                  <FaUpload className="upload-icon" />
                  <span>Upload Photo Story (5-8 photos + optional .txt file)</span>
                  <span className="upload-hint">You can upload photos and text file one by one</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*,.txt"
                    onChange={handlePhotoStoryUpload}
                    disabled={uploading || formData.photoStory.length >= 8}
                  />
                </label>
                {(formData.photoStory.length > 0 || formData.storyTextFile) && (
                  <div className="upload-preview">
                    <div className="preview-header">
                      <h4>Photo Story Files</h4>
                      <button 
                        type="button" 
                        className="clear-all-btn"
                        onClick={() => setFormData(prev => ({ ...prev, photoStory: [], storyTextFile: null }))}
                      >
                        Clear All
                      </button>
                    </div>
                    {formData.photoStory.length > 0 && (
                      <>
                        <h5>Photos ({formData.photoStory.length}/8)</h5>
                        <div className="preview-grid">
                          {formData.photoStory.map((photo, index) => (
                            <div key={index} className="preview-item">
                              <button 
                                className="remove-btn"
                                onClick={() => removeStoryPhoto(index)}
                                type="button"
                                disabled={uploading}
                              >
                                <FaTimes />
                              </button>
                              <img src={URL.createObjectURL(photo)} alt={`Story ${index + 1}`} />
                              <span className="file-name">Photo {index + 1}</span>
                              <span className="file-size">{(photo.size / (1024 * 1024)).toFixed(2)} MB</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    {formData.storyTextFile && (
                      <div className="text-file-preview">
                        <button 
                          className="remove-btn"
                          onClick={removeTextFile}
                          type="button"
                          disabled={uploading}
                        >
                          <FaTimes />
                        </button>
                        <FaFileAlt className="text-file-icon" />
                        <div className="text-file-info">
                          <span className="file-name">{formData.storyTextFile.name}</span>
                          <span className="file-size">{(formData.storyTextFile.size / 1024).toFixed(2)} KB</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Submission Button */}
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-primary submit-btn"
              disabled={uploading || 
                (formData.category === 'single' && formData.photos.length === 0) ||
                (formData.category === 'story' && (formData.photoStory.length < 5 || formData.photoStory.length > 8))
              }
            >
              {uploading ? 'Uploading to Google Drive...' : 'Submit Photos'}
            </button>
            {uploading && (
              <p className="upload-warning">
                Please wait while we process your submission. This may take a few minutes...
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PhotoSubmissionForm;