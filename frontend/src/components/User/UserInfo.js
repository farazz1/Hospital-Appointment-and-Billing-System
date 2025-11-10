import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserInfo.css';

const UserInfo = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: 'John',
    phoneNumber: '1234-567890',
    email: 'john@gmail.com',
    address: 'Sarah Smile, 123 Giggle Ave, Richmond, VA 22548, USA',
    emergencyContact: '',
    medicalHistory: ''
  });

  const handleLogout = () => {
    navigate('/');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/user-dashboard');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="user-info">
      <header className="info-header">
        <div className="header-content">
          <h1>Healthcare Management System</h1>
          <div className="user-menu">
            <div className="user-profile" onClick={() => navigate('/user-dashboard')}>
              <div className="user-avatar">JD</div>
              <div className="user-details">
                <span className="user-name">John Doe</span>
                <span className="user-email">JohnDoe@gmail.com</span>
              </div>
            </div>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </header>

      <div className="info-container">
        <div className="info-card">
          <h1>Complete Your Patient Information</h1>
          <p className="info-subtitle">
            Please fill out your information to access the patient dashboard and book appointments.
          </p>

          <form onSubmit={handleSubmit} className="info-form">
            <div className="form-grid">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group full-width">
                <label>Emergency Contact</label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  placeholder="Name and phone number"
                  className="form-input"
                />
              </div>

              <div className="form-group full-width">
                <label>Medical History (Optional)</label>
                <textarea
                  name="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={handleChange}
                  placeholder="Describe your medical history"
                  className="form-textarea"
                  rows="4"
                />
              </div>
            </div>

            <div className="form-note">
              <p>All information will be kept confidential and used only for medical purposes.</p>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                Submit Information
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;