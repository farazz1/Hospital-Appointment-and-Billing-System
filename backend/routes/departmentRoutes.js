const express = require("express");
const router = express.Router();
const getConnection = require("../dbConfig");

// Get all departments
router.get("/", async (req, res) => {
  let connection;
  try {
    connection = await getConnection();

    const result = await connection.execute(
      `SELECT d.department_id, d.name, d.floor, d.max_capacity, d.head_doctor_id,
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
      headDoctorId: row.HEAD_DOCTOR_ID,
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

// CREATE new department
router.post("/", async (req, res) => {
  let connection;
  try {
    const { name, floor, maxCapacity, headDoctorId } = req.body;
    
    // Validate required fields
    if (!name) {
      return res.status(400).json({ error: "Department name is required" });
    }
    if (!floor) {
      return res.status(400).json({ error: "Floor number is required" });
    }

    connection = await getConnection();

    // Create department using sequence
    const result = await connection.execute(
      `INSERT INTO departments (department_id, name, floor, max_capacity, head_doctor_id, created_at)
       VALUES (seq_departments.NEXTVAL, :name, :floor, :maxCapacity, :headDoctorId, CURRENT_TIMESTAMP)`,
      {
        name: name,
        floor: parseInt(floor),
        maxCapacity: maxCapacity ? parseInt(maxCapacity) : 100, // Default to 100 if not provided
        headDoctorId: headDoctorId ? parseInt(headDoctorId) : null
      },
      { autoCommit: false }
    );

    // Get the last inserted department_id using CURRVAL
    const deptIdResult = await connection.execute(
      "SELECT seq_departments.CURRVAL as department_id FROM DUAL",
      {},
      { outFormat: require('oracledb').OBJECT }
    );
    const nextDeptId = deptIdResult.rows[0].DEPARTMENT_ID;

    console.log("Created department with ID:", nextDeptId);

    await connection.commit();

    res.status(201).json({ 
      message: "Department created successfully",
      id: nextDeptId
    });

  } catch (error) {
    // Rollback on error
    if (connection) {
      try { 
        await connection.rollback(); 
      } catch (rollbackError) { 
        console.error("Rollback error:", rollbackError); 
      }
    }
    console.error("Error creating department:", error);
    
    // Handle unique constraint violations
    if (error.errorNum === 1) {
      return res.status(400).json({ error: "Department name already exists" });
    }
    
    res.status(500).json({ 
      error: "Failed to create department", 
      details: error.message 
    });
  } finally {
    if (connection) {
      try { await connection.close(); } catch (err) { console.error(err); }
    }
  }
});

// UPDATE department
router.put("/:id", async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    const { name, floor, maxCapacity, headDoctorId } = req.body;
    
    connection = await getConnection();

    // Update department record
    const result = await connection.execute(
      `UPDATE departments 
       SET name = :name, 
           floor = :floor, 
           max_capacity = :maxCapacity, 
           head_doctor_id = :headDoctorId
       WHERE department_id = :id`,
      {
        id: parseInt(id),
        name: name,
        floor: parseInt(floor),
        maxCapacity: parseInt(maxCapacity),
        headDoctorId: headDoctorId ? parseInt(headDoctorId) : null
      },
      { autoCommit: false }
    );

    if (result.rowsAffected === 0) {
      await connection.rollback();
      return res.status(404).json({ error: "Department not found" });
    }

    await connection.commit();

    res.json({ 
      message: "Department updated successfully",
      id: parseInt(id)
    });

  } catch (error) {
    // Rollback on error
    if (connection) {
      try { await connection.rollback(); } catch (rollbackError) { console.error(rollbackError); }
    }
    console.error("Error updating department:", error);
    
    // Handle unique constraint violations
    if (error.errorNum === 1) {
      return res.status(400).json({ error: "Department name already exists" });
    }
    
    res.status(500).json({ 
      error: "Failed to update department", 
      details: error.message 
    });
  } finally {
    if (connection) {
      try { await connection.close(); } catch (err) { console.error(err); }
    }
  }
});

// DELETE department
router.delete("/:id", async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    connection = await getConnection();

    // First check if there are doctors assigned to this department
    const checkDoctors = await connection.execute(
      "SELECT COUNT(*) as doctor_count FROM doctors WHERE department_id = :id",
      { id: parseInt(id) },
      { outFormat: require('oracledb').OBJECT }
    );

    if (checkDoctors.rows[0].DOCTOR_COUNT > 0) {
      return res.status(400).json({ 
        error: "Cannot delete department", 
        message: "There are doctors assigned to this department. Please reassign or remove them first." 
      });
    }

    const result = await connection.execute(
      "DELETE FROM departments WHERE department_id = :id",
      { id: parseInt(id) },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: "Department not found" });
    }

    res.json({ message: "Department deleted successfully" });

  } catch (error) {
    console.error("Error deleting department:", error);
    res.status(500).json({ 
      error: "Failed to delete department", 
      details: error.message 
    });
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

// Get available head doctors for department assignment
router.get("/available/head-doctors", async (req, res) => {
  let connection;
  try {
    connection = await getConnection();

    const result = await connection.execute(
      `SELECT doctor_id, name, specialization 
       FROM doctors 
       WHERE status = 'Active'
       ORDER BY name`,
      {},
      { outFormat: require('oracledb').OBJECT }
    );

    res.json(result.rows.map(row => ({
      id: row.DOCTOR_ID,
      name: row.NAME,
      specialization: row.SPECIALIZATION
    })));

  } catch (error) {
    console.error("Error fetching head doctors:", error);
    res.status(500).json({ error: "Failed to fetch available head doctors", details: error.message });
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