// ==========================================================
// File: server.js
// Description: Main entry point for backend server (Express app)
// Created by: Faraz & Ashhal
// ==========================================================

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5000; // React runs on 3000, backend on 5000

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// Import routes
const doctorRoutes = require("./routes/doctors");
const patientRoutes = require("./routes/patients");
const appointmentRoutes = require("./routes/appointments");
const billRoutes = require("./routes/bills");

// Use routes
app.use("/api/doctors", doctorRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/bills", billRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("🏥 Hospital Backend API is running...");
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
