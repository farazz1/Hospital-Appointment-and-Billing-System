const express = require("express");
const router = express.Router();
const getConnection = require("../dbConfig");

// Create prescription
router.post("/", async (req, res) => {
  let connection;
  try {
    const { appointmentId, diagnosis, notes, medicines } = req.body;
    connection = await getConnection();

    // Create prescription
    const prescriptionResult = await connection.execute(
      `INSERT INTO prescriptions (prescription_id, appointment_id, diagnosis, notes)
       VALUES (seq_prescriptions.NEXTVAL, :appointmentId, :diagnosis, :notes)
       RETURNING prescription_id INTO :prescriptionId`,
      {
        appointmentId: parseInt(appointmentId),
        diagnosis,
        notes,
        prescriptionId: { type: require('oracledb').NUMBER, dir: require('oracledb').BIND_OUT }
      }
    );

    const prescriptionId = prescriptionResult.outBinds.prescriptionId[0];

    // Add medicines
    if (medicines && medicines.length > 0) {
      for (const medicine of medicines) {
        await connection.execute(
          `INSERT INTO prescription_medicines (medicine_id, prescription_id, medicine_name, dosage, duration, instructions)
           VALUES (seq_medicines.NEXTVAL, :prescriptionId, :name, :dosage, :duration, :instructions)`,
          {
            prescriptionId,
            name: medicine.name,
            dosage: medicine.dosage,
            duration: medicine.duration,
            instructions: medicine.instructions || ''
          }
        );
      }
    }

    await connection.commit();
    res.json({ 
      success: true, 
      message: "Prescription created successfully",
      prescriptionId 
    });

  } catch (error) {
    console.error("Error creating prescription:", error);
    if (connection) await connection.rollback();
    res.status(500).json({ success: false, message: "Failed to create prescription" });
  } finally {
    if (connection) {
      try { await connection.close(); } catch (err) { console.error(err); }
    }
  }
});

// Get prescription by appointment ID - CLOB FIX
router.get("/appointment/:appointmentId", async (req, res) => {
  let connection;
  try {
    const { appointmentId } = req.params;
    console.log("🟡 Looking for prescription for appointment:", appointmentId);
    
    connection = await getConnection();

    // Use DBMS_LOB.SUBSTR to convert CLOB to VARCHAR2 at database level
    const prescriptionResult = await connection.execute(
      `SELECT 
         p.prescription_id, 
         NVL(DBMS_LOB.SUBSTR(p.diagnosis, 4000, 1), '') as diagnosis,
         NVL(DBMS_LOB.SUBSTR(p.notes, 4000, 1), '') as notes,
         TO_CHAR(p.created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at,
         TO_CHAR(a.appointment_date, 'YYYY-MM-DD') as appointment_date, 
         a.appointment_time,
         pat.name as patient_name, 
         pat.patient_id, 
         TO_CHAR(pat.date_of_birth, 'YYYY-MM-DD') as date_of_birth, 
         pat.gender,
         doc.name as doctor_name, 
         doc.specialization
       FROM prescriptions p
       JOIN appointments a ON p.appointment_id = a.appointment_id
       JOIN patients pat ON a.patient_id = pat.patient_id
       JOIN doctors doc ON a.doctor_id = doc.doctor_id
       WHERE p.appointment_id = :appointmentId`,
      { appointmentId: parseInt(appointmentId) },
      { outFormat: require('oracledb').OBJECT }
    );

    if (!prescriptionResult.rows || prescriptionResult.rows.length === 0) {
      return res.status(404).json({ error: "Prescription not found for this appointment" });
    }

    const p = prescriptionResult.rows[0];

    // Get medicines
    const medicinesResult = await connection.execute(
      `SELECT medicine_name, dosage, duration, instructions
       FROM prescription_medicines
       WHERE prescription_id = :prescriptionId
       ORDER BY medicine_id`,
      { prescriptionId: p.PRESCRIPTION_ID },
      { outFormat: require('oracledb').OBJECT }
    );

    // Build response - values should now be simple strings
    const response = {
      prescriptionId: p.PRESCRIPTION_ID,
      diagnosis: p.DIAGNOSIS,  // Now a string instead of CLOB object
      notes: p.NOTES,          // Now a string instead of CLOB object
      createdAt: p.CREATED_AT,
      appointmentDate: p.APPOINTMENT_DATE,
      appointmentTime: p.APPOINTMENT_TIME,
      patientName: p.PATIENT_NAME,
      patientId: p.PATIENT_ID,
      age: calculateAge(p.DATE_OF_BIRTH),
      gender: p.GENDER,
      doctorName: p.DOCTOR_NAME,
      specialization: p.SPECIALIZATION,
      medicines: []
    };

    // Add medicines
    if (medicinesResult.rows) {
      medicinesResult.rows.forEach(med => {
        response.medicines.push({
          name: med.MEDICINE_NAME,
          dosage: med.DOSAGE,
          duration: med.DURATION,
          instructions: med.INSTRUCTIONS
        });
      });
    }

    console.log("✅ FINAL DATA AFTER CLOB CONVERSION:");
    console.log("Diagnosis:", response.diagnosis, "Type:", typeof response.diagnosis);
    console.log("Notes:", response.notes, "Type:", typeof response.notes);
    
    // Test JSON serialization
    try {
      JSON.stringify(response);
      console.log("✅ Response can be serialized to JSON");
    } catch (e) {
      console.log("❌ JSON serialization failed");
    }

    // Send response
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(response));

  } catch (error) {
    console.error("❌ Error fetching prescription:", error);
    res.status(500).json({ error: "Failed to fetch prescription" });
  } finally {
    if (connection) await connection.close();
  }
});

function calculateAge(dateOfBirthString) {
  if (!dateOfBirthString) return 0;
  
  try {
    const today = new Date();
    const birthDate = new Date(dateOfBirthString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  } catch (error) {
    console.error("Error calculating age:", error);
    return 0;
  }
}

module.exports = router;