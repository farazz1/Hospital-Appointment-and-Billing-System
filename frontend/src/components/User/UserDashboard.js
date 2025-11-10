import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';

const UserDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="user-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Healthcare Management System</h1>
          <div className="user-menu">
            <div className="user-profile" onClick={() => navigate('/user-info')}>
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

      <nav className="dashboard-nav">
        <div className="nav-content">
          <button className="nav-btn active" onClick={() => navigate('/user-dashboard')}>Overview</button>
          <button className="nav-btn" onClick={() => navigate('/user-appointments')}>Appointments</button>
          <button className="nav-btn" onClick={() => navigate('/book-appointment')}>Book Appointment</button>
          <button className="nav-btn" onClick={() => navigate('/user-bills')}>Bills</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-info">
              <h3>1</h3>
              <p>Scheduled Appointments</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>$150</h3>
              <p>Total Amount Due</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🏥</div>
            <div className="stat-info">
              <h3>0</h3>
              <p>Completed Appointments</p>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="info-card">
            <h2>Patient Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Name</label>
                <span>John Doe</span>
              </div>
              <div className="info-item">
                <label>Phone</label>
                <span>1234-567890</span>
              </div>
              <div className="info-item">
                <label>Gender</label>
                <span>Male</span>
              </div>
              <div className="info-item">
                <label>Email</label>
                <span>JohnDoe@gmail.com</span>
              </div>
              <div className="info-item full-width">
                <label>Address</label>
                <span>D-6, 12th Street, Greenwich, London, United Kingdom</span>
              </div>
              <div className="info-item">
                <label>Blood Type</label>
                <span>A+</span>
              </div>
            </div>
          </div>

          <div className="info-card">
            <h2>Medical History</h2>
            <div className="medical-history">
              <p>N/A</p>
            </div>
          </div>

          <div className="info-card">
            <h2>Upcoming Appointments</h2>
            <div className="appointment-card">
              <div className="appointment-details">
                <h4>Dr. Sarah Johnson - Cardiology</h4>
                <p>10/29/2025 at 09:00 AM</p>
              </div>
              <button className="view-btn">View Details</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;