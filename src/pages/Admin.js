// pages/Admin.js
import React from 'react';
import './Admin.css';

const Admin = ({ user }) => {
  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Admin Panel</h1>
        <p>Manage club content and members</p>
      </div>
      
      <div className="container">
        <div className="admin-content">
          <p>Welcome, {user.email}</p>
          <p>Admin panel coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Admin;