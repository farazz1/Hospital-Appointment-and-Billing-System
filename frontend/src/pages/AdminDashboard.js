import React, { useState, useEffect } from 'react';
import { departmentAPI, doctorAPI, patientAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  
  // Department states
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [showEditDepartment, setShowEditDepartment] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [newDepartment, setNewDepartment] = useState({
    name: '', floor: '', maxCapacity: '', headDoctorId: ''
  });

  // Doctor states
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [showEditDoctor, setShowEditDoctor] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [newDoctor, setNewDoctor] = useState({
    name: '', specialization: '', departmentId: '', email: '', phone: '', experience: '', consultationFee: '', status: 'Active'
  });

  // Data states
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [deptsRes, docsRes, patsRes] = await Promise.all([
        departmentAPI.getAll(),
        doctorAPI.getAll(),
        patientAPI.getAll()
      ]);

      setDepartments(deptsRes.data);
      setDoctors(docsRes.data);
      setPatients(patsRes.data);

      // Calculate stats
      setStats({
        totalDepartments: deptsRes.data.length,
        totalDoctors: docsRes.data.length,
        totalPatients: patsRes.data.length,
        activeDoctors: docsRes.data.filter(d => d.status === 'Active').length,
        totalRevenue: deptsRes.data.reduce((sum, dept) => sum + (dept.totalRevenue || 0), 0)
      });

    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Department functions
  const handleAddDepartment = async () => {
    try {
      await departmentAPI.create(newDepartment);
      setShowAddDepartment(false);
      resetDepartmentForm();
      fetchData();
      alert('Department added successfully!');
    } catch (error) {
      console.error('Error adding department:', error);
      alert('Failed to add department');
    }
  };

  const handleEditDepartment = (department) => {
    setEditingDepartment(department);
    setNewDepartment({
      name: department.name,
      floor: department.floor.toString(),
      maxCapacity: department.maxCapacity.toString(),
      headDoctorId: department.headDoctorId || ''
    });
    setShowEditDepartment(true);
  };

  const handleUpdateDepartment = async () => {
    try {
      await departmentAPI.update(editingDepartment.id, newDepartment);
      setShowEditDepartment(false);
      resetDepartmentForm();
      fetchData();
      alert('Department updated successfully!');
    } catch (error) {
      console.error('Error updating department:', error);
      alert('Failed to update department');
    }
  };

  const handleDeleteDepartment = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await departmentAPI.delete(id);
        fetchData();
        alert('Department deleted successfully!');
      } catch (error) {
        console.error('Error deleting department:', error);
        alert(error.response?.data?.message || 'Failed to delete department');
      }
    }
  };

  // Doctor functions
  const handleAddDoctor = async () => {
    try {
      await doctorAPI.create(newDoctor);
      setShowAddDoctor(false);
      resetDoctorForm();
      fetchData();
      alert('Doctor added successfully!');
    } catch (error) {
      console.error('Error adding doctor:', error);
      alert('Failed to add doctor');
    }
  };

  const handleEditDoctor = (doctor) => {
    setEditingDoctor(doctor);
    setNewDoctor({
      name: doctor.name,
      specialization: doctor.specialization,
      departmentId: doctor.departmentId.toString(),
      email: doctor.email,
      phone: doctor.phone,
      experience: doctor.experience.replace(' years', ''),
      consultationFee: doctor.consultationFee.toString(),
      status: doctor.status
    });
    setShowEditDoctor(true);
  };

  const handleUpdateDoctor = async () => {
    try {
      await doctorAPI.update(editingDoctor.id, newDoctor);
      setShowEditDoctor(false);
      resetDoctorForm();
      fetchData();
      alert('Doctor updated successfully!');
    } catch (error) {
      console.error('Error updating doctor:', error);
      alert('Failed to update doctor');
    }
  };

  const handleDeleteDoctor = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await doctorAPI.delete(id);
        fetchData();
        alert('Doctor deleted successfully!');
      } catch (error) {
        console.error('Error deleting doctor:', error);
        alert('Failed to delete doctor');
      }
    }
  };

  // Input handlers
  const handleDepartmentInputChange = (e) => {
    const { name, value } = e.target;
    setNewDepartment(prev => ({ ...prev, [name]: value }));
  };

  const handleDoctorInputChange = (e) => {
    const { name, value } = e.target;
    setNewDoctor(prev => ({ ...prev, [name]: value }));
  };

  // Form reset functions
  const resetDepartmentForm = () => {
    setNewDepartment({ name: '', floor: '', maxCapacity: '', headDoctorId: '' });
    setShowAddDepartment(false);
    setShowEditDepartment(false);
    setEditingDepartment(null);
  };

  const resetDoctorForm = () => {
    setNewDoctor({ name: '', specialization: '', departmentId: '', email: '', phone: '', experience: '', consultationFee: '', status: 'Active' });
    setShowAddDoctor(false);
    setShowEditDoctor(false);
    setEditingDoctor(null);
  };

  const menuItems = [
    { id: 'overview', label: 'Admin Dashboard', icon: '📊' },
    { id: 'departments', label: 'Departments', icon: '🏥' },
    { id: 'doctors', label: 'Doctors', icon: '👨‍⚕️' },
    { id: 'patients', label: 'Patients', icon: '👥' },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  // Rest of the AdminDashboard JSX remains largely the same as your original
  // [Include all the JSX from your original AdminDashboard.js here]
  // Just update the data sources to use the real data from state

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 fixed left-0 top-0 h-full z-50`}>
        <div className="p-6 border-b border-gray-200">
          <h1 className={`font-bold text-xl ${sidebarOpen ? 'block' : 'hidden'}`}>
            Hospital Admin
          </h1>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute top-6 right-4 p-2 rounded-lg hover:bg-gray-100"
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>
        
        <nav className="mt-6">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left transition-colors duration-200 ${
                activeTab === item.id 
                  ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="text-xl mr-3">{item.icon}</span>
              {sidebarOpen && (
                <span className="font-medium">{item.label}</span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className={`flex-1 min-h-screen transition-all duration-300 ${
        sidebarOpen ? 'ml-64' : 'ml-20'
      }`}>
        <div className="p-3 lg:p-4">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-600 mt-1 text-sm lg:text-base">Hospital management system statistics and overview</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Total Departments</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalDepartments}</p>
                    </div>
                    <div className="text-3xl">🏥</div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Total Patients</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
                    </div>
                    <div className="text-3xl">👥</div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Active Doctors</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.activeDoctors}</p>
                    </div>
                    <div className="text-3xl">👨‍⚕️</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-3">Department Statistics</h3>
                  <div className="space-y-3">
                    {departments.map((dept) => (
                      <div key={dept.id} className="flex justify-between items-center py-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-sm">{dept.name}</h4>
                          <p className="text-xs text-gray-600">{dept.staff} staff, {dept.patients} patients</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-900">Floor {dept.floor}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-3">Recent Doctors</h3>
                  <div className="space-y-3">
                    {doctors.slice(0, 5).map((doctor) => (
                      <div key={doctor.id} className="py-2">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-semibold text-gray-900 text-sm">{doctor.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            doctor.status === 'Active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {doctor.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">{doctor.specialization} - {doctor.department}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Departments Tab */}
          {activeTab === 'departments' && (
            <>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Department Management</h1>
                  <p className="text-gray-600 mt-1 text-sm lg:text-base">Manage hospital departments and their details</p>
                </div>
                
                <button 
                  onClick={() => setShowAddDepartment(true)}
                  className="bg-black text-white px-4 py-2 rounded-lg shadow-sm hover:bg-gray-800 transition-colors duration-200 flex items-center"
                >
                  <span className="text-lg mr-2">+</span>
                  <span className="text-sm font-medium">Add Department</span>
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Head</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patients</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Floor</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {departments.map((dept) => (
                        <tr key={dept.id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{dept.name}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{dept.head || 'Not Assigned'}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{dept.staff}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{dept.patients}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{dept.floor}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleEditDepartment(dept)}
                                className="w-8 h-8 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 flex items-center justify-center transition-colors duration-200"
                              >
                                <span className="text-sm">✏️</span>
                              </button>
                              <button 
                                onClick={() => handleDeleteDepartment(dept.id)}
                                className="w-8 h-8 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 flex items-center justify-center transition-colors duration-200"
                              >
                                <span className="text-sm">🗑️</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Doctors Tab */}
          {activeTab === 'doctors' && (
            <>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Doctor Management</h1>
                  <p className="text-gray-600 mt-1 text-sm lg:text-base">Manage doctors and their department assignments</p>
                </div>
                
                <button 
                  onClick={() => setShowAddDoctor(true)}
                  className="bg-black text-white px-4 py-2 rounded-lg shadow-sm hover:bg-gray-800 transition-colors duration-200 flex items-center"
                >
                  <span className="text-lg mr-2">+</span>
                  <span className="text-sm font-medium">Add Doctor</span>
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {doctors.map((doctor) => (
                        <tr key={doctor.id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{doctor.specialization}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{doctor.department}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{doctor.email}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{doctor.phone}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{doctor.experience}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              doctor.status === 'Active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {doctor.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleEditDoctor(doctor)}
                                className="w-8 h-8 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 flex items-center justify-center transition-colors duration-200"
                              >
                                <span className="text-sm">✏️</span>
                              </button>
                              <button 
                                onClick={() => handleDeleteDoctor(doctor.id)}
                                className="w-8 h-8 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 flex items-center justify-center transition-colors duration-200"
                              >
                                <span className="text-sm">🗑️</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Patients Tab */}
          {activeTab === 'patients' && (
            <>
              <div className="mb-4">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Patient Records</h1>
                <p className="text-gray-600 mt-1 text-sm lg:text-base">View all patient records and their status</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Type</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {patients.map((patient) => (
                        <tr key={patient.id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{patient.age}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{patient.gender}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{patient.email}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{patient.phone}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{patient.bloodType}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Add/Edit Department Modal */}
          {(showAddDepartment || showEditDepartment) && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {showEditDepartment ? 'Edit Department' : 'Add New Department'}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={newDepartment.name}
                      onChange={handleDepartmentInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter department name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Floor
                      </label>
                      <input
                        type="number"
                        name="floor"
                        value={newDepartment.floor}
                        onChange={handleDepartmentInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Capacity
                      </label>
                      <input
                        type="number"
                        name="maxCapacity"
                        value={newDepartment.maxCapacity}
                        onChange={handleDepartmentInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="10"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={resetDepartmentForm}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={showEditDepartment ? handleUpdateDepartment : handleAddDepartment}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    {showEditDepartment ? 'Update Department' : 'Add Department'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add/Edit Doctor Modal */}
          {(showAddDoctor || showEditDoctor) && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {showEditDoctor ? 'Edit Doctor' : 'Add New Doctor'}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={newDoctor.name}
                      onChange={handleDoctorInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter doctor name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Specialization
                    </label>
                    <input
                      type="text"
                      name="specialization"
                      value={newDoctor.specialization}
                      onChange={handleDoctorInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter specialization"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    <select
                      name="departmentId"
                      value={newDoctor.departmentId}
                      onChange={handleDoctorInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={newDoctor.email}
                        onChange={handleDoctorInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter email"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={newDoctor.phone}
                        onChange={handleDoctorInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter phone"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Experience (years)
                      </label>
                      <input
                        type="number"
                        name="experience"
                        value={newDoctor.experience}
                        onChange={handleDoctorInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="5"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Consultation Fee ($)
                      </label>
                      <input
                        type="number"
                        name="consultationFee"
                        value={newDoctor.consultationFee}
                        onChange={handleDoctorInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="150"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={newDoctor.status}
                      onChange={handleDoctorInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Active">Active</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={resetDoctorForm}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={showEditDoctor ? handleUpdateDoctor : handleAddDoctor}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    {showEditDoctor ? 'Update Doctor' : 'Add Doctor'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;