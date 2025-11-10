import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const goToSignup = () => {
    navigate('/signup');
  };

  const goToSignin = () => {
    navigate('/login');
  };

  const goToFeatures = () => {
    navigate('/features');
  };

  const goToAbout = () => {
    navigate('/about');
  };

  return (
    <div className="home-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-brand">
          <div className="logo">🏥 HospitalSystem</div>
        </div>
        <div className="nav-links">
          <button className="nav-link" onClick={goToFeatures}>Features</button>
          <button className="nav-link" onClick={goToAbout}>About</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="text-content">
            <h1 className="hero-title">
              Next-Generation
              <span className="gradient-text"> Healthcare Management</span>
            </h1>
            <p className="hero-subtitle">
              Streamline Your Hospital Operations with Our HospitalSystem Solution
            </p>
            <p className="hero-description">
              A comprehensive database management system designed to optimize patient care, 
              streamline administrative tasks, and enhance operational efficiency across 
              your healthcare facility.
            </p>

            <div className="cta-buttons">
              <button className="cta-primary" onClick={goToSignup}>Get Started</button>
              <button className="cta-secondary" onClick={goToSignin}>Sign In</button>
            </div>

            {/* Stats Section */}
            <div className="stats-container">
              <div className="stat-item">
                <div className="stat-number">10.00%</div>
                <div className="stat-label">Patients</div>
                <div className="stat-progress">
                  <div className="progress-bar" style={{width: '10%'}}></div>
                </div>
              </div>

              <div className="stat-item">
                <div className="stat-number">99.99%</div>
                <div className="stat-label">Ups/nm</div>
                <div className="stat-progress">
                  <div className="progress-bar" style={{width: '99%'}}></div>
                </div>
              </div>

              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Support</div>
                <div className="stat-progress">
                  <div className="progress-bar" style={{width: '100%'}}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="visual-content">
            <div className="hero-graphic">
              <div className="floating-card card-1">
                <div className="card-icon">📊</div>
                <h4>Analytics</h4>
                <p>Real-time insights</p>
              </div>
              <div className="floating-card card-2">
                <div className="card-icon">👥</div>
                <h4>Patients</h4>
                <p>Better care</p>
              </div>
              <div className="floating-card card-3">
                <div className="card-icon">⚡</div>
                <h4>Efficiency</h4>
                <p>Streamlined workflow</p>
              </div>
              <div className="main-graphic">
                <div className="graphic-circle"></div>
                <div className="graphic-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="features-preview">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure Data</h3>
            <p>HIPAA compliant data protection with advanced encryption</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Real-time Analytics</h3>
            <p>Make data-driven decisions with live performance metrics</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI Powered</h3>
            <p>Smart insights and predictive analytics for better outcomes</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;