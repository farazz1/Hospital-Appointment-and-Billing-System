import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDoctors.css';

const AdminDoctors = () => {
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    specialization: '',
    department: '',
    status: 'Active',
    fee: ''
  });

  const handleLogout = () => {
    navigate('/');
  };

  const handleAddDoctor = () => {
    setIsAddModalOpen(true);
  };

  const handleSubmitDoctor = (e) => {
    e.preventDefault();
    // This will be connected to backend later
    console.log('New doctor:', newDoctor);
    alert('Doctor added successfully (backend integration required)');
    setIsAddModalOpen(false);
    setNewDoctor({ name: '', specialization: '', department: '', status: 'Active', fee: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDoctor(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const doctors = [
    { name: 'Doctor W', specialization: 'Cardio', department: 'Cardiology', status: 'Active', fee: '$45K' },
    { name: 'Doctor X', specialization: 'Neurologist', department: 'Neurology', status: 'Active', fee: '$90K' },
    { name: 'Doctor Y', specialization: 'Emergency', department: 'Emergency', status: 'On leave', fee: '$68K' },
    { name: 'Doctor Z', specialization: 'Cardio', department: 'Cardiology', status: 'Active', fee: '$79K' }
  ];

  const departments = ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Emergency'];
  const specializations = ['Cardio', 'Neurologist', 'Pediatrician', 'Orthopedic', 'Emergency', 'Surgeon'];

  return (
    <div className="admin-doctors">
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
          <button className="nav-btn active">Doctors</button>
          <button className="nav-btn" onClick={() => navigate('/admin-patients')}>Patients</button>
          <button className="nav-btn" onClick={() => navigate('/admin-reports')}>Reports</button>
        </div>
      </nav>

      <div className="doctors-container">
        <div className="doctors-card">
          <div className="card-header">
            <div>
              <h1>Doctor Management</h1>
              <p>Manage doctors and their department assignments.</p>
            </div>
            <button className="add-btn" onClick={handleAddDoctor}>+ Add Doctor</button>
          </div>

          <div className="table-container">
            <table className="doctors-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Specialization</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Fee</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doctor, index) => (
                  <tr key={index}>
                    <td className="doctor-name">{doctor.name}</td>
                    <td>{doctor.specialization}</td>
                    <td>{doctor.department}</td>
                    <td>
                      <span className={`status ${doctor.status.toLowerCase().replace(' ', '-')}`}>
                        {doctor.status}
                      </span>
                    </td>
                    <td className="fee">{doctor.fee}</td>
                    <td>
                      <button className="action-btn">💬</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Doctor Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Doctor</h2>
              <button className="close-btn" onClick={() => setIsAddModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleSubmitDoctor} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Doctor Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={newDoctor.name}
                    onChange={handleInputChange}
                    placeholder="Dr. John Smith"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Specialization *</label>
                  <select
                    name="specialization"
                    value={newDoctor.specialization}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Specialization</option>
                    {specializations.map((spec, index) => (
                      <option key={index} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Department *</label>
                  <select
                    name="department"
                    value={newDoctor.department}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept, index) => (
                      <option key={index} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Status *</label>
                  <select
                    name="status"
                    value={newDoctor.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Active">Active</option>
                    <option value="On leave">On leave</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Fee *</label>
                  <input
                    type="text"
                    name="fee"
                    value={newDoctor.fee}
                    onChange={handleInputChange}
                    placeholder="$50K"
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Add Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDoctors;