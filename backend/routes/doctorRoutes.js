const express = require("express");
const router = express.Router();
const getConnection = require("../dbConfig");

// Get all doctors (with email from users table)
router.get("/", async (req, res) => {
  let connection;
  try {
    connection = await getConnection();

    const result = await connection.execute(
      `SELECT d.doctor_id, d.name, d.specialization, d.phone, d.license_number,
              d.experience_years, d.consultation_fee, d.status, d.user_id,
              dep.name as department_name, dep.department_id,
              u.email
       FROM doctors d
       JOIN departments dep ON d.department_id = dep.department_id
       LEFT JOIN users u ON d.user_id = u.user_id
       ORDER BY d.name`,
      {},
      { outFormat: require('oracledb').OBJECT }
    );

    res.json(result.rows.map(row => ({
      id: row.DOCTOR_ID,
      name: row.NAME,
      specialization: row.SPECIALIZATION,
      department: row.DEPARTMENT_NAME,
      departmentId: row.DEPARTMENT_ID,
      email: row.EMAIL,
      phone: row.PHONE,
      licenseNumber: row.LICENSE_NUMBER,
      experience: `${row.EXPERIENCE_YEARS} years`,
      consultationFee: row.CONSULTATION_FEE,
      status: row.STATUS,
      userId: row.USER_ID
    })));

  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ 
      error: "Failed to fetch doctors", 
      details: error.message
    });
  } finally {
    if (connection) {
      try { await connection.close(); } catch (err) { console.error(err); }
    }
  }
});

// CREATE new doctor - SIMPLIFIED AND WORKING VERSION
router.post("/", async (req, res) => {
  let connection;
  try {
    const { name, specialization, departmentId, email, phone, experience, consultationFee, status, licenseNumber } = req.body;
    
    // Validate required fields
    if (!licenseNumber) {
      return res.status(400).json({ error: "License number is required" });
    }
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    if (!departmentId) {
      return res.status(400).json({ error: "Department is required" });
    }

    connection = await getConnection();

    // 1. Create user account using sequence
    const userResult = await connection.execute(
      `INSERT INTO users (user_id, email, password, user_type, is_active, created_at)
       VALUES (seq_users.NEXTVAL, :email, :password, :userType, :isActive, CURRENT_TIMESTAMP)`,
      {
        email: email,
        password: 'temp_password',
        userType: 'doctor',
        isActive: 1
      },
      { autoCommit: false } // Don't auto-commit, we'll commit after both inserts
    );

    // 2. Get the last inserted user_id using CURRVAL
    const userIdResult = await connection.execute(
      "SELECT seq_users.CURRVAL as user_id FROM DUAL",
      {},
      { outFormat: require('oracledb').OBJECT }
    );
    const nextUserId = userIdResult.rows[0].USER_ID;

    console.log("Created user with ID:", nextUserId);

    // 3. Create doctor record using sequence
    const doctorResult = await connection.execute(
      `INSERT INTO doctors (doctor_id, user_id, department_id, name, specialization, license_number, phone, experience_years, consultation_fee, status, created_at)
       VALUES (seq_doctors.NEXTVAL, :userId, :departmentId, :name, :specialization, :licenseNumber, :phone, :experience, :consultationFee, :status, CURRENT_TIMESTAMP)`,
      {
        userId: nextUserId,
        departmentId: parseInt(departmentId),
        name: name,
        specialization: specialization,
        licenseNumber: licenseNumber,
        phone: phone,
        experience: parseInt(experience),
        consultationFee: parseFloat(consultationFee),
        status: status || 'Active'
      },
      { autoCommit: false }
    );

    // 4. Get the last inserted doctor_id using CURRVAL
    const doctorIdResult = await connection.execute(
      "SELECT seq_doctors.CURRVAL as doctor_id FROM DUAL",
      {},
      { outFormat: require('oracledb').OBJECT }
    );
    const nextDoctorId = doctorIdResult.rows[0].DOCTOR_ID;

    console.log("Created doctor with ID:", nextDoctorId);

    // Commit both inserts
    await connection.commit();

    res.status(201).json({ 
      message: "Doctor created successfully",
      id: nextDoctorId,
      userId: nextUserId
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
    console.error("Error creating doctor:", error);
    
    // Handle unique constraint violations
    if (error.errorNum === 1) {
      if (error.message.includes('LICENSE_NUMBER')) {
        return res.status(400).json({ error: "License number already exists" });
      } else if (error.message.includes('EMAIL')) {
        return res.status(400).json({ error: "Email already exists" });
      }
    }
    
    res.status(500).json({ 
      error: "Failed to create doctor", 
      details: error.message 
    });
  } finally {
    if (connection) {
      try { await connection.close(); } catch (err) { console.error(err); }
    }
  }
});

// UPDATE doctor
router.put("/:id", async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    const { name, specialization, departmentId, email, phone, experience, consultationFee, status } = req.body;
    
    connection = await getConnection();

    // 1. Get the user_id for this doctor
    const doctorResult = await connection.execute(
      "SELECT user_id FROM doctors WHERE doctor_id = :id",
      { id: parseInt(id) },
      { outFormat: require('oracledb').OBJECT }
    );

    if (doctorResult.rows.length === 0) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    const userId = doctorResult.rows[0].USER_ID;

    // 2. Update user email
    if (userId && email) {
      await connection.execute(
        `UPDATE users SET email = :email WHERE user_id = :userId`,
        {
          userId: userId,
          email: email
        },
        { autoCommit: false }
      );
    }

    // 3. Update doctor record
    const result = await connection.execute(
      `UPDATE doctors 
       SET name = :name, 
           specialization = :specialization, 
           department_id = :departmentId, 
           phone = :phone, 
           experience_years = :experience, 
           consultation_fee = :consultationFee, 
           status = :status
       WHERE doctor_id = :id`,
      {
        id: parseInt(id),
        name: name,
        specialization: specialization,
        departmentId: parseInt(departmentId),
        phone: phone,
        experience: parseInt(experience),
        consultationFee: parseFloat(consultationFee),
        status: status
      },
      { autoCommit: false }
    );

    if (result.rowsAffected === 0) {
      await connection.rollback();
      return res.status(404).json({ error: "Doctor not found" });
    }

    await connection.commit();

    res.json({ 
      message: "Doctor updated successfully",
      id: parseInt(id)
    });

  } catch (error) {
    // Rollback on error
    if (connection) {
      try { await connection.rollback(); } catch (rollbackError) { console.error(rollbackError); }
    }
    console.error("Error updating doctor:", error);
    res.status(500).json({ 
      error: "Failed to update doctor", 
      details: error.message 
    });
  } finally {
    if (connection) {
      try { await connection.close(); } catch (err) { console.error(err); }
    }
  }
});

// DELETE doctor
router.delete("/:id", async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    connection = await getConnection();

    const result = await connection.execute(
      "DELETE FROM doctors WHERE doctor_id = :id",
      { id: parseInt(id) },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    res.json({ message: "Doctor deleted successfully" });

  } catch (error) {
    console.error("Error deleting doctor:", error);
    res.status(500).json({ 
      error: "Failed to delete doctor", 
      details: error.message 
    });
  } finally {
    if (connection) {
      try { await connection.close(); } catch (err) { console.error(err); }
    }
  }
});

module.exports = router;