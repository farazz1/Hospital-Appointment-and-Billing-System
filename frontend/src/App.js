import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/SignUp";
import Home from "./pages/Home";
import About from "./pages/About";
import Features from "./pages/Features";
import UserDashboard from "./components/User/UserDashboard";
import UserInfo from "./components/User/UserInfo";
import UserBills from "./components/User/UserBills";
import UserAppointments from "./components/User/UserAppointments";
import BookAppointment from "./components/User/BookAppointment";
import AdminDashboard from "./components/Admin/AdminDashboard";
import AdminDepartments from "./components/Admin/AdminDepartments";
import AdminDoctors from "./components/Admin/AdminDoctors";
import AdminPatients from "./components/Admin/AdminPatients";
import AdminReports from "./components/Admin/AdminReports";
import DoctorDashboard from "./components/Doctor/DoctorDash";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          
          {/* User Routes */}
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/user-info" element={<UserInfo />} />
          <Route path="/user-bills" element={<UserBills />} />
          <Route path="/user-appointments" element={<UserAppointments />} />
          <Route path="/book-appointment" element={<BookAppointment />} />
          
          {/* Admin Routes */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-departments" element={<AdminDepartments />} />
          <Route path="/admin-doctors" element={<AdminDoctors />} />
          <Route path="/admin-patients" element={<AdminPatients />} />
          <Route path="/admin-reports" element={<AdminReports />} />
          
          {/* Doctor Routes */}
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;