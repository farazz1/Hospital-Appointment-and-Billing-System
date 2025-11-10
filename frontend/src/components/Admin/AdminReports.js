import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminReports.css';

const AdminReports = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  const stats = [
    { label: 'Total Budget', value: 'S2.6M', icon: '💰' },
    { label: 'Total Staff', value: '60', icon: '👥' },
    { label: 'Active Patients', value: '7', icon: '🏥' },
    { label: 'Departments', value: '8', icon: '🏢' }
  ];

  const budgetData = [
    { dept: 'Cardiology', percentage: '35%' },
    { dept: 'Neurology', percentage: '25%' },
    { dept: 'Pediatrics', percentage: '20%' },
    { dept: 'Emergency', percentage: '20%' }
  ];

  const patientData = [
    { dept: 'Cardiology', count: 45 },
    { dept: 'Neurology', count: 32 },
    { dept: 'Pediatrics', count: 25 },
    { dept: 'Emergency', count: 27 }
  ];

  return (
    <div className="admin-reports">
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
          <button className="nav-btn" onClick={() => navigate('/admin-patients')}>Patients</button>
          <button className="nav-btn active">Reports</button>
        </div>
      </nav>

      <div className="reports-container">
        <div className="reports-card">
          <div className="card-header">
            <div>
              <h1>Reports & Analytics</h1>
              <p>Generate comprehensive reports for hospital operations</p>
            </div>
          </div>

          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-info">
                  <h3>{stat.value}</h3>
                  <p>{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="reports-grid">
            <div className="report-section">
              <h3>Generate Report</h3>
              <div className="form-group">
                <label>Select Report type</label>
                <select className="form-select">
                  <option>Financial Report</option>
                  <option>Patient Report</option>
                  <option>Staff Report</option>
                  <option>Department Report</option>
                </select>
              </div>
              <button className="generate-btn">Generate Report</button>
            </div>

            <div className="report-section">
              <h3>Download Report</h3>
              <button className="download-btn">Download Latest Report</button>
            </div>

            <div className="report-section">
              <h3>Budget Distribution</h3>
              <div className="distribution-list">
                {budgetData.map((item, index) => (
                  <div key={index} className="distribution-item">
                    <span>{item.dept}</span>
                    <span className="percentage">{item.percentage}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="report-section">
              <h3>Patient Distribution</h3>
              <div className="distribution-list">
                {patientData.map((item, index) => (
                  <div key={index} className="distribution-item">
                    <span>{item.dept}</span>
                    <span className="count">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;