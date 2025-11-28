const express = require("express");
const router = express.Router();
const getConnection = require("../dbConfig");

// Helper function to safely extract data from Oracle results
function safeExtractData(oracleRow) {
  // Create a completely clean object
  const cleanData = {};
  
  // Manually extract each property to avoid circular references
  if (oracleRow.PATIENT_ID !== undefined) cleanData.PATIENT_ID = oracleRow.PATIENT_ID;
  if (oracleRow.NAME !== undefined) cleanData.NAME = String(oracleRow.NAME || '');
  if (oracleRow.EMAIL !== undefined) cleanData.EMAIL = String(oracleRow.EMAIL || '');
  if (oracleRow.DATE_OF_BIRTH !== undefined) cleanData.DATE_OF_BIRTH = oracleRow.DATE_OF_BIRTH;
  if (oracleRow.GENDER !== undefined) cleanData.GENDER = String(oracleRow.GENDER || '');
  if (oracleRow.BLOOD_TYPE !== undefined) cleanData.BLOOD_TYPE = String(oracleRow.BLOOD_TYPE || '');
  if (oracleRow.PHONE !== undefined) cleanData.PHONE = String(oracleRow.PHONE || '');
  if (oracleRow.ADDRESS !== undefined) cleanData.ADDRESS = String(oracleRow.ADDRESS || '');
  if (oracleRow.EMERGENCY_CONTACT !== undefined) cleanData.EMERGENCY_CONTACT = String(oracleRow.EMERGENCY_CONTACT || '');
  if (oracleRow.MEDICAL_HISTORY !== undefined) cleanData.MEDICAL_HISTORY = String(oracleRow.MEDICAL_HISTORY || '');
  
  return cleanData;
}

// Get all patients - WITH CLOB FIX
router.get("/", async (req, res) => {
  let connection;
  try {
    connection = await getConnection();

    const result = await connection.execute(
      `SELECT p.patient_id, p.name, p.date_of_birth, p.gender, p.blood_type, 
              p.phone, p.address, p.emergency_contact, 
              NVL(DBMS_LOB.SUBSTR(p.medical_history, 4000, 1), '') as medical_history, -- CLOB FIX
              u.email
       FROM patients p
       JOIN users u ON p.user_id = u.user_id
       ORDER BY p.name`,
      {},
      { outFormat: require('oracledb').OBJECT }
    );

    console.log("Patients query result count:", result.rows.length);

    // Use safe extraction
    const patients = result.rows.map(row => {
      const cleanRow = safeExtractData(row);
      return {
        id: cleanRow.PATIENT_ID,
        name: cleanRow.NAME,
        email: cleanRow.EMAIL,
        dateOfBirth: formatDate(cleanRow.DATE_OF_BIRTH),
        age: calculateAge(cleanRow.DATE_OF_BIRTH),
        gender: cleanRow.GENDER,
        bloodType: cleanRow.BLOOD_TYPE,
        phone: cleanRow.PHONE,
        address: cleanRow.ADDRESS,
        emergencyContact: cleanRow.EMERGENCY_CONTACT,
        medicalHistory: cleanRow.MEDICAL_HISTORY
      };
    });

    res.json(patients);

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

// Get patient by ID - WITH CLOB FIX
router.get("/:id", async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    console.log("🔍 Fetching patient with ID:", id);
    
    connection = await getConnection();

    const result = await connection.execute(
      `SELECT p.patient_id, p.name, p.date_of_birth, p.gender, p.blood_type, 
              p.phone, p.address, p.emergency_contact, 
              NVL(DBMS_LOB.SUBSTR(p.medical_history, 4000, 1), '') as medical_history, -- CLOB FIX
              u.email
       FROM patients p
       JOIN users u ON p.user_id = u.user_id
       WHERE p.patient_id = :id`,
      { id: parseInt(id) },
      { outFormat: require('oracledb').OBJECT }
    );

    console.log("Query result rows:", result.rows.length);

    if (result.rows.length === 0) {
      console.log("❌ Patient not found:", id);
      return res.status(404).json({ error: "Patient not found" });
    }

    // Use the safe extraction function
    const cleanPatient = safeExtractData(result.rows[0]);
    
    console.log("✅ Clean patient data extracted:", {
      id: cleanPatient.PATIENT_ID,
      hasName: !!cleanPatient.NAME,
      hasEmail: !!cleanPatient.EMAIL,
      medicalHistoryType: typeof cleanPatient.MEDICAL_HISTORY,
      medicalHistoryLength: cleanPatient.MEDICAL_HISTORY ? cleanPatient.MEDICAL_HISTORY.length : 0
    });

    const patientData = {
      id: cleanPatient.PATIENT_ID,
      name: cleanPatient.NAME,
      email: cleanPatient.EMAIL,
      dateOfBirth: formatDate(cleanPatient.DATE_OF_BIRTH),
      age: calculateAge(cleanPatient.DATE_OF_BIRTH),
      gender: cleanPatient.GENDER,
      bloodType: cleanPatient.BLOOD_TYPE,
      phone: cleanPatient.PHONE,
      address: cleanPatient.ADDRESS,
      emergencyContact: cleanPatient.EMERGENCY_CONTACT,
      medicalHistory: cleanPatient.MEDICAL_HISTORY
    };

    console.log("📤 Sending patient data for ID:", id);
    res.json(patientData);

  } catch (error) {
    console.error("❌ Error fetching patient:", error);
    res.status(500).json({ 
      error: "Failed to fetch patient", 
      details: error.message 
    });
  } finally {
    if (connection) {
      try { 
        await connection.close(); 
        console.log("✅ Database connection closed");
      } catch (err) { 
        console.error("Error closing connection:", err); 
      }
    }
  }
});

// Emergency backup route - WITH CLOB FIX
router.get("/:id/debug", async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    console.log("🐛 DEBUG: Fetching patient with ID:", id);
    
    connection = await getConnection();

    const result = await connection.execute(
      `SELECT p.patient_id, p.name, p.date_of_birth, p.gender, p.blood_type, 
              p.phone, p.address, p.emergency_contact, 
              NVL(DBMS_LOB.SUBSTR(p.medical_history, 4000, 1), '') as medical_history, -- CLOB FIX
              u.email
       FROM patients p
       JOIN users u ON p.user_id = u.user_id
       WHERE p.patient_id = :id`,
      { id: parseInt(id) },
      { outFormat: require('oracledb').OBJECT } // Keep OBJECT format for consistency
    );

    console.log("🐛 DEBUG: Query result:", {
      rows: result.rows ? result.rows.length : 'no rows',
      medicalHistorySample: result.rows && result.rows[0] ? 
        (typeof result.rows[0].MEDICAL_HISTORY + ': ' + 
         (result.rows[0].MEDICAL_HISTORY ? 
          result.rows[0].MEDICAL_HISTORY.substring(0, 50) + '...' : 'empty')) : 'no data'
    });

    if (!result.rows || result.rows.length === 0) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const row = result.rows[0];
    const patientData = {
      id: row.PATIENT_ID,
      name: String(row.NAME || ''),
      email: String(row.EMAIL || ''),
      dateOfBirth: formatDate(row.DATE_OF_BIRTH),
      age: calculateAge(row.DATE_OF_BIRTH),
      gender: String(row.GENDER || ''),
      bloodType: String(row.BLOOD_TYPE || ''),
      phone: String(row.PHONE || ''),
      address: String(row.ADDRESS || ''),
      emergencyContact: String(row.EMERGENCY_CONTACT || ''),
      medicalHistory: String(row.MEDICAL_HISTORY || '')
    };

    console.log("🐛 DEBUG: Successfully created patient data with medical history type:", typeof patientData.medicalHistory);
    res.json(patientData);

  } catch (error) {
    console.error("🐛 DEBUG: Error:", error);
    res.status(500).json({ 
      error: "Failed to fetch patient", 
      details: error.message 
    });
  } finally {
    if (connection) {
      try { await connection.close(); } catch (err) { console.error(err); }
    }
  }
});

// Update patient information - NO CHANGES NEEDED HERE
router.put("/:id", async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    const { name, dateOfBirth, gender, bloodType, phone, address, emergencyContact, medicalHistory } = req.body;
    
    console.log("🟡 Updating patient:", id);
    
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

// Update user email - NO CHANGES NEEDED HERE
router.put("/:id/email", async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    const { email } = req.body;
    
    console.log("🟡 Updating patient email:", id, email);
    
    connection = await getConnection();

    const patientResult = await connection.execute(
      `SELECT user_id FROM patients WHERE patient_id = :id`,
      { id: parseInt(id) },
      { outFormat: require('oracledb').OBJECT }
    );

    if (patientResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    const userId = patientResult.rows[0].USER_ID;

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