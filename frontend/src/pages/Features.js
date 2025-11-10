import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Features.css';

const Features = () => {
  const navigate = useNavigate();

  const useCases = [
    {
      number: '1',
      title: 'Register Patient',
      description: 'A new patient fills out a form with name, contact, age, and gender. The system saves the record in the Patient table.'
    },
    {
      number: '2',
      title: 'Book Appointment',
      description: 'A patient selects a doctor, date, and time slot. The system checks for conflicts, then records the appointment if available.'
    },
    {
      number: '3',
      title: 'Complete Appointment',
      description: 'The doctor marks the appointment as "Completed." A trigger automatically generates a bill and enables prescription creation.'
    },
    {
      number: '4',
      title: 'Generate Bill',
      description: 'When an appointment is completed, the system creates a bill using the doctor\'s fee and sets payment_status to "Unpaid."'
    },
    {
      number: '5',
      title: 'Add Prescription',
      description: 'The doctor enters medicines, dosage, and notes for the completed appointment. The record is stored in the Prescription table.'
    },
    {
      number: '6',
      title: 'Cancel Appointment',
      description: 'A patient cancels an existing appointment, changing its status to "Cancelled" and freeing that time slot.'
    },
    {
      number: '7',
      title: 'View Appointments',
      description: 'A patient or doctor can view all upcoming and completed appointments from their dashboard.'
    },
    {
      number: '8',
      title: 'Pay Bill',
      description: 'The admin or receptionist updates the bill\'s payment status to "Paid" once the transaction is done.'
    },
    {
      number: '9',
      title: 'Manage Staff',
      description: 'The admin adds, updates, or removes staff members within departments.'
    },
    {
      number: '10',
      title: 'Generate Department Report',
      description: 'The admin can run a query to view total appointments, revenue, or doctor count per department.'
    }
  ];

  return (
    <div className="features-page">
      <div className="features-container">
        <div className="features-card">
          <button className="back-btn" onClick={() => navigate('/')}>
            ← Back to Home
          </button>
          
          <div className="features-content">
            <h1>System Features</h1>
            <p className="features-subtitle">
              Comprehensive healthcare management capabilities designed for efficiency and reliability
            </p>

            <div className="use-cases-section">
              <h2>Use Cases</h2>
              <div className="use-cases-grid">
                {useCases.map((useCase, index) => (
                  <div key={index} className="use-case-card">
                    <div className="use-case-header">
                      <div className="use-case-number">{useCase.number}</div>
                      <h3>{useCase.title}</h3>
                    </div>
                    <p>{useCase.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="workflow-section">
              <h2>System Workflow</h2>
              <div className="workflow-steps">
                <div className="workflow-step">
                  <div className="step-icon">👤</div>
                  <div className="step-content">
                    <h4>Patient Registration</h4>
                    <p>New patients register with personal details and medical information</p>
                  </div>
                </div>
                <div className="workflow-arrow">→</div>
                <div className="workflow-step">
                  <div className="step-icon">📅</div>
                  <div className="step-content">
                    <h4>Appointment Booking</h4>
                    <p>Patients book appointments with available doctors and time slots</p>
                  </div>
                </div>
                <div className="workflow-arrow">→</div>
                <div className="workflow-step">
                  <div className="step-icon">🏥</div>
                  <div className="step-content">
                    <h4>Medical Consultation</h4>
                    <p>Doctors conduct consultations and record medical notes</p>
                  </div>
                </div>
                <div className="workflow-arrow">→</div>
                <div className="workflow-step">
                  <div className="step-icon">💰</div>
                  <div className="step-content">
                    <h4>Billing & Payment</h4>
                    <p>Automatic bill generation and secure payment processing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;