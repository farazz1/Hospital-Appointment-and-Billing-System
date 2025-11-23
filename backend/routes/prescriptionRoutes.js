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

// Get prescription by appointment ID - ADD DEBUG
router.get("/appointment/:appointmentId", async (req, res) => {
  let connection;
  try {
    const { appointmentId } = req.params;
    console.log("🟡 Looking for prescription for appointment:", appointmentId);
    
    connection = await getConnection();

    // Get prescription details
    const prescriptionResult = await connection.execute(
      `SELECT p.prescription_id, p.diagnosis, p.notes, p.created_at,
              a.appointment_date, a.appointment_time,
              pat.name as patient_name, pat.patient_id, pat.date_of_birth, pat.gender,
              doc.name as doctor_name, doc.specialization
       FROM prescriptions p
       JOIN appointments a ON p.appointment_id = a.appointment_id
       JOIN patients pat ON a.patient_id = pat.patient_id
       JOIN doctors doc ON a.doctor_id = doc.doctor_id
       WHERE p.appointment_id = :appointmentId`,
      { appointmentId: parseInt(appointmentId) },
      { outFormat: require('oracledb').OBJECT }
    );

    console.log("🔍 Prescription query result:", prescriptionResult.rows);

    if (prescriptionResult.rows.length === 0) {
      console.log("❌ No prescription found for appointment:", appointmentId);
      return res.status(404).json({ error: "Prescription not found for this appointment" });
    }

    const prescription = prescriptionResult.rows[0];

    // Get medicines
    const medicinesResult = await connection.execute(
      `SELECT medicine_name, dosage, duration, instructions
       FROM prescription_medicines
       WHERE prescription_id = :prescriptionId
       ORDER BY medicine_id`,
      { prescriptionId: prescription.PRESCRIPTION_ID },
      { outFormat: require('oracledb').OBJECT }
    );

    console.log("✅ Found prescription with medicines:", medicinesResult.rows.length);

    res.json({
      prescriptionId: prescription.PRESCRIPTION_ID,
      diagnosis: prescription.DIAGNOSIS,
      notes: prescription.NOTES,
      createdAt: prescription.CREATED_AT,
      appointmentDate: prescription.APPOINTMENT_DATE,
      appointmentTime: prescription.APPOINTMENT_TIME,
      patientName: prescription.PATIENT_NAME,
      patientId: prescription.PATIENT_ID,
      age: calculateAge(prescription.DATE_OF_BIRTH),
      gender: prescription.GENDER,
      doctorName: prescription.DOCTOR_NAME,
      specialization: prescription.SPECIALIZATION,
      medicines: medicinesResult.rows.map(med => ({
        name: med.MEDICINE_NAME,
        dosage: med.DOSAGE,
        duration: med.DURATION,
        instructions: med.INSTRUCTIONS
      }))
    });

  } catch (error) {
    console.error("❌ Error fetching prescription:", error);
    res.status(500).json({ error: "Failed to fetch prescription", details: error.message });
  } finally {
    if (connection) {
      try { await connection.close(); } catch (err) { console.error(err); }
    }
  }
});

function calculateAge(dateOfBirth) {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

module.exports = router;