import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BookAppointment.css';

const BookAppointment = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    doctor: '',
    date: '',
    time: '',
    reason: ''
  });

  const handleLogout = () => {
    navigate('/');
  };

  const doctors = [
    'Dr. Sarah Johnson - Cardiology',
    'Dr. Michael Chen - Neurology',
    'Dr. Emily Davis - Pediatrics',
    'Dr. James Wilson - Orthopedics'
  ];

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Booking appointment:', formData);
    navigate('/user-appointments');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="book-appointment">
      <header className="appointment-header">
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

      <div className="appointment-container">
        <div className="appointment-card">
          <h1>Book New Appointment</h1>
          <p className="appointment-subtitle">Schedule an appointment with a doctor</p>

          <form onSubmit={handleSubmit} className="appointment-form">
            <div className="form-row">
              <div className="form-group">
                <label>Select Doctor</label>
                <select
                  name="doctor"
                  value={formData.doctor}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Choose a doctor</option>
                  {doctors.map((doctor, index) => (
                    <option key={index} value={doctor}>{doctor}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Select Time</label>
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Choose time slot</option>
                  {timeSlots.map((time, index) => (
                    <option key={index} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Select Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="form-input"
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="form-group">
              <label>Reason for visit:</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Describe your symptoms or reason for visit"
                className="form-textarea"
                rows="4"
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="book-btn">
                Book Appointment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;