// ==============================================
// patients.js
// Handles all API routes related to patients
// ==============================================

const express = require("express");
const router = express.Router();
const getConnection = require("../dbConfig");

// GET all patients
router.get("/", async (req, res) => {
  try {
    const conn = await getConnection();
    const result = await conn.execute("SELECT * FROM Patient");
    await conn.close();
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching patients:", err);
    res.status(500).json({ error: "Error fetching patients" });
  }
});

// POST (add new patient)
router.post("/", async (req, res) => {
  const { patient_id, patient_name, gender, age, contact_no } = req.body;
  try {
    const conn = await getConnection();
    await conn.execute(
      `INSERT INTO Patient (patient_id, patient_name, gender, age, contact_no)
       VALUES (:id, :name, :gender, :age, :contact)`,
      { id: patient_id, name: patient_name, gender, age, contact: contact_no },
      { autoCommit: true }
    );
    await conn.close();
    res.json({ message: "Patient added successfully!" });
  } catch (err) {
    console.error("Error adding patient:", err);
    res.status(500).json({ error: "Error adding patient" });
  }
});

module.exports = router;
