import React from 'react';
import { useNavigate } from 'react-router-dom';
import './About.css';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="about-page">
      <div className="about-container">
        <div className="about-card">
          <button className="back-btn" onClick={() => navigate('/')}>
            ← Back to Home
          </button>
          
          <div className="about-content">
            <h1>About HospitalSystem</h1>
            <div className="about-hero">
              <div className="hero-text">
                <h2>Transforming Healthcare Management</h2>
                <p className="tagline">Automating hospital operations for better patient care</p>
              </div>
              <div className="hero-graphic">🏥</div>
            </div>

            <div className="about-sections">
              <section className="about-section">
                <h3>The Challenge</h3>
                <p>
                  Hospitals today manage thousands of patients, appointments, and billing transactions 
                  daily. Many small and medium-sized hospitals still rely on manual or semi-digital 
                  processes, which often lead to overlapping appointments, lost records, and delays in 
                  billing.
                </p>
              </section>

              <section className="about-section">
                <h3>Our Solution</h3>
                <p>
                  Our project, the Hospital Appointment & Billing System, aims to automate and 
                  streamline these processes through a centralized database and interactive interface. 
                  The system allows patients to register, book appointments with doctors, and receive 
                  electronic bills once the appointment is completed.
                </p>
              </section>

              <section className="about-section">
                <h3>Comprehensive Management</h3>
                <p>
                  Doctors can view their daily schedules, record prescriptions, and mark appointments 
                  as completed, while administrators can manage departments, staff, and payment records. 
                  This approach reduces human error, improves scheduling efficiency, and enhances 
                  patient satisfaction.
                </p>
              </section>

              <div className="benefits-grid">
                <div className="benefit-card">
                  <div className="benefit-icon">⚡</div>
                  <h4>Automated Processes</h4>
                  <p>Reduce manual work and eliminate scheduling conflicts</p>
                </div>
                <div className="benefit-card">
                  <div className="benefit-icon">📊</div>
                  <h4>Centralized Data</h4>
                  <p>All patient and appointment data in one secure location</p>
                </div>
                <div className="benefit-card">
                  <div className="benefit-icon">💳</div>
                  <h4>Streamlined Billing</h4>
                  <p>Automatic bill generation and payment tracking</p>
                </div>
                <div className="benefit-card">
                  <div className="benefit-icon">👥</div>
                  <h4>Better Coordination</h4>
                  <p>Seamless communication between patients, doctors, and staff</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;