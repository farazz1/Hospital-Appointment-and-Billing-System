import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDepartments.css';

const AdminDepartments = () => {
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    head: '',
    staff: '',
    patients: '',
    budget: '',
    floor: ''
  });

  const handleLogout = () => {
    navigate('/');
  };

  const handleAddDepartment = () => {
    setIsAddModalOpen(true);
  };

  const handleSubmitDepartment = (e) => {
    e.preventDefault();
    // This will be connected to backend later
    console.log('New department:', newDepartment);
    alert('Department added successfully (backend integration required)');
    setIsAddModalOpen(false);
    setNewDepartment({ name: '', head: '', staff: '', patients: '', budget: '', floor: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDepartment(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const departments = [
    { name: 'Cardiology', head: 'Dr X', staff: 15, patients: 26, budget: '$500,105', floor: 3 },
    { name: 'Orthopedics', head: 'Dr X', staff: 13, patients: 23, budget: '$500,105', floor: 2 },
    { name: 'Emergency', head: 'Dr X', staff: 21, patients: 65, budget: '$500,105', floor: 3 },
    { name: 'Pediatrics', head: 'Dr X', staff: 24, patients: 36, budget: '$500,105', floor: 4 },
    { name: 'Neurology', head: 'Dr X', staff: 32, patients: 29, budget: '$500,105', floor: 1 },
    { name: 'ICU', head: 'Dr X', staff: 18, patients: 13, budget: '$500,105', floor: 4 }
  ];

  return (
    <div className="admin-departments">
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
          <button className="nav-btn active">Departments</button>
          <button className="nav-btn" onClick={() => navigate('/admin-doctors')}>Doctors</button>
          <button className="nav-btn" onClick={() => navigate('/admin-patients')}>Patients</button>
          <button className="nav-btn" onClick={() => navigate('/admin-reports')}>Reports</button>
        </div>
      </nav>

      <div className="departments-container">
        <div className="departments-card">
          <div className="card-header">
            <div>
              <h1>Department Management</h1>
              <p>Manage hospital departments and their details.</p>
            </div>
            <button className="add-btn" onClick={handleAddDepartment}>+ Add Department</button>
          </div>

          <div className="table-container">
            <table className="departments-table">
              <thead>
                <tr>
                  <th>Department Name</th>
                  <th>Head</th>
                  <th>Staff</th>
                  <th>Patients</th>
                  <th>Budget</th>
                  <th>Floor</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept, index) => (
                  <tr key={index}>
                    <td className="dept-name">{dept.name}</td>
                    <td>{dept.head}</td>
                    <td>{dept.staff}</td>
                    <td>{dept.patients}</td>
                    <td className="budget">{dept.budget}</td>
                    <td>{dept.floor}</td>
                    <td>
                      <button className="action-btn">✓</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Department Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Department</h2>
              <button className="close-btn" onClick={() => setIsAddModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleSubmitDepartment} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Department Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={newDepartment.name}
                    onChange={handleInputChange}
                    placeholder="Cardiology"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Department Head *</label>
                  <input
                    type="text"
                    name="head"
                    value={newDepartment.head}
                    onChange={handleInputChange}
                    placeholder="Dr. Smith"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Staff Count *</label>
                  <input
                    type="number"
                    name="staff"
                    value={newDepartment.staff}
                    onChange={handleInputChange}
                    placeholder="15"
                    min="1"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Patient Count *</label>
                  <input
                    type="number"
                    name="patients"
                    value={newDepartment.patients}
                    onChange={handleInputChange}
                    placeholder="26"
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Budget *</label>
                  <input
                    type="text"
                    name="budget"
                    value={newDepartment.budget}
                    onChange={handleInputChange}
                    placeholder="$500,000"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Floor *</label>
                  <input
                    type="number"
                    name="floor"
                    value={newDepartment.floor}
                    onChange={handleInputChange}
                    placeholder="3"
                    min="1"
                    max="10"
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Add Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDepartments;