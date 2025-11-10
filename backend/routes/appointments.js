// ==============================================
// appointments.js
// Handles all appointment routes
// ==============================================

const express = require("express");
const router = express.Router();
const getConnection = require("../dbConfig");

// GET all appointments
router.get("/", async (req, res) => {
  try {
    const conn = await getConnection();
    const result = await conn.execute(
      `SELECT a.appointment_id, p.patient_name, d.doctor_name, a.appointment_date
       FROM Appointment a
       JOIN Patient p ON a.patient_id = p.patient_id
       JOIN Doctor d ON a.doctor_id = d.doctor_id`
    );
    await conn.close();
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({ error: "Error fetching appointments" });
  }
});

// POST (book new appointment)
router.post("/", async (req, res) => {
  const { appointment_id, patient_id, doctor_id, appointment_date } = req.body;
  try {
    const conn = await getConnection();
    await conn.execute(
      `INSERT INTO Appointment (appointment_id, patient_id, doctor_id, appointment_date)
       VALUES (:id, :pid, :did, TO_DATE(:date, 'YYYY-MM-DD'))`,
      { id: appointment_id, pid: patient_id, did: doctor_id, date: appointment_date },
      { autoCommit: true }
    );
    await conn.close();
    res.json({ message: "Appointment booked successfully!" });
  } catch (err) {
    console.error("Error booking appointment:", err);
    res.status(500).json({ error: "Error booking appointment" });
  }
});

module.exports = router;
