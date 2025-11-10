import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DoctorDash.css';

const DoctorDash = () => {
  const navigate = useNavigate();
  const [specialty, setSpecialty] = useState('Cardiology');
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patientName: "John Smith",
      age: 40,
      gender: "Male",
      patientId: "P114",
      time: "10:15 AM",
      date: "10/25/2024",
      reason: "Regular Checkup",
      status: "upcoming",
      description: "",
      medicinesPrescribed: 0
    },
    {
      id: 2,
      patientName: "Dan Brown",
      age: 36,
      gender: "Male",
      patientId: "P201",
      time: "12:45 PM",
      date: "10/25/2024",
      reason: "Chest pain",
      status: "upcoming",
      description: "",
      medicinesPrescribed: 0
    },
    {
      id: 3,
      patientName: "Sarah Wilson",
      age: 45,
      gender: "Female",
      patientId: "P001",
      time: "9:00 AM",
      date: "10/25/2024",
      reason: "Regular Checkup",
      status: "completed",
      description: "Prescription Created",
      medicinesPrescribed: 2,
      prescription: {
        medicines: [
          { name: "Lisinopril", dosage: "10mg once daily", duration: "30 days" },
          { name: "Aspirin", dosage: "81mg once daily", duration: "30 days" }
        ],
        notes: "Blood pressure improving. Continue current medication. Follow up in 1 month."
      }
    }
  ]);

  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newPrescription, setNewPrescription] = useState({
    medicines: [{ name: '', dosage: '', duration: '' }],
    notes: ''
  });

  const specialties = [
    'Cardiology',
    'Neurology',
    'Pediatrics',
    'Orthopedics',
    'Emergency'
  ];

  const handleLogout = () => {
    navigate('/');
  };

  const markAsCompleted = (appointment) => {
    setSelectedAppointment(appointment);
    setIsCreateModalOpen(true);
  };

  const handleCreatePrescription = () => {
    if (!selectedAppointment) return;

    setAppointments(prevAppointments =>
      prevAppointments.map(appointment =>
        appointment.id === selectedAppointment.id
          ? {
              ...appointment,
              status: 'completed',
              description: 'Prescription Created',
              medicinesPrescribed: newPrescription.medicines.filter(med => med.name).length,
              prescription: {
                medicines: newPrescription.medicines.filter(med => med.name),
                notes: newPrescription.notes
              }
            }
          : appointment
      )
    );

    setIsCreateModalOpen(false);
    setSelectedAppointment(null);
    setNewPrescription({
      medicines: [{ name: '', dosage: '', duration: '' }],
      notes: ''
    });
  };

  const viewPrescription = (appointment) => {
    if (appointment.prescription) {
      setSelectedPrescription({
        patientName: appointment.patientName,
        age: appointment.age,
        gender: appointment.gender,
        patientId: appointment.patientId,
        reason: appointment.reason,
        medicines: appointment.prescription.medicines || [],
        notes: appointment.prescription.notes || "No notes available."
      });
    } else {
      setSelectedPrescription({
        patientName: appointment.patientName,
        age: appointment.age,
        gender: appointment.gender,
        patientId: appointment.patientId,
        reason: appointment.reason,
        medicines: [],
        notes: "No prescription details available."
      });
    }
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedPrescription(null);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setSelectedAppointment(null);
    setNewPrescription({
      medicines: [{ name: '', dosage: '', duration: '' }],
      notes: ''
    });
  };

  const addMedicineField = () => {
    setNewPrescription(prev => ({
      ...prev,
      medicines: [...prev.medicines, { name: '', dosage: '', duration: '' }]
    }));
  };

  const removeMedicineField = (index) => {
    setNewPrescription(prev => ({
      ...prev,
      medicines: prev.medicines.filter((_, i) => i !== index)
    }));
  };

  const updateMedicineField = (index, field, value) => {
    setNewPrescription(prev => ({
      ...prev,
      medicines: prev.medicines.map((medicine, i) =>
        i === index ? { ...medicine, [field]: value } : medicine
      )
    }));
  };

  const updateNotes = (value) => {
    setNewPrescription(prev => ({ ...prev, notes: value }));
  };

  const upcomingAppointments = appointments.filter(apt => apt.status === 'upcoming');
  const completedAppointments = appointments.filter(apt => apt.status === 'completed');

  return (
    <div className="doctor-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Hospital Management System</h1>
          <div className="doctor-menu">
            <div className="doctor-profile">
              <div className="doctor-avatar">D</div>
              <div className="doctor-details">
                <span className="doctor-name">Dr. Sarah Johnson</span>
                <span className="doctor-email">dr.sarah@hospital.com</span>
              </div>
            </div>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="dashboard-nav">
        <div className="nav-content">
          <button className="nav-btn active">Dashboard</button>
          <div className="specialty-selector">
            <select 
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="specialty-dropdown"
            >
              {specialties.map((spec, index) => (
                <option key={index} value={spec}>{spec}</option>
              ))}
            </select>
          </div>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h2>Doctor Dashboard</h2>
          <p className="welcome-message">Welcome back, Dr. Sarah Johnson - {specialty}</p>
        </div>

        {/* Stats Section */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-info">
              <h3>{upcomingAppointments.length}</h3>
              <p>Upcoming Appointments</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{completedAppointments.length}</h3>
              <p>Completed Today</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💊</div>
            <div className="stat-info">
              <h3>{completedAppointments.reduce((total, apt) => total + apt.medicinesPrescribed, 0)}</h3>
              <p>Medicines Prescribed</p>
            </div>
          </div>
        </div>

        {/* Appointments Section */}
        <div className="appointments-container">
          <div className="appointments-section">
            <h3>Upcoming Appointments ({upcomingAppointments.length})</h3>
            <div className="appointments-list">
              {upcomingAppointments.map(appointment => (
                <div key={appointment.id} className="appointment-card">
                  <div className="appointment-header">
                    <h4>{appointment.patientName}</h4>
                    <span className="patient-id">ID: {appointment.patientId}</span>
                  </div>
                  <div className="appointment-details">
                    <div className="detail-group">
                      <span className="label">Age/Gender:</span>
                      <span>{appointment.age} yrs, {appointment.gender}</span>
                    </div>
                    <div className="detail-group">
                      <span className="label">Time:</span>
                      <span>{appointment.time}</span>
                    </div>
                    <div className="detail-group">
                      <span className="label">Date:</span>
                      <span>{appointment.date}</span>
                    </div>
                    <div className="detail-group">
                      <span className="label">Reason:</span>
                      <span>{appointment.reason}</span>
                    </div>
                  </div>
                  <button 
                    className="action-btn primary"
                    onClick={() => markAsCompleted(appointment)}
                  >
                    Complete & Prescribe
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="appointments-section">
            <h3>Completed Appointments ({completedAppointments.length})</h3>
            <div className="appointments-list">
              {completedAppointments.map(appointment => (
                <div key={appointment.id} className="appointment-card completed">
                  <div className="appointment-header">
                    <h4>{appointment.patientName}</h4>
                    <span className="patient-id">ID: {appointment.patientId}</span>
                  </div>
                  <div className="appointment-details">
                    <div className="detail-group">
                      <span className="label">Age/Gender:</span>
                      <span>{appointment.age} yrs, {appointment.gender}</span>
                    </div>
                    <div className="detail-group">
                      <span className="label">Time:</span>
                      <span>{appointment.time}</span>
                    </div>
                    <div className="prescription-info">
                      <span className="status completed">Completed</span>
                      <span className="medicines-count">{appointment.medicinesPrescribed} medicine(s) prescribed</span>
                    </div>
                  </div>
                  <button 
                    className="action-btn secondary"
                    onClick={() => viewPrescription(appointment)}
                  >
                    View Prescription
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* View Prescription Modal */}
      {isViewModalOpen && selectedPrescription && (
        <ViewPrescriptionModal 
          prescription={selectedPrescription}
          onClose={closeViewModal}
        />
      )}

      {/* Create Prescription Modal */}
      {isCreateModalOpen && selectedAppointment && (
        <CreatePrescriptionModal 
          appointment={selectedAppointment}
          prescription={newPrescription}
          onClose={closeCreateModal}
          onCreate={handleCreatePrescription}
          onAddMedicine={addMedicineField}
          onRemoveMedicine={removeMedicineField}
          onUpdateMedicine={updateMedicineField}
          onUpdateNotes={updateNotes}
        />
      )}
    </div>
  );
};

// Modal Components (keep the same as before, but I'll include them for completeness)
const ViewPrescriptionModal = ({ prescription, onClose }) => {
  const safePrescription = {
    patientName: prescription?.patientName || "Unknown Patient",
    age: prescription?.age || "Unknown",
    gender: prescription?.gender || "Unknown",
    patientId: prescription?.patientId || "Unknown ID",
    reason: prescription?.reason || "No reason specified",
    medicines: prescription?.medicines || [],
    notes: prescription?.notes || "No prescription notes available."
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>View Prescription</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="prescription-details">
          <div className="patient-header">
            <h3>Prescription for {safePrescription.patientName}</h3>
          </div>

          <div className="patient-info-grid">
            <div className="info-item">
              <label>Patient Name</label>
              <p>{safePrescription.patientName}</p>
            </div>
            <div className="info-item">
              <label>Age / Gender</label>
              <p>{safePrescription.age} years / {safePrescription.gender}</p>
            </div>
            <div className="info-item">
              <label>Patient ID</label>
              <p>{safePrescription.patientId}</p>
            </div>
            <div className="info-item">
              <label>Reason</label>
              <p>{safePrescription.reason}</p>
            </div>
          </div>

          <div className="medicines-section">
            <h4>Prescribed Medicines</h4>
            {safePrescription.medicines.length > 0 ? (
              <table className="medicines-table">
                <thead>
                  <tr>
                    <th>Medicine</th>
                    <th>Dosage</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {safePrescription.medicines.map((medicine, index) => (
                    <tr key={index}>
                      <td>{medicine.name}</td>
                      <td>{medicine.dosage}</td>
                      <td>{medicine.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-medicines">No medicines prescribed.</p>
            )}
          </div>

          <div className="prescription-notes">
            <h4>Prescription Notes</h4>
            <p>{safePrescription.notes}</p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="close-modal-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const CreatePrescriptionModal = ({ 
  appointment, 
  prescription, 
  onClose, 
  onCreate, 
  onAddMedicine, 
  onRemoveMedicine, 
  onUpdateMedicine, 
  onUpdateNotes 
}) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content create-prescription-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create Prescription</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="prescription-details">
          <div className="patient-header">
            <h3>Prescription for {appointment.patientName}</h3>
          </div>

          <div className="patient-info-grid">
            <div className="info-item">
              <label>Patient Name</label>
              <p>{appointment.patientName}</p>
            </div>
            <div className="info-item">
              <label>Age / Gender</label>
              <p>{appointment.age} years / {appointment.gender}</p>
            </div>
            <div className="info-item">
              <label>Patient ID</label>
              <p>{appointment.patientId}</p>
            </div>
            <div className="info-item">
              <label>Reason</label>
              <p>{appointment.reason}</p>
            </div>
          </div>

          <div className="medicines-section">
            <h4>Prescribed Medicines</h4>
            <div className="medicines-form">
              {prescription.medicines.map((medicine, index) => (
                <div key={index} className="medicine-row">
                  <input
                    type="text"
                    placeholder="Medicine name"
                    value={medicine.name}
                    onChange={(e) => onUpdateMedicine(index, 'name', e.target.value)}
                    className="medicine-input"
                  />
                  <input
                    type="text"
                    placeholder="Dosage"
                    value={medicine.dosage}
                    onChange={(e) => onUpdateMedicine(index, 'dosage', e.target.value)}
                    className="medicine-input"
                  />
                  <input
                    type="text"
                    placeholder="Duration"
                    value={medicine.duration}
                    onChange={(e) => onUpdateMedicine(index, 'duration', e.target.value)}
                    className="medicine-input"
                  />
                  {prescription.medicines.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onRemoveMedicine(index)}
                      className="remove-medicine-btn"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={onAddMedicine}
                className="add-medicine-btn"
              >
                + Add Another Medicine
              </button>
            </div>
          </div>

          <div className="prescription-notes">
            <h4>Prescription Notes</h4>
            <textarea
              value={prescription.notes}
              onChange={(e) => onUpdateNotes(e.target.value)}
              placeholder="Enter prescription notes, instructions, or follow-up recommendations..."
              className="notes-textarea"
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="create-btn" onClick={onCreate}>
            Create Prescription
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorDash;