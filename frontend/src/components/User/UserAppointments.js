import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UserAppointments.css';

const UserAppointments = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  const currentAppointments = [
    {
      doctor: 'Dr. Sarah Johnson',
      department: 'Cardiology',
      date: '10/29/2025',
      time: '09:00 AM',
      reason: 'WXYZ',
      status: 'Scheduled'
    }
  ];

  const handleCancel = (appointmentId) => {
    console.log('Canceling appointment:', appointmentId);
  };

  return (
    <div className="user-appointments">
      <header className="appointments-header">
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

      <nav className="appointments-nav">
        <div className="nav-content">
          <button className="nav-btn" onClick={() => navigate('/user-dashboard')}>Overview</button>
          <button className="nav-btn active">Appointments</button>
          <button className="nav-btn" onClick={() => navigate('/book-appointment')}>Book Appointment</button>
          <button className="nav-btn" onClick={() => navigate('/user-bills')}>Bills</button>
        </div>
      </nav>

      <div className="appointments-container">
        <div className="appointments-card">
          <h1>Appointment Management</h1>

          <div className="appointments-section">
            <h2>Current Appointments</h2>
            <p className="section-subtitle">Your scheduled appointments</p>

            <div className="appointments-table-container">
              <table className="appointments-table">
                <thead>
                  <tr>
                    <th>Doctor</th>
                    <th>Department</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentAppointments.map((appointment, index) => (
                    <tr key={index}>
                      <td className="doctor-name">{appointment.doctor}</td>
                      <td>{appointment.department}</td>
                      <td>{appointment.date}</td>
                      <td>{appointment.time}</td>
                      <td>{appointment.reason}</td>
                      <td>
                        <span className={`status ${appointment.status.toLowerCase()}`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="cancel-btn"
                          onClick={() => handleCancel(index)}
                        >
                          CANCEL
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="appointments-section">
            <h2>Past Appointments</h2>
            <p className="section-subtitle">Your Appointment History</p>
            
            <div className="no-appointments">
              <p>No past appointments found</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAppointments;