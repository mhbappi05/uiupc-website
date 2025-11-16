// pages/Admin.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaSync, FaEye, FaDownload, FaSearch, FaFilter } from 'react-icons/fa';
import Loading from '../components/Loading';
import './Admin.css';

const Admin = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  const { user } = useAuth();

  // Google Apps Script URL for Admin API (your NEW deployment)
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwf_UmVAhpw7_y9RXbLartxhOwRFZhAg9KMqw4q1wvNTE1DQM_Qq_ryPLAnRWkM25Yd/exec";

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Starting to fetch applications...');
      
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=getApplications`);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('API Response:', result);
      
      if (result.status === 'success') {
        console.log('Applications fetched successfully:', result.data?.length);
        // Sort by timestamp descending (newest first)
        const sortedApplications = (result.data || []).sort((a, b) => 
          new Date(b.Timestamp || b.timestamp) - new Date(a.Timestamp || a.timestamp)
        );
        setApplications(sortedApplications);
      } else {
        throw new Error(result.message || 'Failed to fetch applications');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Safe string conversion helper
  const safeToString = (value) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    return String(value);
  };

  // Filter applications based on search and status
  const filteredApplications = applications.filter(app => {
    const name = safeToString(app['Full Name'] || app.name);
    const email = safeToString(app.Email || app.email);
    const studentId = safeToString(app['Student ID'] || app.studentId);
    const department = safeToString(app.Department || app.department);
    const status = safeToString(app.Status || app.status || 'pending');

    const matchesSearch = 
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      filterStatus === 'all' || 
      (filterStatus === 'pending' && (!status || status === 'pending')) ||
      (filterStatus === 'approved' && status === 'approved') ||
      (filterStatus === 'rejected' && status === 'rejected');

    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setShowDetailsModal(true);
  };

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          action: 'updateStatus',
          applicationId: applicationId,
          status: newStatus,
          updatedBy: user.email,
        }),
      });

      const result = await response.json();
      
      if (result.status === 'success') {
        // Refresh the applications list
        fetchApplications();
      } else {
        throw new Error(result.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update application status: ' + error.message);
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Timestamp', 'Full Name', 'Student ID', 'Email', 'Department', 'Phone',
      'Experience Level', 'Interests', 'Payment Method', 'Status'
    ];
    
    const csvData = filteredApplications.map(app => [
      app.Timestamp || app.timestamp,
      safeToString(app['Full Name'] || app.name),
      safeToString(app['Student ID'] || app.studentId),
      safeToString(app.Email || app.email),
      safeToString(app.Department || app.department),
      safeToString(app.Phone || app.phone),
      safeToString(app['Experience Level'] || app.experience),
      safeToString(app.Interests || app.interests),
      safeToString(app['Payment Method'] || app.paymentMethod),
      safeToString(app.Status || app.status || 'pending')
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `uiu-photography-club-applications-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status) => {
    const actualStatus = safeToString(status || 'pending');
    const statusConfig = {
      'approved': { class: 'status-approved', text: 'Approved' },
      'rejected': { class: 'status-rejected', text: 'Rejected' },
      'pending': { class: 'status-pending', text: 'Pending' }
    };
    
    const config = statusConfig[actualStatus] || statusConfig.pending;
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  // Safe property access helper
  const getProperty = (app, property) => {
    const value = app[property] || app[property.toLowerCase()];
    return safeToString(value) || 'N/A';
  };

  // Use your custom Loading component
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Admin Panel</h1>
        <p>Manage UIUPC from here</p>
      </div>
      
      <div className="container">
        <div className="admin-content">
          {/* Debug Info - Remove this after fixing */}
          <div className="debug-info">
            <strong>Debug Info:</strong> 
            Total: {applications.length} | 
            Filtered: {filteredApplications.length} | 
            Error: {error ? 'Yes' : 'No'}
          </div>

          {/* Welcome Message */}
          <div className="admin-welcome">
            <p>Welcome, <strong>{user.email}</strong></p>
            <p>Total Applications: <strong>{applications.length}</strong></p>
            <p>Showing: <strong>{filteredApplications.length}</strong> applications</p>
          </div>

          {/* Controls */}
          <div className="admin-controls">
            <div className="search-filter-container">
              <div className="search-box">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by name, email, student ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              
              <div className="filter-controls">
                <FaFilter className="filter-icon" />
                <select 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="status-filter"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="action-buttons">
              <button 
                onClick={fetchApplications} 
                className="btn-secondary refresh-btn"
                disabled={loading}
              >
                <FaSync className={loading ? 'spinner' : ''} />
                Refresh
              </button>
              <button 
                onClick={exportToCSV} 
                className="btn-primary export-btn"
                disabled={filteredApplications.length === 0}
              >
                <FaDownload />
                Export CSV
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <p>Error loading applications: {error}</p>
              <div style={{ marginTop: '1rem' }}>
                <button onClick={fetchApplications} className="btn-secondary">
                  Try Again
                </button>
                <button 
                  onClick={() => setError(null)} 
                  className="btn-secondary"
                  style={{ marginLeft: '0.5rem' }}
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Applications Table */}
          {filteredApplications.length > 0 ? (
            <div className="applications-table-container">
              <table className="applications-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Full Name</th>
                    <th>Student ID</th>
                    <th>Department</th>
                    <th>Experience Level</th>
                    <th>Payment Method</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((app, index) => (
                    <tr key={index} className="application-row">
                      <td className="timestamp">
                        {new Date(app.Timestamp || app.timestamp).toLocaleDateString()}
                      </td>
                      <td className="name">{getProperty(app, 'Full Name')}</td>
                      <td className="student-id">{getProperty(app, 'Student ID')}</td>
                      <td className="department">{getProperty(app, 'Department')}</td>
                      <td className="experience">{getProperty(app, 'Experience Level')}</td>
                      <td className="payment-method">{getProperty(app, 'Payment Method')}</td>
                      <td className="status">
                        {getStatusBadge(app.Status || app.status)}
                      </td>
                      <td className="actions">
                        <button 
                          onClick={() => handleViewDetails(app)}
                          className="btn-view"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        {(!app.Status || app.Status === 'pending') && (
                          <div className="status-actions">
                            <button 
                              onClick={() => handleUpdateStatus(app.Timestamp || app.timestamp, 'approved')}
                              className="btn-approve"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(app.Timestamp || app.timestamp, 'rejected')}
                              className="btn-reject"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-applications">
              {applications.length === 0 ? (
                <div>
                  <p>No applications found in the system.</p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    Applications will appear here when students submit the join form.
                  </p>
                </div>
              ) : (
                <div>
                  <p>No applications found matching your search criteria.</p>
                  {(searchTerm || filterStatus !== 'all') && (
                    <button 
                      onClick={() => {
                        setSearchTerm('');
                        setFilterStatus('all');
                      }}
                      className="btn-secondary"
                      style={{ marginTop: '1rem' }}
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Application Details Modal */}
      {showDetailsModal && selectedApplication && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Application Details</h3>
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="modal-close"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="details-grid">
                <div className="detail-group">
                  <label>Name:</label>
                  <span>{getProperty(selectedApplication, 'Full Name')}</span>
                </div>
                <div className="detail-group">
                  <label>Student ID:</label>
                  <span>{getProperty(selectedApplication, 'Student ID')}</span>
                </div>
                <div className="detail-group">
                  <label>Email:</label>
                  <span>{getProperty(selectedApplication, 'Email')}</span>
                </div>
                <div className="detail-group">
                  <label>Phone:</label>
                  <span>{getProperty(selectedApplication, 'Phone') || 'Not provided'}</span>
                </div>
                <div className="detail-group">
                  <label>Department:</label>
                  <span>{getProperty(selectedApplication, 'Department')}</span>
                </div>
                <div className="detail-group">
                  <label>Experience Level:</label>
                  <span>{getProperty(selectedApplication, 'Experience Level')}</span>
                </div>
                <div className="detail-group">
                  <label>Interests:</label>
                  <span>{getProperty(selectedApplication, 'Interests')}</span>
                </div>
                <div className="detail-group">
                  <label>Payment Method:</label>
                  <span>{getProperty(selectedApplication, 'Payment Method')}</span>
                </div>
                {getProperty(selectedApplication, 'Payment Method') === 'cash' && getProperty(selectedApplication, 'Receiver Name') && (
                  <div className="detail-group">
                    <label>Receiver Name:</label>
                    <span>{getProperty(selectedApplication, 'Receiver Name')}</span>
                  </div>
                )}
                {getProperty(selectedApplication, 'Payment Method') === 'online' && getProperty(selectedApplication, 'Transaction ID') && (
                  <div className="detail-group">
                    <label>Transaction ID:</label>
                    <span>{getProperty(selectedApplication, 'Transaction ID')}</span>
                  </div>
                )}
                <div className="detail-group full-width">
                  <label>Why they want to join:</label>
                  <p>{getProperty(selectedApplication, 'Message')}</p>
                </div>
                <div className="detail-group">
                  <label>Agreement Accepted:</label>
                  <span>{getProperty(selectedApplication, 'Agreement Accepted') === 'true' ? 'Yes' : 'No'}</span>
                </div>
                <div className="detail-group">
                  <label>Submitted:</label>
                  <span>{new Date(selectedApplication.Timestamp || selectedApplication.timestamp).toLocaleString()}</span>
                </div>
                {getProperty(selectedApplication, 'Status') && (
                  <div className="detail-group">
                    <label>Current Status:</label>
                    <span>{getStatusBadge(getProperty(selectedApplication, 'Status'))}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;