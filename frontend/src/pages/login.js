import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from '../services/api';

const Login = () => {
  const [formData, setFormData] = useState({ 
    email: "", 
    password: "", 
    userType: "doctor" 
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await authAPI.login(formData);
      if (res.data.success) {
        const { user } = res.data;
        
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(user));
        
        // Redirect based on user type
        if (user.userType === 'admin') {
          navigate("/admin");
        } else if (user.userType === 'doctor') {
          navigate("/doctor");
        } else {
          navigate("/patients");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access your hospital management portal
          </p>
        </div>
      
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">User Type</label>
            <select 
              name="userType" 
              value={formData.userType} 
              onChange={handleChange} 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="doctor">Doctor</option>
              <option value="patient">Patient</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
            {/* CHANGED: type="text" instead of type="email" */}
            <input 
              type="text"  // ← THIS IS THE FIX
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Enter your username (e.g., sarah.johnson)"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="mt-4 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <a href="/signup" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign up here
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;