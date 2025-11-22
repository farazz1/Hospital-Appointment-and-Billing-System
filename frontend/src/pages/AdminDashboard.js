import React, { useState } from 'react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Department states
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [showEditDepartment, setShowEditDepartment] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [newDepartment, setNewDepartment] = useState({
    name: '', head: '', staff: '', patients: '', budget: '', floor: ''
  });

  // Doctor states
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [showEditDoctor, setShowEditDoctor] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [newDoctor, setNewDoctor] = useState({
    name: '', specialization: '', department: '', email: '', phone: '', experience: '', status: 'Active'
  });

  // Patient states
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Report states
  const [selectedReportType, setSelectedReportType] = useState('Financial Report');

  // Dashboard Data
  const stats = [
    { name: 'Total Departments', value: '5', icon: '🏥' },
    { name: 'Admitted Patients', value: '7', icon: '🏨' },
    { name: 'Active Doctors', value: '7', icon: '👨‍⚕️' },
    { name: 'Critical Cases', value: '2', icon: '🚨' },
    { name: 'Total Patients', value: '8', icon: '👥' },
    { name: 'Total Budget', value: '$2.4M', icon: '💰' },
  ];

  const departmentStats = [
    { name: 'Cardiology', staff: '15 staff', patients: '45 patients', budget: '$500K' },
    { name: 'Neurology', staff: '12 staff', patients: '32 patients', budget: '$450K' },
    { name: 'Pediatrics', staff: '33 staff', patients: '35 patients', budget: '$380K' },
    { name: 'Orthopedics', staff: '18 staff', patients: '28 patients', budget: '$420K' },
    { name: 'Emergency', staff: '25 staff', patients: '67 patients', budget: '$550K' },
  ];

  const recentActivities = [
    { patient: 'John Smith', action: 'Assigned to Dr. Sarah Johnson', status: 'Admitted' },
    { patient: 'Mary Johnson', action: 'Assigned to Dr. Michael Chen', status: 'Critical' },
    { patient: 'Tommy Lee', action: '3 staff, 11 patients', status: 'Admitted' },
    { patient: 'Robert Brown', action: 'Discharged from Cardiology', status: 'Completed' },
    { patient: 'Sarah Wilson', action: 'Lab tests completed', status: 'Pending' },
  ];

  // Reports Data
  const reportStats = [
    { name: 'Total Budget', value: '$2.35M', icon: '💰' },
    { name: 'Total Staff', value: '80', icon: '👥' },
    { name: 'Active Patients', value: '7', icon: '🏨' },
    { name: 'Departments', value: '5', icon: '🏥' },
  ];

  const reportTypes = [
    'Financial Report',
    'Staff Report', 
    'Patient Report',
    'Department Report'
  ];

  // Departments Data with state
  const [departmentsData, setDepartmentsData] = useState([
    { id: 1, name: 'Cardiology', head: 'Dr. Sarah Johnson', staff: 15, patients: 45, budget: '$500,000', floor: 3 },
    { id: 2, name: 'Neurology', head: 'Dr. Michael Chen', staff: 12, patients: 32, budget: '$450,000', floor: 4 },
    { id: 3, name: 'Pediatrics', head: 'Dr. Emily Williams', staff: 18, patients: 58, budget: '$380,000', floor: 2 },
    { id: 4, name: 'Orthopedics', head: 'Dr. James Martinez', staff: 10, patients: 28, budget: '$420,000', floor: 5 },
    { id: 5, name: 'Emergency', head: 'Dr. Rachel Green', staff: 25, patients: 72, budget: '$600,000', floor: 1 },
  ]);

  // Doctors Data with state
  const [doctorsData, setDoctorsData] = useState([
    { id: 1, name: 'Dr. Sarah Johnson', specialization: 'Cardiologist', department: 'Cardiology', email: 'sarah.j@hospital.com', phone: '555-0101', experience: '15 years', status: 'Active' },
    { id: 2, name: 'Dr. Michael Chen', specialization: 'Neurologist', department: 'Neurology', email: 'michael.c@hospital.com', phone: '555-0102', experience: '12 years', status: 'Active' },
    { id: 3, name: 'Dr. Emily Williams', specialization: 'Pediatrician', department: 'Pediatrics', email: 'emily.w@hospital.com', phone: '555-0103', experience: '10 years', status: 'Active' },
    { id: 4, name: 'Dr. James Martinez', specialization: 'Orthopedic Surgeon', department: 'Orthopedics', email: 'james.m@hospital.com', phone: '555-0104', experience: '18 years', status: 'Active' },
    { id: 5, name: 'Dr. Rachel Green', specialization: 'Emergency Medicine', department: 'Emergency', email: 'rachel.g@hospital.com', phone: '555-0105', experience: '8 years', status: 'Active' },
    { id: 6, name: 'Dr. David Park', specialization: 'Cardiologist', department: 'Cardiology', email: 'david.p@hospital.com', phone: '555-0106', experience: '7 years', status: 'Active' },
    { id: 7, name: 'Dr. Lisa Anderson', specialization: 'Pediatrician', department: 'Pediatrics', email: 'lisa.a@hospital.com', phone: '555-0107', experience: '5 years', status: 'On Leave' },
    { id: 8, name: 'Dr. Robert Taylor', specialization: 'Neurologist', department: 'Neurology', email: 'robert.t@hospital.com', phone: '555-0108', experience: '14 years', status: 'Active' },
  ]);

  // Patients Data with state
  const [patientsData, setPatientsData] = useState([
    { id: 1, name: 'John Smith', age: 45, gender: 'Male', department: 'Cardiology', condition: 'Acute Myocardial Infarction', assignedDoctor: 'Dr. Sarah Johnson', admissionDate: '2025-10-20', status: 'Admitted' },
    { id: 2, name: 'Mary Johnson', age: 62, gender: 'Female', department: 'Neurology', condition: 'Stroke', assignedDoctor: 'Dr. Michael Chen', admissionDate: '2025-10-18', status: 'Critical' },
    { id: 3, name: 'Tommy Lee', age: 8, gender: 'Male', department: 'Pediatrics', condition: 'Pneumonia', assignedDoctor: 'Dr. Emily Williams', admissionDate: '2025-10-22', status: 'Admitted' },
    { id: 4, name: 'Sarah Williams', age: 35, gender: 'Female', department: 'Orthopedics', condition: 'Fractured Femur', assignedDoctor: 'Dr. James Martinez', admissionDate: '2025-10-15', status: 'Discharged' },
    { id: 5, name: 'Robert Brown', age: 28, gender: 'Male', department: 'Emergency', condition: 'Trauma', assignedDoctor: 'Dr. Rachel Green', admissionDate: '2025-10-24', status: 'Critical' },
    { id: 6, name: 'Emma Davis', age: 5, gender: 'Female', department: 'Pediatrics', condition: 'Asthma Attack', assignedDoctor: 'Dr. Lisa Anderson', admissionDate: '2025-10-23', status: 'Admitted' },
    { id: 7, name: 'Michael Wilson', age: 55, gender: 'Male', department: 'Cardiology', condition: 'Arrhythmia', assignedDoctor: 'Dr. David Park', admissionDate: '2025-10-21', status: 'Admitted' },
    { id: 8, name: 'Jennifer Martinez', age: 41, gender: 'Female', department: 'Neurology', condition: 'Migraine', assignedDoctor: 'Dr. Robert Taylor', admissionDate: '2025-10-19', status: 'Admitted' },
  ]);

  const menuItems = [
    { id: 'overview', label: 'Admin Dashboard', icon: '📊' },
    { id: 'departments', label: 'Departments', icon: '🏥' },
    { id: 'doctors', label: 'Doctors', icon: '👨‍⚕️' },
    { id: 'patients', label: 'Patients', icon: '👥' },
    { id: 'reports', label: 'Reports', icon: '📋' },
  ];

  // Filter patients based on search and filters
  const filteredPatients = patientsData.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         patient.condition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'All' || patient.department === departmentFilter;
    const matchesStatus = statusFilter === 'All' || patient.status === statusFilter;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Get unique departments and statuses for filters
  const departments = ['All', ...new Set(patientsData.map(patient => patient.department))];
  const statuses = ['All', ...new Set(patientsData.map(patient => patient.status))];

  // Report functions
  const handleDownloadReport = () => {
    // Simulate report download
    alert(`Downloading ${selectedReportType}...`);
    // In a real application, this would generate and download the actual report
    console.log(`Generating ${selectedReportType} for download`);
  };

  // Department functions
  const handleAddDepartment = () => {
    if (newDepartment.name && newDepartment.head) {
      const department = {
        id: departmentsData.length + 1,
        name: newDepartment.name,
        head: newDepartment.head,
        staff: parseInt(newDepartment.staff) || 0,
        patients: parseInt(newDepartment.patients) || 0,
        budget: `$${parseInt(newDepartment.budget).toLocaleString()}`,
        floor: parseInt(newDepartment.floor) || 1
      };
      
      setDepartmentsData([...departmentsData, department]);
      resetDepartmentForm();
    }
  };

  const handleEditDepartment = (department) => {
    setEditingDepartment(department);
    const budgetValue = department.budget.replace('$', '').replace(/,/g, '');
    setNewDepartment({
      name: department.name,
      head: department.head,
      staff: department.staff.toString(),
      patients: department.patients.toString(),
      budget: budgetValue,
      floor: department.floor.toString()
    });
    setShowEditDepartment(true);
  };

  const handleUpdateDepartment = () => {
    if (newDepartment.name && newDepartment.head && editingDepartment) {
      const updatedDepartment = {
        ...editingDepartment,
        name: newDepartment.name,
        head: newDepartment.head,
        staff: parseInt(newDepartment.staff) || 0,
        patients: parseInt(newDepartment.patients) || 0,
        budget: `$${parseInt(newDepartment.budget).toLocaleString()}`,
        floor: parseInt(newDepartment.floor) || 1
      };
      
      setDepartmentsData(departmentsData.map(dept => 
        dept.id === editingDepartment.id ? updatedDepartment : dept
      ));
      resetDepartmentForm();
    }
  };

  const handleDeleteDepartment = (id) => {
    setDepartmentsData(departmentsData.filter(dept => dept.id !== id));
  };

  // Doctor functions
  const handleAddDoctor = () => {
    if (newDoctor.name && newDoctor.specialization && newDoctor.department) {
      const doctor = {
        id: doctorsData.length + 1,
        name: newDoctor.name,
        specialization: newDoctor.specialization,
        department: newDoctor.department,
        email: newDoctor.email,
        phone: newDoctor.phone,
        experience: newDoctor.experience,
        status: newDoctor.status
      };
      
      setDoctorsData([...doctorsData, doctor]);
      resetDoctorForm();
    }
  };

  const handleEditDoctor = (doctor) => {
    setEditingDoctor(doctor);
    setNewDoctor({
      name: doctor.name,
      specialization: doctor.specialization,
      department: doctor.department,
      email: doctor.email,
      phone: doctor.phone,
      experience: doctor.experience,
      status: doctor.status
    });
    setShowEditDoctor(true);
  };

  const handleUpdateDoctor = () => {
    if (newDoctor.name && newDoctor.specialization && newDoctor.department && editingDoctor) {
      const updatedDoctor = {
        ...editingDoctor,
        name: newDoctor.name,
        specialization: newDoctor.specialization,
        department: newDoctor.department,
        email: newDoctor.email,
        phone: newDoctor.phone,
        experience: newDoctor.experience,
        status: newDoctor.status
      };
      
      setDoctorsData(doctorsData.map(doctor => 
        doctor.id === editingDoctor.id ? updatedDoctor : doctor
      ));
      resetDoctorForm();
    }
  };

  const handleDeleteDoctor = (id) => {
    setDoctorsData(doctorsData.filter(doctor => doctor.id !== id));
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
    setNewDepartment({ name: '', head: '', staff: '', patients: '', budget: '', floor: '' });
    setShowAddDepartment(false);
    setShowEditDepartment(false);
    setEditingDepartment(null);
  };

  const resetDoctorForm = () => {
    setNewDoctor({ name: '', specialization: '', department: '', email: '', phone: '', experience: '', status: 'Active' });
    setShowAddDoctor(false);
    setShowEditDoctor(false);
    setEditingDoctor(null);
  };

  // Render different content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
              <p className="text-gray-600 mt-1 text-sm lg:text-base">Hospital management system statistics and overview</p>
            </div>

            {/* 6 Stats Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {stats.map((stat, index) => (
                <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className="text-3xl">{stat.icon}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Two Larger Boxes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-3">Department Statistics</h3>
                <div className="space-y-3">
                  {departmentStats.map((dept, index) => (
                    <div key={index} className="flex justify-between items-center py-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm">{dept.name}</h4>
                        <p className="text-xs text-gray-600">{dept.staff}, {dept.patients}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{dept.budget}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-3">Recent Activity</h3>
                <div className="space-y-3">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="py-2">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-gray-900 text-sm">{activity.patient}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          activity.status === 'Critical' 
                            ? 'bg-red-100 text-red-800' 
                            : activity.status === 'Completed'
                            ? 'bg-blue-100 text-blue-800'
                            : activity.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {activity.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">{activity.action}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        );

      case 'departments':
        return (
          <>
            {/* Header with Add Button */}
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

            {/* Departments Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Head</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patients</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Floor</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {departmentsData.map((dept) => (
                      <tr key={dept.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{dept.name}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{dept.head}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{dept.staff}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{dept.patients}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{dept.budget}</div>
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

            {/* Add/Edit Department Popup */}
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Department Head
                      </label>
                      <input
                        type="text"
                        name="head"
                        value={newDepartment.head}
                        onChange={handleDepartmentInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter department head"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Staff Count
                        </label>
                        <input
                          type="number"
                          name="staff"
                          value={newDepartment.staff}
                          onChange={handleDepartmentInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Patient Count
                        </label>
                        <input
                          type="number"
                          name="patients"
                          value={newDepartment.patients}
                          onChange={handleDepartmentInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Budget ($)
                        </label>
                        <input
                          type="number"
                          name="budget"
                          value={newDepartment.budget}
                          onChange={handleDepartmentInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0"
                        />
                      </div>

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
          </>
        );

      case 'doctors':
        return (
          <>
            {/* Header with Add Button */}
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

            {/* Doctors Table */}
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
                    {doctorsData.map((doctor) => (
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

            {/* Add/Edit Doctor Popup */}
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
                        name="department"
                        value={newDoctor.department}
                        onChange={handleDoctorInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Department</option>
                        <option value="Cardiology">Cardiology</option>
                        <option value="Neurology">Neurology</option>
                        <option value="Pediatrics">Pediatrics</option>
                        <option value="Orthopedics">Orthopedics</option>
                        <option value="Emergency">Emergency</option>
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
                          Experience
                        </label>
                        <input
                          type="text"
                          name="experience"
                          value={newDoctor.experience}
                          onChange={handleDoctorInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., 5 years"
                        />
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
          </>
        );

      case 'patients':
        return (
          <>
            {/* Header */}
            <div className="mb-4">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Patient Records</h1>
              <p className="text-gray-600 mt-1 text-sm lg:text-base">View all patient records and their status</p>
            </div>

            {/* Search and Filter Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search Bar */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Patients
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search patients by name or condition..."
                  />
                </div>

                {/* Department Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Department
                  </label>
                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Patients Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Doctor</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admission Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPatients.map((patient) => (
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
                          <div className="text-sm text-gray-900">{patient.department}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{patient.condition}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{patient.assignedDoctor}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{patient.admissionDate}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            patient.status === 'Admitted' 
                              ? 'bg-blue-100 text-blue-800' 
                              : patient.status === 'Critical'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {patient.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        );

      case 'reports':
        return (
          <>
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Reports & Analytics</h1>
              <p className="text-gray-600 mt-1 text-sm lg:text-base">Generate comprehensive reports for hospital operations</p>
            </div>

            {/* 4 Stats Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {reportStats.map((stat, index) => (
                <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className="text-3xl">{stat.icon}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Horizontal Line */}
            <div className="border-t border-gray-200 my-6"></div>

            {/* Generate Report Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-6">Generate Report</h3>
              
              <div className="w-full">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Report Type
                  </label>
                  <select
                    value={selectedReportType}
                    onChange={(e) => setSelectedReportType(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                  >
                    {reportTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleDownloadReport}
                  className="w-full bg-black text-white px-6 py-3 rounded-lg shadow-sm hover:bg-gray-800 transition-colors duration-200 font-medium text-base"
                >
                  Download Report
                </button>
              </div>
            </div>
          </>
        );

      default:
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
            <p className="text-gray-600">The requested page could not be found.</p>
          </div>
        );
    }
  };

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

      {/* Main Content - Reduced padding to move content closer to sidebar */}
      <div className={`flex-1 min-h-screen transition-all duration-300 ${
        sidebarOpen ? 'ml-64' : 'ml-20'
      }`}>
        <div className="p-3 lg:p-4">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;