import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPatients.css';

const AdminPatients = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    navigate('/');
  };

  const patients = [
    { name: 'John Smith', age: 45, gender: 'M', department: 'Cardiology', condition: 'Heart attack', doctor: 'Dr. Michael', status: 'Admitted' },
    { name: 'Frank Williams', age: 16, gender: 'M', department: 'Orthopedics', condition: 'Broken Femur', doctor: 'Dr. James', status: 'Admitted' },
    { name: 'Jeeseph', age: 6, gender: 'M', department: 'Emergency', condition: 'Trauma', doctor: 'Dr. Emily', status: 'Discharged' },
    { name: 'Mary White', age: 19, gender: 'F', department: 'Pediatrics', condition: 'Asthma', doctor: 'Dr. Lisa', status: 'Admitted' },
    { name: 'Sue Neh', age: 24, gender: 'F', department: 'Neurology', condition: 'Migraine', doctor: 'Dr. Michael', status: 'Critical' }
  ];

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-patients">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Hospital Management System</h1>
          <div className="admin-menu">
            <div className="admin-profile" onClick={() => navigate('/admin-dashboard')}>
              <div className="admin-avatar">A</div>
              <div className="admin-details">
                <span className="admin-name">Administrator</span>
                <span className="admin-email">admin@gmail.com</span>
              </div>
            </div>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </header>

      <nav className="dashboard-nav">
        <div className="nav-content">
          <button className="nav-btn" onClick={() => navigate('/admin-dashboard')}>Dashboard</button>
          <button className="nav-btn" onClick={() => navigate('/admin-departments')}>Departments</button>
          <button className="nav-btn" onClick={() => navigate('/admin-doctors')}>Doctors</button>
          <button className="nav-btn active">Patients</button>
          <button className="nav-btn" onClick={() => navigate('/admin-reports')}>Reports</button>
        </div>
      </nav>

      <div className="patients-container">
        <div className="patients-card">
          <div className="card-header">
            <div>
              <h1>Patients Record</h1>
              <p>View all patient records and their status.</p>
            </div>
            <div className="search-box">
              <input
                type="text"
                placeholder="Search patients by name or condition..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="table-container">
            <table className="patients-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Department</th>
                  <th>Condition</th>
                  <th>Assigned Doctor</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient, index) => (
                  <tr key={index}>
                    <td className="patient-name">{patient.name}</td>
                    <td>{patient.age}</td>
                    <td>{patient.gender}</td>
                    <td>{patient.department}</td>
                    <td>{patient.condition}</td>
                    <td>{patient.doctor}</td>
                    <td>
                      <span className={`status ${patient.status.toLowerCase()}`}>
                        {patient.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="patient-details">
            <h3>Patient Record</h3>
            <div className="details-grid">
              <div className="detail-item">
                <label>Patient's Report</label>
                <span>Cardiac Analysis Report</span>
              </div>
              <div className="detail-item">
                <label>Patient's Date</label>
                <span>10/29/2025</span>
              </div>
              <div className="detail-item">
                <label>Patient's Time</label>
                <span>09:00 AM</span>
              </div>
              <div className="detail-item">
                <label>Patient's Date</label>
                <span>10/29/2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPatients;