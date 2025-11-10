import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  const stats = [
    { label: 'Total Departments', value: '5', icon: '🏢' },
    { label: 'Active Doctors', value: '7', icon: '👨‍⚕️' },
    { label: 'Total Patients', value: '8', icon: '👥' },
    { label: 'Admitted Patients', value: '6', icon: '🏥' },
    { label: 'Critical Cases', value: '2', icon: '⚠️' },
    { label: 'Total Budget', value: '$2.4M', icon: '💰' }
  ];

  const departments = [
    { name: 'Cardiology', staff: 15, patients: 45, budget: '$500K' },
    { name: 'Neurology', staff: 20, patients: 30, budget: '$450K' },
    { name: 'Pediatrics', staff: 19, patients: 51, budget: '$380K' },
    { name: 'Orthopedics', staff: 10, patients: 45, budget: '$560K' },
    { name: 'Emergency', staff: 45, patients: 79, budget: '$610K' }
  ];

  const activities = [
    { patient: 'John Smith', doctor: 'Dr. Sarah', status: 'Discharged' },
    { patient: 'Tommy Lee', doctor: 'Dr. Johns', status: 'Admitted' },
    { patient: 'Dan Brown', doctor: 'Dr. Asim', status: 'Critical' },
    { patient: 'William Joe', doctor: 'Dr. Frank', status: 'Admitted' },
    { patient: 'Robert Jacks', doctor: 'Dr. Sarah', status: 'Discharged' }
  ];

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Hospital Management System</h1>
          <div className="admin-menu">
            <div className="admin-profile">
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
          <button className="nav-btn active">Dashboard</button>
          <button className="nav-btn" onClick={() => navigate('/admin-departments')}>Departments</button>
          <button className="nav-btn" onClick={() => navigate('/admin-doctors')}>Doctors</button>
          <button className="nav-btn" onClick={() => navigate('/admin-patients')}>Patients</button>
          <button className="nav-btn" onClick={() => navigate('/admin-reports')}>Reports</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <h2>Dashboard Overview</h2>
        <p className="section-subtitle">System statistics and overview</p>

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

        <div className="dashboard-grid">
          <div className="info-card">
            <h3>Department Statistics</h3>
            <div className="departments-list">
              {departments.map((dept, index) => (
                <div key={index} className="department-item">
                  <div className="dept-info">
                    <h4>{dept.name}</h4>
                    <p>{dept.staff} staff, {dept.patients} patients</p>
                  </div>
                  <div className="dept-budget">{dept.budget}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="info-card">
            <h3>Recent Activity</h3>
            <div className="activities-list">
              {activities.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-info">
                    <h4>{activity.patient}</h4>
                    <p>Assigned to {activity.doctor}</p>
                  </div>
                  <span className={`status ${activity.status.toLowerCase()}`}>
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;