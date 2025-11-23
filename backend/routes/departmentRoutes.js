const express = require("express");
const router = express.Router();
const getConnection = require("../dbConfig");

// Get all departments
router.get("/", async (req, res) => {
  let connection;
  try {
    connection = await getConnection();

    const result = await connection.execute(
      `SELECT d.department_id, d.name, d.floor, d.max_capacity,
              (SELECT name FROM doctors WHERE doctor_id = d.head_doctor_id) as head_doctor_name,
              (SELECT COUNT(*) FROM doctors WHERE department_id = d.department_id AND status = 'Active') as doctor_count,
              (SELECT COUNT(*) FROM appointments a 
               JOIN doctors doc ON a.doctor_id = doc.doctor_id 
               WHERE doc.department_id = d.department_id AND a.status = 'Scheduled') as patient_count
       FROM departments d
       ORDER BY d.name`,
      {},
      { outFormat: require('oracledb').OBJECT }
    );

    res.json(result.rows.map(row => ({
      id: row.DEPARTMENT_ID,
      name: row.NAME,
      head: row.HEAD_DOCTOR_NAME || 'Not Assigned',
      staff: row.DOCTOR_COUNT,
      patients: row.PATIENT_COUNT,
      floor: row.FLOOR,
      maxCapacity: row.MAX_CAPACITY
    })));

  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({ error: "Failed to fetch departments", details: error.message });
  } finally {
    if (connection) {
      try { await connection.close(); } catch (err) { console.error(err); }
    }
  }
});

// Get department statistics (simplified version)
router.get("/:id/stats", async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    connection = await getConnection();

    const result = await connection.execute(
      `SELECT 
         d.name as department_name,
         COUNT(DISTINCT doc.doctor_id) as doctor_count,
         COUNT(DISTINCT p.patient_id) as patient_count,
         COUNT(a.appointment_id) as appointment_count,
         NVL(SUM(CASE WHEN b.payment_status = 'Paid' THEN b.amount ELSE 0 END), 0) as total_revenue
       FROM departments d
       LEFT JOIN doctors doc ON d.department_id = doc.department_id
       LEFT JOIN appointments a ON doc.doctor_id = a.doctor_id
       LEFT JOIN patients p ON a.patient_id = p.patient_id
       LEFT JOIN bills b ON a.appointment_id = b.appointment_id
       WHERE d.department_id = :id
       GROUP BY d.name`,
      { id: parseInt(id) },
      { outFormat: require('oracledb').OBJECT }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Department not found" });
    }

    const stats = result.rows[0];
    res.json({
      departmentName: stats.DEPARTMENT_NAME,
      doctorCount: stats.DOCTOR_COUNT,
      patientCount: stats.PATIENT_COUNT,
      appointmentCount: stats.APPOINTMENT_COUNT,
      totalRevenue: stats.TOTAL_REVENUE
    });

  } catch (error) {
    console.error("Error fetching department stats:", error);
    res.status(500).json({ error: "Failed to fetch department statistics", details: error.message });
  } finally {
    if (connection) {
      try { await connection.close(); } catch (err) { console.error(err); }
    }
  }
});

// Simple test endpoint
router.get("/test/connection", async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute('SELECT 1 FROM DUAL');
    res.json({ success: true, message: "Database connection working" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    if (connection) {
      try { await connection.close(); } catch (err) { console.error(err); }
    }
  }
});

module.exports = router;