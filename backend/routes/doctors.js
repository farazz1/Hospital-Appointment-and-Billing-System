// ==============================================
// doctors.js
// Handles all API routes related to doctors
// ==============================================

const express = require("express");
const router = express.Router();
const getConnection = require("../dbConfig");

// GET all doctors
router.get("/", async (req, res) => {
  try {
    const conn = await getConnection();
    const result = await conn.execute("SELECT * FROM Doctor");
    await conn.close();
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching doctors:", err);
    res.status(500).json({ error: "Error fetching doctors" });
  }
});

// POST (add new doctor)
router.post("/", async (req, res) => {
  const { doctor_id, doctor_name, specialization, contact_no } = req.body;
  try {
    const conn = await getConnection();
    await conn.execute(
      `INSERT INTO Doctor (doctor_id, doctor_name, specialization, contact_no)
       VALUES (:id, :name, :spec, :contact)`,
      { id: doctor_id, name: doctor_name, spec: specialization, contact: contact_no },
      { autoCommit: true }
    );
    await conn.close();
    res.json({ message: "Doctor added successfully!" });
  } catch (err) {
    console.error("Error adding doctor:", err);
    res.status(500).json({ error: "Error adding doctor" });
  }
});

// PUT (update doctor)
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { doctor_name, specialization, contact_no } = req.body;
  try {
    const conn = await getConnection();
    await conn.execute(
      `UPDATE Doctor
       SET doctor_name = :name, specialization = :spec, contact_no = :contact
       WHERE doctor_id = :id`,
      { id, name: doctor_name, spec: specialization, contact: contact_no },
      { autoCommit: true }
    );
    await conn.close();
    res.json({ message: "Doctor updated successfully!" });
  } catch (err) {
    console.error("Error updating doctor:", err);
    res.status(500).json({ error: "Error updating doctor" });
  }
});

// DELETE doctor
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const conn = await getConnection();
    await conn.execute(`DELETE FROM Doctor WHERE doctor_id = :id`, { id }, { autoCommit: true });
    await conn.close();
    res.json({ message: "Doctor deleted successfully!" });
  } catch (err) {
    console.error("Error deleting doctor:", err);
    res.status(500).json({ error: "Error deleting doctor" });
  }
});

module.exports = router;
