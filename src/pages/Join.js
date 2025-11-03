// pages/Join.js
import React, { useState } from 'react';
import { 
  FaChalkboardTeacher,
  FaImages,
  FaWalking,
  FaUser, 
  FaEnvelope, 
  FaIdCard, 
  FaUniversity, 
  FaPhone, 
  FaCamera,
  FaPaperPlane,
  FaCheck,
  FaExclamationTriangle,
  FaSpinner,
  FaTrophy,
  FaHandshake,
  FaCameraRetro,
} from 'react-icons/fa';
import './Join.css';

const Join = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitMessage, setSubmitMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    email: '',
    department: '',
    phone: '',
    interests: '',
    experience: '',
    message: ''
  });
  const [photo, setPhoto] = useState(null);

  // Google Apps Script Web App URL - You'll need to create this
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzDOwkW7RjH7HLINi0JLW474tugDLX3mrPFKMj07dbFfMqiWNkKHyVmSwv1E5BD7iMs/exec';

  const departments = [
    'Computer Science & Engineering',
    'Electrical & Electronic Engineering',
    'Business Administration',
    'Economics',
    'English',
    'Law',
    'Pharmacy',
    'Architecture',
    'Other'
  ];

  const photographyInterests = [
    'Portrait Photography',
    'Landscape Photography',
    'Street Photography',
    'Wildlife Photography',
    'Sports Photography',
    'Event Photography',
    'Macro Photography',
    'Night Photography',
    'Architectural Photography',
    'Fashion Photography'
  ];

  const experienceLevels = [
    'Beginner',
    'Intermediate',
    'Advanced',
    'Professional'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Please select an image smaller than 5MB');
        return;
      }
      setPhoto(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Prepare form data
      const submissionData = new FormData();
      
      // Add text fields
      Object.keys(formData).forEach(key => {
        submissionData.append(key, formData[key]);
      });
      
      // Add photo if exists
      if (photo) {
        submissionData.append('photo', photo);
      }
      
      // Add timestamp
      submissionData.append('timestamp', new Date().toISOString());

      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: submissionData
      });

      if (response.ok) {
        await response.text();
        setIsSubmitting(false);
        setSubmitStatus('success');
        setSubmitMessage('Thank you for your application! We will review it and get back to you soon.');
        
        // Reset form
        setFormData({
          name: '',
          studentId: '',
          email: '',
          department: '',
          phone: '',
          interests: '',
          experience: '',
          message: ''
        });
        setPhoto(null);
        document.getElementById('photo-upload').value = '';
      } else {
        throw new Error('Failed to submit application');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setIsSubmitting(false);
      setSubmitStatus('error');
      setSubmitMessage('Sorry, there was an error submitting your application. Please try again or contact us directly.');
    }
  };

  return (
    <div className="join-page">
      <div className="page-header">
        <h1>Join UIU Photography Club</h1>
        <p>Become part of our creative community and showcase your photography skills</p>
      </div>
      
      <div className="container">
        <div className="join-content">
          <div className="join-grid">
            {/* Membership Benefits */}
            <div className="benefits-section">
              <h2>Why Join Us?</h2>
              <div className="benefits-grid">
                <div className="benefit-card">
                  <div className="benefit-icon">
                    <FaChalkboardTeacher />
                  </div>
                  <h3>Workshops & Training</h3>
                  <p>Learn from experienced photographers and improve your skills</p>
                </div>
                
                <div className="benefit-card">
                  <div className="benefit-icon">
                    <FaWalking />
                  </div>
                  <h3>Photo Walks & Events</h3>
                  <p>Participate in organized photo walks and photography events</p>
                </div>
                
                <div className="benefit-card">
                  <div className="benefit-icon">
                    <FaTrophy />
                  </div>
                  <h3>Competitions</h3>
                  <p>Showcase your work in our regular photography competitions</p>
                </div>  
                
                <div className="benefit-card">
                  <div className="benefit-icon">
                    <FaHandshake />
                  </div>
                  <h3>Networking</h3>
                  <p>Connect with fellow photography enthusiasts</p>
                </div>
                
                <div className="benefit-card">
                  <div className="benefit-icon">
                    <FaImages />
                  </div>
                  <h3>Exhibitions</h3>
                  <p>Get opportunities to exhibit your work in campus exhibitions</p>
                </div>
                
                <div className="benefit-card">
                  <div className="benefit-icon">
                    <FaCameraRetro />
                  </div>
                  <h3>Resources</h3>
                  <p>Access to photography equipment and learning resources</p>
                </div>
              </div>
            </div>

            {/* Application Form */}
            <div className="application-section">
              <div className="application-form-container">
                <h2>Membership Application</h2>
                
                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div className="status-message success">
                    <FaCheck className="status-icon" />
                    {submitMessage}
                  </div>
                )}
                
                {submitStatus === 'error' && (
                  <div className="status-message error">
                    <FaExclamationTriangle className="status-icon" />
                    {submitMessage}
                  </div>
                )}

                <form className="application-form" onSubmit={handleSubmit}>
                  {/* Personal Information */}
                  <div className="form-section">
                    <h3>Personal Information</h3>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="name">
                          <FaUser className="input-icon" />
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="studentId">
                          <FaIdCard className="input-icon" />
                          Student ID *
                        </label>
                        <input
                          type="text"
                          id="studentId"
                          name="studentId"
                          value={formData.studentId}
                          onChange={handleInputChange}
                          placeholder="Enter your UIU Student ID"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="email">
                          <FaEnvelope className="input-icon" />
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="phone">
                          <FaPhone className="input-icon" />
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter your phone number"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="department">
                        <FaUniversity className="input-icon" />
                        Department *
                      </label>
                      <select
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                      >
                        <option value="">Select your department</option>
                        {departments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Photography Information */}
                  <div className="form-section">
                    <h3>Photography Background</h3>
                    
                    <div className="form-group">
                      <label htmlFor="experience">
                        <FaCamera className="input-icon" />
                        Photography Experience Level *
                      </label>
                      <select
                        id="experience"
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                      >
                        <option value="">Select your experience level</option>
                        {experienceLevels.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="interests">
                        <FaCamera className="input-icon" />
                        Photography Interests *
                      </label>
                      <div className="interests-grid">
                        {photographyInterests.map(interest => (
                          <label key={interest} className="interest-checkbox">
                            <input
                              type="checkbox"
                              name="interests"
                              value={interest}
                              onChange={(e) => {
                                const currentInterests = formData.interests.split(', ').filter(i => i);
                                if (e.target.checked) {
                                  currentInterests.push(interest);
                                } else {
                                  const index = currentInterests.indexOf(interest);
                                  if (index > -1) currentInterests.splice(index, 1);
                                }
                                setFormData(prev => ({
                                  ...prev,
                                  interests: currentInterests.join(', ')
                                }));
                              }}
                              disabled={isSubmitting}
                            />
                            <span className="checkmark"></span>
                            {interest}
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="photo">
                        <FaCamera className="input-icon" />
                        Sample Photo (Optional)
                      </label>
                      <input
                        type="file"
                        id="photo-upload"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        disabled={isSubmitting}
                      />
                      {photo && (
                        <div className="photo-preview">
                          <p>Selected: {photo.name}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="message">
                        Why do you want to join UIU Photography Club? *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows="4"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us about your interest in photography and what you hope to gain from joining the club..."
                        required
                        disabled={isSubmitting}
                      ></textarea>
                    </div>
                  </div>
                  
                  <button 
                    type="submit" 
                    className={`btn-primary submit-btn ${isSubmitting ? 'submitting' : ''}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="spinner" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="btn-icon" />
                        Submit Application
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Join;