import React, { useState, useEffect } from 'react';
import { appointmentAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [appointments, setAppointments] = useState([]);
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

  // Store prescriptions in state (in a real app, this would come from your backend)
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentAPI.getAll();
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
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
      // First mark appointment as completed
      await appointmentAPI.markCompleted(selectedAppointment.id);
      
      // Create prescription data - make sure to include medicines
      const prescriptionData = {
        id: Date.now().toString(),
        appointmentId: selectedAppointment.id,
        patientId: selectedAppointment.patientId,
        patientName: selectedAppointment.patientName,
        age: selectedAppointment.age,
        gender: selectedAppointment.gender,
        reason: selectedAppointment.reason,
        date: selectedAppointment.date,
        time: selectedAppointment.time,
        medicines: [...medicines], // Make sure to include the medicines array
        notes: prescriptionNotes,
        createdAt: new Date().toISOString()
      };
      
      console.log('Saving prescription with medicines:', prescriptionData.medicines); // Debug log
      
      // Save prescription to local state (in real app, this would be an API call)
      setPrescriptions(prev => [...prev, prescriptionData]);
      
      // Close modal and refresh appointments
      setShowPrescriptionModal(false);
      setMedicines([]);
      setPrescriptionNotes('');
      setSelectedAppointment(null);
      fetchAppointments();
      
    } catch (error) {
      console.error('Error completing appointment:', error);
    }
  };

  const handleCancel = () => {
    setShowPrescriptionModal(false);
    setMedicines([]);
    setPrescriptionNotes('');
    setSelectedAppointment(null);
    setNewMedicine({ name: '', dosage: '', duration: '' });
  };

  const handleViewPrescription = (appointment) => {
    // Find the prescription for this appointment
    const prescription = prescriptions.find(p => p.appointmentId === appointment.id);
    console.log('Found prescription:', prescription); // Debug log
    if (prescription) {
      setViewingPrescription(prescription);
      setShowViewPrescriptionModal(true);
    }
  };

  const handleCloseViewPrescription = () => {
    setShowViewPrescriptionModal(false);
    setViewingPrescription(null);
  };

  const upcomingAppointments = appointments.filter(apt => apt.status === 'scheduled');
  const completedAppointments = appointments.filter(apt => apt.status === 'completed');

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      {/* Create Prescription Modal */}
      {showPrescriptionModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Create Prescription</h2>
              <p className="text-gray-600 mt-1">
                Complete appointment and create prescription for {selectedAppointment.patientName} ({selectedAppointment.patientId})
              </p>
            </div>

            {/* Compact Patient Information */}
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

            {/* Add Medicine Section */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Medicine</h3>
              
              {/* Medicine Input Form */}
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

              {/* Medicine List */}
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

            {/* Prescription Notes */}
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

            {/* Modal Footer */}
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
            {/* Modal Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Prescription Details</h2>
              <p className="text-gray-600 mt-1">
                Prescription for {viewingPrescription.patientName} ({viewingPrescription.patientId})
              </p>
            </div>

            {/* Patient Information */}
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
                      <p className="text-gray-900 font-semibold text-lg">{viewingPrescription.date} at {viewingPrescription.time}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Medicines List */}
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
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No medicines prescribed</p>
              )}
            </div>

            {/* Prescription Notes */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Doctor's Notes</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-900 whitespace-pre-wrap">
                  {viewingPrescription.notes || "No notes provided"}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
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
        {/* Welcome Message - Updated with left alignment and doctor info on right */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            {/* Left side - Welcome message */}
            <div className="text-left mb-4 md:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Doctor Dashboard</h1>
              <p className="text-gray-600 text-lg">Welcome back, Dr. Sarah Johnson</p>
            </div>
            
            {/* Right side - Doctor specialty and department */}
            <div className="bg-white rounded-lg shadow p-6 text-center md:text-right">
              <div className="text-2xl font-bold text-blue-600 mb-2">Cardiology</div>
              <div className="text-gray-700 font-medium">Cardiovascular Department</div>
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
            <p className="text-3xl font-bold text-green-600">0</p>
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
                    <p className="text-gray-900 font-semibold">{appointment.date}</p>
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
            completedAppointments.map((appointment) => {
              const hasPrescription = prescriptions.some(p => p.appointmentId === appointment.id);
              
              return (
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
                      <p className="text-gray-900 font-semibold">{appointment.date}</p>
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

                  {/* View Prescription Button */}
                  {hasPrescription && (
                    <button
                      onClick={() => handleViewPrescription(appointment)}
                      className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg transition duration-200"
                    >
                      View Prescription
                    </button>
                  )}
                </div>
              );
            })
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