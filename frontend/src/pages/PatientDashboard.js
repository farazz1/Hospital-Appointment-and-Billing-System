import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { patientAPI, appointmentAPI, billAPI, doctorAPI, prescriptionAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [patientData, setPatientData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    bloodType: '',
    address: '',
    emergencyContact: '',
    medicalHistory: ''
  });
  
  // Book Appointment States
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  // Prescription Viewing States
  const [viewingPrescription, setViewingPrescription] = useState(null);
  const [showViewPrescriptionModal, setShowViewPrescriptionModal] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      fetchPatientData(user.profileId);
      fetchAppointments(user.profileId);
      fetchBills(user.profileId);
      fetchDoctors();
    }
  }, []);

const fetchPatientData = async (patientId) => {
  try {
    setLoading(true);
    
    // Try the debug endpoint first
    const response = await axios.get(`http://localhost:5000/api/patients/${patientId}/debug`);
    
    // Or if you want to keep using your API service:
    // const response = await patientAPI.getById(patientId);
    
    setPatientData(response.data);
    setEditFormData(response.data);
    console.log('✅ Patient data loaded:', response.data);
  } catch (error) {
    console.error('Error fetching patient data:', error);
    alert('Failed to load patient data');
  } finally {
    setLoading(false);
  }
};

  const fetchAppointments = async (patientId) => {
    try {
      const response = await appointmentAPI.getAll({ patientId });
      
      console.log('Appointments API Response:', response);
      console.log('Response data:', response.data);
      
      let allAppointments = [];
      
      // Handle the actual response structure from your backend
      if (response.data && Array.isArray(response.data.appointments)) {
        // Case: { appointments: [], doctorProfile: {} }
        allAppointments = response.data.appointments;
      } else if (Array.isArray(response.data)) {
        // Case: Direct array response (fallback)
        allAppointments = response.data;
      } else {
        console.warn('Unexpected appointments response structure:', response.data);
        allAppointments = [];
      }
      
      console.log('Processed appointments:', allAppointments);
      
      // Now safely filter the appointments
      const scheduledAppointments = allAppointments.filter(apt => 
        apt && apt.status === 'Scheduled'
      );
      const pastAppointments = allAppointments.filter(apt => 
        apt && apt.status !== 'Scheduled'
      );
      
      setAppointments(scheduledAppointments);
      setPastAppointments(pastAppointments);
      
    } catch (error) {
      console.error('Error fetching appointments:', error);
      console.error('Error details:', error.response?.data);
      
      // Set empty arrays on error
      setAppointments([]);
      setPastAppointments([]);
      alert('Failed to load appointments');
    }
  };

  const fetchBills = async (patientId) => {
    try {
      const response = await billAPI.getAll({ patientId });
      
      console.log('Bills API Response:', response);
      console.log('Response data:', response.data);
      
      let billsData = [];
      
      // Handle different possible response structures
      if (Array.isArray(response.data)) {
        billsData = response.data;
      } else if (response.data && Array.isArray(response.data.bills)) {
        billsData = response.data.bills;
      } else if (response.data && Array.isArray(response.data.data)) {
        billsData = response.data.data;
      } else {
        console.warn('Unexpected bills response structure:', response.data);
        billsData = [];
      }
      
      console.log('Processed bills:', billsData);
      setBills(billsData);
      
    } catch (error) {
      console.error('Error fetching bills:', error);
      console.error('Error details:', error.response?.data);
      setBills([]);
      alert('Failed to load bills');
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await doctorAPI.getAll();
      setAvailableDoctors(response.data);
      
      // Default time slots
      const timeSlots = [
        '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
        '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
        '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
      ];
      setAvailableTimeSlots(timeSlots);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      alert('Failed to load doctors');
    }
  };

  // Prescription Viewing Functions
  const handleViewPrescription = async (appointment) => {
    try {
      const response = await prescriptionAPI.getByAppointment(appointment.id);
      setViewingPrescription(response.data);
      setShowViewPrescriptionModal(true);
    } catch (error) {
      console.error('Error fetching prescription:', error);
      alert('Prescription not found for this appointment');
    }
  };

  const handleCloseViewPrescription = () => {
    setShowViewPrescriptionModal(false);
    setViewingPrescription(null);
  };

  // Edit Modal Functions
  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await patientAPI.update(patientData.id, editFormData);
      setPatientData(editFormData);
      setShowEditModal(false);
      alert('Personal information updated successfully!');
    } catch (error) {
      console.error('Error updating patient:', error);
      alert('Failed to update information');
    }
  };

  const handleEditCancel = () => {
    setShowEditModal(false);
    setEditFormData(patientData);
  };

  // Calendar Functions
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1));
  };

  const generateCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Previous month's days
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    const prevMonthDays = getDaysInMonth(prevMonth);
    
    for (let i = prevMonthDays - firstDay + 1; i <= prevMonthDays; i++) {
      days.push({ day: i, isCurrentMonth: false, date: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), i) });
    }

    // Current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
      days.push({ 
        day: i, 
        isCurrentMonth: true, 
        date,
        isSelected: selectedDate && date.toDateString() === selectedDate.toDateString(),
        isToday: date.toDateString() === new Date().toDateString()
      });
    }

    // Next month's days
    const totalCells = 42;
    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    for (let i = 1; days.length < totalCells; i++) {
      days.push({ day: i, isCurrentMonth: false, date: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), i) });
    }

    return days;
  };

  const handleDateSelect = (date) => {
    if (date >= new Date().setHours(0, 0, 0, 0)) {
      setSelectedDate(date);
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!selectedDoctor || !selectedDate || !selectedTime || !reason) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await appointmentAPI.create({
        patientId: patientData.id,
        doctorId: selectedDoctor,
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        reason: reason
      });

      // Refresh appointments
      fetchAppointments(patientData.id);
      
      // Reset form
      setSelectedDoctor('');
      setSelectedDate(null);
      setSelectedTime('');
      setReason('');
      
      alert('Appointment booked successfully!');
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert(error.response?.data?.message || 'Failed to book appointment');
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await appointmentAPI.cancel(appointmentId);
      fetchAppointments(patientData.id);
      alert('Appointment cancelled successfully!');
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      alert('Failed to cancel appointment');
    }
  };

  const handlePayBill = async (billId) => {
    try {
      await billAPI.pay(billId);
      fetchBills(patientData.id);
      alert('Payment processed successfully!');
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Failed to process payment');
    }
  };

  if (loading || !patientData) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="flex border-b">
          {['overview', 'appointments', 'book appointment', 'bills'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.replace(' ', '-'))}
              className={`flex-1 py-4 px-6 text-center font-medium capitalize transition-colors ${
                activeTab === tab.replace(' ', '-')
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && patientData && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Current Appointments */}
              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Current Appointments</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {appointments.length}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Scheduled appointments</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Pending Bills */}
              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Bills</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      ${bills.filter(bill => bill.status === 'Pending').reduce((sum, bill) => sum + (bill.amount || 0), 0)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Total amount due</p>
                  </div>
                  <div className="bg-red-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Total Visits */}
              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Visits</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {pastAppointments.length}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Completed appointments</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Patient Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Patient Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-gray-600 font-medium">Name</span>
                    <span className="text-gray-900">{patientData.name}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-gray-600 font-medium">Email</span>
                    <span className="text-gray-900">{patientData.email}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-gray-600 font-medium">Phone</span>
                    <span className="text-gray-900">{patientData.phone}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-gray-600 font-medium">Date of Birth</span>
                    <span className="text-gray-900">{patientData.dateOfBirth}</span>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-gray-600 font-medium">Gender</span>
                    <span className="text-gray-900">{patientData.gender}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-gray-600 font-medium">Blood Type</span>
                    <span className="text-gray-900">{patientData.bloodType}</span>
                  </div>
                  <div className="flex justify-between items-start py-3 border-b">
                    <span className="text-gray-600 font-medium">Address</span>
                    <span className="text-gray-900 text-right">{patientData.address}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-gray-600 font-medium">Emergency Contact</span>
                    <span className="text-gray-900">{patientData.emergencyContact}</span>
                  </div>
                </div>
              </div>

              {/* Medical History */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Medical History</h3>
                <p className="text-gray-700 bg-gray-50 rounded-lg p-4">
                  {patientData.medicalHistory || 'No medical history recorded.'}
                </p>
              </div>

              {/* Edit Button */}
              <div className="mt-8 flex justify-center">
                <button 
                  onClick={handleEditClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  View and edit personal information
                </button>
              </div>
            </div>
          </>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            {/* Current Appointments Table */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Current Appointments</h3>
              <p className="text-gray-600 mb-6">Your scheduled appointments</p>
              
              {appointments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {appointments.map((appointment) => (
                        <tr key={appointment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {appointment.doctorName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {appointment.specialization}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {appointment.date ? new Date(appointment.date).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {appointment.time || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {appointment.reason || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              {appointment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button 
                              onClick={() => handleCancelAppointment(appointment.id)} 
                              className="text-red-600 hover:text-red-900 font-medium"
                            >
                              Cancel
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-gray-500 text-lg">No current appointments found</p>
                </div>
              )}
            </div>

            {/* Past Appointments Table - UPDATED WITH PRESCRIPTION COLUMN */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Past Appointments</h3>
              <p className="text-gray-600 mb-6">Your appointment history</p>
              
              {pastAppointments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prescription</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pastAppointments.map((appointment) => (
                        <tr key={appointment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {appointment.doctorName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {appointment.specialization}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {appointment.date ? new Date(appointment.date).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {appointment.time || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {appointment.reason || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              appointment.status === 'Completed' 
                                ? 'bg-green-100 text-green-800'
                                : appointment.status === 'Cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {appointment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {appointment.status === 'Completed' ? (
                              <button
                                onClick={() => handleViewPrescription(appointment)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                              >
                                View Prescription
                              </button>
                            ) : (
                              <span className="text-gray-400 text-sm">No prescription</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-gray-500 text-lg">No past appointments found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Book Appointment Tab */}
        {activeTab === 'book-appointment' && (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Book New Appointment</h1>
            <p className="text-gray-600 mb-8">Schedule an appointment with a doctor</p>

            <form onSubmit={handleBookAppointment} className="space-y-8">
              {/* Select Doctor */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Doctor</h2>
                <div className="border-b border-gray-200 mb-6"></div>
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Choose a doctor</option>
                  {availableDoctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialization} ({doctor.department})
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Date */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Date</h2>
                <div className="border-b border-gray-200 mb-6"></div>
                
                {/* Calendar */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <button 
                      type="button"
                      onClick={() => navigateMonth(-1)} 
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <h3 className="text-lg font-semibold">
                      {currentMonth.toLocaleString('default', { month: 'long' })} {currentMonth.getFullYear()}
                    </h3>
                    <button 
                      type="button"
                      onClick={() => navigateMonth(1)} 
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                      <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {generateCalendar().map((dayObj, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleDateSelect(dayObj.date)}
                        disabled={!dayObj.isCurrentMonth || dayObj.date < new Date().setHours(0, 0, 0, 0)}
                        className={`h-10 rounded text-sm ${
                          dayObj.isSelected
                            ? 'bg-blue-600 text-white'
                            : dayObj.isToday
                            ? 'bg-blue-100 text-blue-600'
                            : dayObj.isCurrentMonth
                            ? 'text-gray-900 hover:bg-gray-100'
                            : 'text-gray-400'
                        } ${
                          !dayObj.isCurrentMonth || dayObj.date < new Date().setHours(0, 0, 0, 0)
                            ? 'cursor-not-allowed opacity-50'
                            : 'cursor-pointer'
                        }`}
                      >
                        {dayObj.day}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reason for Visit */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Reason for Visit</h2>
                <div className="border-b border-gray-200 mb-6"></div>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Describe your symptoms or reason for visit..."
                  className="w-full border border-gray-300 rounded-lg p-3 h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  required
                />
              </div>

              {/* Select Time */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Time</h2>
                <div className="border-b border-gray-200 mb-6"></div>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {availableTimeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                        selectedTime === time
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Book Appointment Button */}
              <button
                type="submit"
                className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-colors"
              >
                Book Appointment
              </button>
            </form>
          </div>
        )}

        {/* Bills Tab */}
        {activeTab === 'bills' && (
          <div className="space-y-6">
            {/* Bills Table */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Medical Bills</h3>
              <p className="text-gray-600 mb-6">View and pay your medical bills</p>
              
              {bills.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bills.map((bill) => (
                        <tr key={bill.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {bill.billId || bill.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {bill.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {bill.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${bill.amount ? bill.amount.toFixed(2) : '0.00'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              bill.status === 'Pending' 
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {bill.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {bill.status === 'Pending' && (
                              <button 
                                onClick={() => handlePayBill(bill.billId || bill.id)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                              >
                                Pay Now
                              </button>
                            )}
                            {bill.status === 'Paid' && (
                              <span className="text-green-600 font-medium">Paid</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-gray-500 text-lg">No bills found</p>
                </div>
              )}
            </div>

            {/* Payment Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Payment Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-gray-600 font-medium">Pending Bills:</span>
                  <span className="text-gray-900">{bills.filter(bill => bill.status === 'Pending').length}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-gray-600 font-medium">Total Amount Due:</span>
                  <span className="text-xl font-bold text-gray-900">
                    ${bills.filter(bill => bill.status === 'Pending').reduce((total, bill) => total + (bill.amount || 0), 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* View Prescription Modal */}
      {showViewPrescriptionModal && viewingPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Prescription Details</h2>
              <p className="text-gray-600 mt-1">
                Prescription for {viewingPrescription.patientName}
              </p>
            </div>

            <div className="p-6 border-b border-gray-200">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                      <p className="text-gray-900 font-semibold text-lg">{viewingPrescription.patientName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Age / Gender</label>
                      <p className="text-gray-900 font-semibold text-lg">{viewingPrescription.age} years / {viewingPrescription.gender}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
                      <p className="text-gray-900 font-semibold text-lg">{viewingPrescription.patientId}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Date</label>
                      <p className="text-gray-900 font-semibold text-lg">
                        {new Date(viewingPrescription.appointmentDate).toLocaleDateString()} at {viewingPrescription.appointmentTime}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Prescribed Medicines</h3>
              {viewingPrescription.medicines && viewingPrescription.medicines.length > 0 ? (
                <div className="space-y-4">
                  {viewingPrescription.medicines.map((medicine, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <span className="text-sm font-medium text-gray-500">Medicine Name</span>
                          <p className="text-gray-900 font-semibold">{medicine.name}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Dosage</span>
                          <p className="text-gray-900 font-semibold">{medicine.dosage}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Duration</span>
                          <p className="text-gray-900 font-semibold">{medicine.duration}</p>
                        </div>
                      </div>
                      {medicine.instructions && (
                        <div className="mt-2">
                          <span className="text-sm font-medium text-gray-500">Instructions</span>
                          <p className="text-gray-900">{medicine.instructions}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No medicines prescribed</p>
              )}
            </div>

            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Doctor's Notes</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-900 whitespace-pre-wrap">
                  {viewingPrescription.notes || "No notes provided"}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={handleCloseViewPrescription}
                className="px-6 py-2 bg-black hover:bg-gray-800 text-white font-medium rounded-lg transition duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Personal Information Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Edit Personal Information</h2>
                <button
                  onClick={handleEditCancel}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name || ''}
                      onChange={handleEditFormChange}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="text"
                      name="email"
                      value={editFormData.email || ''}
                      onChange={handleEditFormChange}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={editFormData.phone || ''}
                      onChange={handleEditFormChange}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={editFormData.dateOfBirth || ''}
                      onChange={handleEditFormChange}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={editFormData.gender || ''}
                      onChange={handleEditFormChange}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Blood Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Blood Type
                    </label>
                    <select
                      name="bloodType"
                      value={editFormData.bloodType || ''}
                      onChange={handleEditFormChange}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Blood Type</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={editFormData.address || ''}
                    onChange={handleEditFormChange}
                    rows="3"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    required
                  />
                </div>

                {/* Emergency Contact */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact
                  </label>
                  <input
                    type="text"
                    name="emergencyContact"
                    value={editFormData.emergencyContact || ''}
                    onChange={handleEditFormChange}
                    placeholder="Name and phone number"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Medical History */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medical History
                  </label>
                  <textarea
                    name="medicalHistory"
                    value={editFormData.medicalHistory || ''}
                    onChange={handleEditFormChange}
                    rows="4"
                    placeholder="Describe any medical conditions, allergies, or previous treatments..."
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={handleEditCancel}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;