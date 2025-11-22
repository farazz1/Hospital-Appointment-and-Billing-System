import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <span className="text-2xl font-bold text-gray-900">MediCare DBMS</span>
            </div>

            {/* Navigation Links - Hidden on mobile, visible on desktop */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition duration-200">Features</a>
              <a href="#benefits" className="text-gray-600 hover:text-gray-900 transition duration-200">Benefits</a>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium transition duration-200">Sign In</Link>
              <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition duration-200">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Next-Generation Healthcare Management
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Streamline Your Hospital Operations with Our DBMS Solution
          </p>
          <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto">
            A comprehensive database management system designed to optimize patient care, 
            streamline administrative tasks, and enhance operational efficiency across your healthcare facility.
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              to="/signup" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition duration-300 transform hover:scale-105"
            >
              Get Started →
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">10,000+</div>
            <div className="text-gray-500">Active Patients</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">99.9%</div>
            <div className="text-gray-500">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">24/7</div>
            <div className="text-gray-500">Support</div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your healthcare facility efficiently
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition duration-300">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-3">Patient Management</h3>
              <p className="text-gray-600">Comprehensive patient records and medical history tracking</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition duration-300">
              <div className="text-4xl mb-4">🕒</div>
              <h3 className="text-xl font-semibold mb-3">Appointment Scheduling</h3>
              <p className="text-gray-600">Efficient scheduling and management of patient appointments</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition duration-300">
              <div className="text-4xl mb-4">💊</div>
              <h3 className="text-xl font-semibold mb-3">Prescription Management</h3>
              <p className="text-gray-600">Digital prescription creation and medication tracking</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition duration-300">
              <div className="text-4xl mb-4">👨‍⚕️</div>
              <h3 className="text-xl font-semibold mb-3">Doctor Dashboard</h3>
              <p className="text-gray-600">Streamlined interface for healthcare providers</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition duration-300">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-semibold mb-3">Admin Controls</h3>
              <p className="text-gray-600">Complete administrative oversight and reporting</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition duration-300">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-3">Secure Database</h3>
              <p className="text-gray-600">Enterprise-grade security for sensitive medical data</p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div id="benefits" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Benefits</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Transform your healthcare delivery with our advanced system
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 hover:bg-gray-50 rounded-lg transition duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-xl">⚡</span>
              </div>
              <h3 className="font-semibold mb-2">Increased Efficiency</h3>
              <p className="text-gray-600 text-sm">Automate routine tasks and reduce administrative workload</p>
            </div>
            
            <div className="text-center p-6 hover:bg-gray-50 rounded-lg transition duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-xl">🔒</span>
              </div>
              <h3 className="font-semibold mb-2">Enhanced Security</h3>
              <p className="text-gray-600 text-sm">Protect patient data with enterprise-grade security</p>
            </div>
            
            <div className="text-center p-6 hover:bg-gray-50 rounded-lg transition duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 text-xl">📈</span>
              </div>
              <h3 className="font-semibold mb-2">Better Insights</h3>
              <p className="text-gray-600 text-sm">Make data-driven decisions with comprehensive analytics</p>
            </div>
            
            <div className="text-center p-6 hover:bg-gray-50 rounded-lg transition duration-300">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-orange-600 text-xl">💬</span>
              </div>
              <h3 className="font-semibold mb-2">Improved Care</h3>
              <p className="text-gray-600 text-sm">Enhance patient experience and quality of care</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Healthcare Management?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of healthcare providers using MediCare DBMS
          </p>
          <Link 
            to="/signup" 
            className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-semibold text-lg transition duration-300 transform hover:scale-105"
          >
            Get Started Today
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-2xl font-bold mb-4">MediCare DBMS</div>
            <p className="text-gray-400 mb-6">Transforming Healthcare Management</p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition duration-200">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-200">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-200">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;