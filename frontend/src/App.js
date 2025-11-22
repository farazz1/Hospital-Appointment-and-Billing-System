import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import LandingPage from './pages/LandingPage';
import Login from './pages/login';
import Signup from './pages/signup';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientManagement from './pages/PatientDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Simple Layout component for authenticated routes
const SimpleLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-2xl">🏥</span>
            <span className="ml-2 text-xl font-bold text-gray-800">Hospital DBMS</span>
          </div>
          <div className="flex space-x-4">
            <a href="/" className="text-gray-600 hover:text-blue-600">Home</a>
            <a href="/login" className="text-gray-600 hover:text-blue-600">Logout</a>
          </div>
        </div>
      </div>
    </nav>
    <main className="container mx-auto py-6 px-4">
      {children}
    </main>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Authenticated Routes with Layout */}
        <Route path="/doctor" element={
          <SimpleLayout>
            <DoctorDashboard />
          </SimpleLayout>
        } />
        <Route path="/patients" element={
          <SimpleLayout>
            <PatientManagement />
          </SimpleLayout>
        } />
        <Route path="/admin" element={
          <SimpleLayout>
            <AdminDashboard />
          </SimpleLayout>
        } />
        
        {/* Fallback route */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;