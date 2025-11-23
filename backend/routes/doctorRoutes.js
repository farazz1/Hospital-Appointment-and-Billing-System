const express = require("express");
const router = express.Router();
const getConnection = require("../dbConfig");

// Get all doctors
router.get("/", async (req, res) => {
  let connection;
  try {
    connection = await getConnection();

    const result = await connection.execute(
      `SELECT d.doctor_id, d.name, d.specialization, d.phone, 
              d.experience_years, d.consultation_fee, d.status,
              dep.name as department_name, dep.department_id
       FROM doctors d
       JOIN departments dep ON d.department_id = dep.department_id
       ORDER BY d.name`,
      {},
      { outFormat: require('oracledb').OBJECT }
    );

    console.log("Doctors query result:", result.rows); // Debug log

    res.json(result.rows.map(row => ({
      id: row.DOCTOR_ID,
      name: row.NAME,
      specialization: row.SPECIALIZATION,
      department: row.DEPARTMENT_NAME,
      departmentId: row.DEPARTMENT_ID,
      phone: row.PHONE,
      experience: `${row.EXPERIENCE_YEARS} years`,
      consultationFee: row.CONSULTATION_FEE,
      status: row.STATUS
    })));

  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ 
      error: "Failed to fetch doctors", 
      details: error.message,
      code: error.errorNum 
    });
  } finally {
    if (connection) {
      try { await connection.close(); } catch (err) { console.error(err); }
    }
  }
});

// Get doctor by ID
router.get("/:id", async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    connection = await getConnection();

    const result = await connection.execute(
      `SELECT d.doctor_id, d.name, d.specialization, d.phone, 
              d.experience_years, d.consultation_fee, d.status, d.license_number,
              dep.name as department_name, dep.department_id
       FROM doctors d
       JOIN departments dep ON d.department_id = dep.department_id
       WHERE d.doctor_id = :id`,
      { id: parseInt(id) },
      { outFormat: require('oracledb').OBJECT }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    const doctor = result.rows[0];
    res.json({
      id: doctor.DOCTOR_ID,
      name: doctor.NAME,
      specialization: doctor.SPECIALIZATION,
      department: doctor.DEPARTMENT_NAME,
      departmentId: doctor.DEPARTMENT_ID,
      phone: doctor.PHONE,
      experience: `${doctor.EXPERIENCE_YEARS} years`,
      consultationFee: doctor.CONSULTATION_FEE,
      status: doctor.STATUS,
      licenseNumber: doctor.LICENSE_NUMBER
    });

  } catch (error) {
    console.error("Error fetching doctor:", error);
    res.status(500).json({ error: "Failed to fetch doctor", details: error.message });
  } finally {
    if (connection) {
      try { await connection.close(); } catch (err) { console.error(err); }
    }
  }
});

module.exports = router;