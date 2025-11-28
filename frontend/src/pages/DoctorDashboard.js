import React, { useState, useEffect } from 'react';
import { appointmentAPI, prescriptionAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [appointments, setAppointments] = useState([]);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    dosage: '',
    duration: ''
  });
  const [prescriptionNotes, setPrescriptionNotes] = useState('');
  const [viewingPrescription, setViewingPrescription] = useState(null);
  const [showViewPrescriptionModal, setShowViewPrescriptionModal] = useState(false);
  const [doctorInfo, setDoctorInfo] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log("🟡 User from localStorage:", user);
    
    if (user && user.profileId) {
      setDoctorInfo({
        name: user.name,
        profileId: user.profileId
      });
      fetchAppointments(user.profileId);
    } else {
      console.error("❌ No user found in localStorage");
      setLoading(false);
    }
  }, []);

const fetchAppointments = async (doctorId) => {
  try {
    console.log("🟡 Fetching appointments for doctor:", doctorId);
    setLoading(true);
    const response = await appointmentAPI.getAll({ doctorId });
    
    console.log("✅ Full API Response:", response);
    console.log("✅ Response data:", response.data);
    
    // Handle both response structures for compatibility
    let appointmentsData = [];
    let doctorProfileData = null;
    
    if (Array.isArray(response.data)) {
      // If response is direct array (old structure)
      appointmentsData = response.data;
      // Try to extract doctor profile from first appointment
      if (response.data.length > 0) {
        doctorProfileData = {
          specialization: response.data[0].specialization,
          department: response.data[0].department
        };
      }
    } else {
      // If response is object with appointments and doctorProfile (new structure)
      appointmentsData = response.data?.appointments || [];
      doctorProfileData = response.data?.doctorProfile || null;
    }
    
    console.log("✅ Appointments data:", appointmentsData);
    console.log("✅ Doctor profile:", doctorProfileData);
    
    setAppointments(appointmentsData);
    setDoctorProfile(doctorProfileData);
    
  } catch (error) {
    console.error('❌ Error fetching appointments:', error);
    console.error('❌ Error response:', error.response);
    alert('Failed to load appointments');
    setAppointments([]);
    setDoctorProfile(null);
  } finally {
    setLoading(false);
  }
};

  const handleMarkCompleted = (appointment) => {
    setSelectedAppointment(appointment);
    setShowPrescriptionModal(true);
  };

  const handleAddMedicine = () => {
    if (newMedicine.name && newMedicine.dosage && newMedicine.duration) {
      setMedicines([...medicines, { ...newMedicine, id: Date.now() }]);
      setNewMedicine({ name: '', dosage: '', duration: '' });
    }
  };

  const removeMedicine = (id) => {
    setMedicines(medicines.filter(med => med.id !== id));
  };

 const handleSavePrescription = async () => {
  try {
    console.log("🟡 Starting complete appointment process...");
    console.log("Selected appointment:", selectedAppointment);
    console.log("Medicines:", medicines);
    console.log("Notes:", prescriptionNotes);

    // First mark appointment as completed
    console.log("🟡 Calling appointmentAPI.complete...");
    const completeResponse = await appointmentAPI.complete(selectedAppointment.id);
    console.log("✅ Appointment completed:", completeResponse.data);

    // Create prescription
    console.log("🟡 Calling prescriptionAPI.create...");
    const prescriptionResponse = await prescriptionAPI.create({
      appointmentId: selectedAppointment.id,
      diagnosis: prescriptionNotes,
      notes: prescriptionNotes,
      medicines: medicines
    });
    console.log("✅ Prescription created:", prescriptionResponse.data);

    // Close modal and refresh
    setShowPrescriptionModal(false);
    setMedicines([]);
    setPrescriptionNotes('');
    setSelectedAppointment(null);
    
    // Refresh appointments
    const user = JSON.parse(localStorage.getItem('user'));
    fetchAppointments(user.profileId);
    
    alert('Appointment completed and prescription saved successfully!');
    
  } catch (error) {
    console.error('❌ Error completing appointment:', error);
    console.error('❌ Error response:', error.response);
    alert(`Failed to complete appointment: ${error.response?.data?.message || error.message}`);
  }
};

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

  const handleCancel = () => {
    setShowPrescriptionModal(false);
    setMedicines([]);
    setPrescriptionNotes('');
    setSelectedAppointment(null);
    setNewMedicine({ name: '', dosage: '', duration: '' });
  };

  const handleCloseViewPrescription = () => {
    setShowViewPrescriptionModal(false);
    setViewingPrescription(null);
  };

  const upcomingAppointments = appointments?.filter(apt => apt.status === 'Scheduled') || [];
  const completedAppointments = appointments?.filter(apt => apt.status === 'Completed') || [];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      {/* Create Prescription Modal */}
      {showPrescriptionModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Create Prescription</h2>
              <p className="text-gray-600 mt-1">
                Complete appointment and create prescription for {selectedAppointment.patientName}
              </p>
            </div>

            <div className="p-6 border-b border-gray-200">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                      <p className="text-gray-900 font-semibold text-lg">{selectedAppointment.patientName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Age / Gender</label>
                      <p className="text-gray-900 font-semibold text-lg">{selectedAppointment.age} years / {selectedAppointment.gender}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
                      <p className="text-gray-900 font-semibold text-lg">{selectedAppointment.patientId}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                      <p className="text-gray-900 font-semibold text-lg">{selectedAppointment.reason}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Medicine</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name</label>
                  <input
                    type="text"
                    value={newMedicine.name}
                    onChange={(e) => setNewMedicine({...newMedicine, name: e.target.value})}
                    placeholder="e.g., Aspirin"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
                  <input
                    type="text"
                    value={newMedicine.dosage}
                    onChange={(e) => setNewMedicine({...newMedicine, dosage: e.target.value})}
                    placeholder="e.g., 100mg twice"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={newMedicine.duration}
                    onChange={(e) => setNewMedicine({...newMedicine, duration: e.target.value})}
                    placeholder="e.g., 7 days"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <button
                onClick={handleAddMedicine}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center"
              >
                <span className="mr-2">+</span>
                Add Medicine to Prescription
              </button>

              {medicines.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Added Medicines</h4>
                  <div className="space-y-3">
                    {medicines.map((medicine) => (
                      <div key={medicine.id} className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                        <div className="flex-1 grid grid-cols-3 gap-4">
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
                        <button
                          onClick={() => removeMedicine(medicine.id)}
                          className="ml-4 text-red-600 hover:text-red-800 font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Prescription Notes</h3>
              <textarea
                value={prescriptionNotes}
                onChange={(e) => setPrescriptionNotes(e.target.value)}
                placeholder="Enter diagnosis, instructions, and additional notes..."
                rows="4"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePrescription}
                className="px-6 py-2 bg-black hover:bg-gray-800 text-white font-medium rounded-lg transition duration-200"
              >
                Complete Appointment & Save Prescription
              </button>
            </div>
          </div>
        </div>
      )}

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

      {/* Main Content */}
      <div className="p-6">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="text-left mb-4 md:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Doctor Dashboard</h1>
              <p className="text-gray-600 text-lg">
                Welcome back, {doctorInfo?.name || 'Doctor'}
              </p>
            </div>
            
            {/* Updated Doctor Profile Section */}
            <div className="bg-white rounded-lg shadow p-6 text-center md:text-right">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {doctorProfile?.specialization || 'Specialization'}
              </div>
              <div className="text-gray-700 font-medium">
                {doctorProfile?.department ? `${doctorProfile.department} Department` : 'Department'}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Upcoming Appointments</h3>
            <p className="text-3xl font-bold text-blue-600">{upcomingAppointments.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Completed Today</h3>
            <p className="text-3xl font-bold text-green-600">
              {completedAppointments.filter(apt => 
                new Date(apt.date).toDateString() === new Date().toDateString()
              ).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Completed</h3>
            <p className="text-3xl font-bold text-gray-600">{completedAppointments.length}</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`pb-4 px-1 border-b-2 font-medium ${
                activeTab === 'upcoming'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Upcoming ({upcomingAppointments.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`pb-4 px-1 border-b-2 font-medium ${
                activeTab === 'completed'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Completed ({completedAppointments.length})
            </button>
          </div>
        </div>

        {/* Appointments Container */}
        <div className="space-y-6">
          {activeTab === 'upcoming' ? (
            upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{appointment.patientName}</h3>
                    <p className="text-gray-600">{appointment.age} years • {appointment.gender}</p>
                    <p className="text-sm text-gray-500">Patient ID: {appointment.patientId}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <span className="text-sm font-medium text-gray-500">Date</span>
                    <p className="text-gray-900 font-semibold">
                      {new Date(appointment.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <span className="text-sm font-medium text-gray-500">Time</span>
                    <p className="text-gray-900 font-semibold">{appointment.time}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <span className="text-sm font-medium text-gray-500">Reason for Visit</span>
                    <p className="text-gray-900 font-semibold">{appointment.reason}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleMarkCompleted(appointment)}
                  className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg transition duration-200"
                >
                  Mark as Completed & Create Prescription
                </button>
              </div>
            ))
          ) : (
            completedAppointments.map((appointment) => (
              <div key={appointment.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{appointment.patientName}</h3>
                    <p className="text-gray-600">{appointment.age} years • {appointment.gender}</p>
                    <p className="text-sm text-gray-500">Patient ID: {appointment.patientId}</p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Completed
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <span className="text-sm font-medium text-gray-500">Date</span>
                    <p className="text-gray-900 font-semibold">
                      {new Date(appointment.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <span className="text-sm font-medium text-gray-500">Time</span>
                    <p className="text-gray-900 font-semibold">{appointment.time}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <span className="text-sm font-medium text-gray-500">Reason for Visit</span>
                    <p className="text-gray-900 font-semibold">{appointment.reason}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleViewPrescription(appointment)}
                  className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg transition duration-200"
                >
                  View Prescription
                </button>
              </div>
            ))
          )}
        </div>

        {/* Empty States */}
        {activeTab === 'upcoming' && upcomingAppointments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No upcoming appointments</p>
          </div>
        )}

        {activeTab === 'completed' && completedAppointments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No completed appointments</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;