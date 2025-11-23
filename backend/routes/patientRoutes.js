const express = require("express");
const router = express.Router();
const getConnection = require("../dbConfig");

// Get all patients
router.get("/", async (req, res) => {
  let connection;
  try {
    connection = await getConnection();

    const result = await connection.execute(
      `SELECT p.patient_id, p.name, p.date_of_birth, p.gender, p.blood_type, 
              p.phone, p.address, p.emergency_contact, p.medical_history,
              u.email
       FROM patients p
       JOIN users u ON p.user_id = u.user_id
       ORDER BY p.name`,
      {},
      { outFormat: require('oracledb').OBJECT }
    );

    console.log("Patients query result:", result.rows);

    res.json(result.rows.map(row => ({
      id: row.PATIENT_ID,
      name: row.NAME,
      email: row.EMAIL,
      dateOfBirth: formatDate(row.DATE_OF_BIRTH),
      age: calculateAge(row.DATE_OF_BIRTH),
      gender: row.GENDER,
      bloodType: row.BLOOD_TYPE,
      phone: row.PHONE,
      address: row.ADDRESS,
      emergencyContact: row.EMERGENCY_CONTACT,
      medicalHistory: row.MEDICAL_HISTORY
    })));

  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ 
      error: "Failed to fetch patients", 
      details: error.message 
    });
  } finally {
    if (connection) {
      try { await connection.close(); } catch (err) { console.error(err); }
    }
  }
});

// Get patient by ID
router.get("/:id", async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    connection = await getConnection();

    const result = await connection.execute(
      `SELECT p.patient_id, p.name, p.date_of_birth, p.gender, p.blood_type, 
              p.phone, p.address, p.emergency_contact, p.medical_history,
              u.email
       FROM patients p
       JOIN users u ON p.user_id = u.user_id
       WHERE p.patient_id = :id`,
      { id: parseInt(id) },
      { outFormat: require('oracledb').OBJECT }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const patient = result.rows[0];
    res.json({
      id: patient.PATIENT_ID,
      name: patient.NAME,
      email: patient.EMAIL,
      dateOfBirth: formatDate(patient.DATE_OF_BIRTH),
      age: calculateAge(patient.DATE_OF_BIRTH),
      gender: patient.GENDER,
      bloodType: patient.BLOOD_TYPE,
      phone: patient.PHONE,
      address: patient.ADDRESS,
      emergencyContact: patient.EMERGENCY_CONTACT,
      medicalHistory: patient.MEDICAL_HISTORY
    });

  } catch (error) {
    console.error("Error fetching patient:", error);
    res.status(500).json({ error: "Failed to fetch patient", details: error.message });
  } finally {
    if (connection) {
      try { await connection.close(); } catch (err) { console.error(err); }
    }
  }
});

// Update patient information - THIS WAS MISSING!
router.put("/:id", async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    const { name, dateOfBirth, gender, bloodType, phone, address, emergencyContact, medicalHistory } = req.body;
    
    console.log("🟡 Updating patient:", id, { name, dateOfBirth, gender, bloodType, phone, address, emergencyContact });
    
    connection = await getConnection();

    await connection.execute(
      `UPDATE patients 
       SET name = :name, date_of_birth = TO_DATE(:dateOfBirth, 'YYYY-MM-DD'), gender = :gender,
           blood_type = :bloodType, phone = :phone, address = :address, 
           emergency_contact = :emergencyContact, medical_history = :medicalHistory
       WHERE patient_id = :id`,
      {
        id: parseInt(id),
        name,
        dateOfBirth,
        gender,
        bloodType,
        phone,
        address,
        emergencyContact,
        medicalHistory: medicalHistory || ''
      }
    );

    await connection.commit();
    console.log("✅ Patient information updated successfully");
    
    res.json({ success: true, message: "Patient information updated successfully" });

  } catch (error) {
    console.error("❌ Error updating patient:", error);
    if (connection) await connection.rollback();
    res.status(500).json({ 
      success: false, 
      message: "Failed to update patient information",
      error: error.message 
    });
  } finally {
    if (connection) {
      try { await connection.close(); } catch (err) { console.error(err); }
    }
  }
});

// Update user email (if needed)
router.put("/:id/email", async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    const { email } = req.body;
    
    console.log("🟡 Updating patient email:", id, email);
    
    connection = await getConnection();

    // First get the user_id from patient
    const patientResult = await connection.execute(
      `SELECT user_id FROM patients WHERE patient_id = :id`,
      { id: parseInt(id) },
      { outFormat: require('oracledb').OBJECT }
    );

    if (patientResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    const userId = patientResult.rows[0].USER_ID;

    // Update user email
    await connection.execute(
      `UPDATE users SET email = :email WHERE user_id = :userId`,
      { email, userId }
    );

    await connection.commit();
    console.log("✅ Patient email updated successfully");
    
    res.json({ success: true, message: "Email updated successfully" });

  } catch (error) {
    console.error("❌ Error updating patient email:", error);
    if (connection) await connection.rollback();
    res.status(500).json({ 
      success: false, 
      message: "Failed to update email",
      error: error.message 
    });
  } finally {
    if (connection) {
      try { await connection.close(); } catch (err) { console.error(err); }
    }
  }
});

function calculateAge(dateOfBirth) {
  if (!dateOfBirth) return 0;
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

function formatDate(date) {
  if (!date) return '';
  return new Date(date).toISOString().split('T')[0];
}

module.exports = router;