const express = require("express");
const router = express.Router();
const getConnection = require("../dbConfig");

// Get all appointments
router.get("/", async (req, res) => {
  let connection;
  try {
    const { doctorId, patientId } = req.query;
    connection = await getConnection();

    let query = `
      SELECT a.appointment_id, a.appointment_date, a.appointment_time, a.reason, a.status,
             p.name as patient_name, p.patient_id,
             d.name as doctor_name, d.specialization,
             dep.name as department
      FROM appointments a
      JOIN patients p ON a.patient_id = p.patient_id
      JOIN doctors d ON a.doctor_id = d.doctor_id
      JOIN departments dep ON d.department_id = dep.department_id
      WHERE 1=1
    `;

    const binds = {};
    
    if (doctorId) {
      query += ` AND d.doctor_id = :doctorId`;
      binds.doctorId = parseInt(doctorId);
    }
    
    if (patientId) {
      query += ` AND p.patient_id = :patientId`;
      binds.patientId = parseInt(patientId);
    }

    query += ` ORDER BY a.appointment_date DESC, a.appointment_time DESC`;

    const result = await connection.execute(query, binds, { outFormat: require('oracledb').OBJECT });

    console.log("Appointments query result:", result.rows);

    res.json(result.rows.map(row => ({
      id: row.APPOINTMENT_ID,
      date: row.APPOINTMENT_DATE,
      time: row.APPOINTMENT_TIME,
      reason: row.REASON,
      status: row.STATUS,
      patientName: row.PATIENT_NAME,
      patientId: row.PATIENT_ID,
      doctorName: row.DOCTOR_NAME,
      specialization: row.SPECIALIZATION,
      department: row.DEPARTMENT
    })));

  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ 
      error: "Failed to fetch appointments", 
      details: error.message 
    });
  } finally {
    if (connection) {
      try { await connection.close(); } catch (err) { console.error(err); }
    }
  }
});

// Book new appointment - FIXED VERSION
router.post("/", async (req, res) => {
  let connection;
  try {
    const { patientId, doctorId, date, time, reason } = req.body;
    console.log("🟡 Booking appointment:", { patientId, doctorId, date, time, reason });
    
    connection = await getConnection();

    // FIX: Changed :date to :apptDate to avoid reserved keyword
    const result = await connection.execute(
      `INSERT INTO appointments (appointment_id, patient_id, doctor_id, appointment_date, appointment_time, reason)
       VALUES (seq_appointments.NEXTVAL, :patientId, :doctorId, TO_DATE(:apptDate, 'YYYY-MM-DD'), :time, :reason)
       RETURNING appointment_id INTO :appointmentId`,
      {
        patientId: parseInt(patientId),
        doctorId: parseInt(doctorId),
        apptDate: date,  // Changed from :date to :apptDate
        time,
        reason,
        appointmentId: { type: require('oracledb').NUMBER, dir: require('oracledb').BIND_OUT }
      }
    );

    await connection.commit();
    
    console.log("✅ Appointment booked successfully, ID:", result.outBinds.appointmentId[0]);
    
    res.json({ 
      success: true, 
      message: "Appointment booked successfully",
      appointmentId: result.outBinds.appointmentId[0]
    });

  } catch (error) {
    console.error("❌ Error booking appointment:", error);
    if (connection) await connection.rollback();
    
    if (error.message.includes('20001')) {
      res.status(400).json({ success: false, message: "Doctor is not available at this time" });
    } else {
      res.status(500).json({ 
        success: false, 
        message: "Failed to book appointment", 
        error: error.message 
      });
    }
  } finally {
    if (connection) {
      try { await connection.close(); } catch (err) { console.error(err); }
    }
  }
});

// Mark appointment as completed
router.put("/:id/complete", async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    console.log("🟡 Completing appointment:", id);
    
    connection = await getConnection();

    // First check if appointment exists
    const checkResult = await connection.execute(
      `SELECT * FROM appointments WHERE appointment_id = :id`,
      { id: parseInt(id) },
      { outFormat: require('oracledb').OBJECT }
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    console.log("🟡 Found appointment:", checkResult.rows[0]);

    // Update appointment status
    await connection.execute(
      `UPDATE appointments SET status = 'Completed' WHERE appointment_id = :id`,
      { id: parseInt(id) }
    );

    await connection.commit();
    console.log("✅ Appointment marked as completed");
    
    res.json({ success: true, message: "Appointment marked as completed" });

  } catch (error) {
    console.error("❌ Error completing appointment:", error);
    if (connection) await connection.rollback();
    res.status(500).json({ 
      success: false, 
      message: "Failed to complete appointment",
      error: error.message 
    });
  } finally {
    if (connection) {
      try { await connection.close(); } catch (err) { console.error(err); }
    }
  }
});

// Cancel appointment
router.put("/:id/cancel", async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    console.log("🟡 Canceling appointment:", id);
    
    connection = await getConnection();

    await connection.execute(
      `UPDATE appointments SET status = 'Cancelled' WHERE appointment_id = :id`,
      { id: parseInt(id) }
    );

    await connection.commit();
    console.log("✅ Appointment cancelled");
    
    res.json({ success: true, message: "Appointment cancelled" });

  } catch (error) {
    console.error("❌ Error cancelling appointment:", error);
    if (connection) await connection.rollback();
    res.status(500).json({ 
      success: false, 
      message: "Failed to cancel appointment",
      error: error.message 
    });
  } finally {
    if (connection) {
      try { await connection.close(); } catch (err) { console.error(err); }
    }
  }
});

// Get available time slots for a doctor on a specific date
router.get("/availability", async (req, res) => {
  let connection;
  try {
    const { doctorId, date } = req.query;
    console.log("🟡 Getting availability for doctor:", doctorId, "on date:", date);
    
    connection = await getConnection();

    const result = await connection.execute(
      `BEGIN 
         get_doctor_availability(:doctorId, TO_DATE(:date, 'YYYY-MM-DD'), :availableSlots);
       END;`,
      {
        doctorId: parseInt(doctorId),
        date,
        availableSlots: { type: require('oracledb').CURSOR, dir: require('oracledb').BIND_OUT }
      }
    );

    const resultSet = result.outBinds.availableSlots;
    const slots = await resultSet.getRows();

    console.log("✅ Available slots:", slots);
    
    res.json(slots.map(row => row.TIME_SLOT));

  } catch (error) {
    console.error("❌ Error fetching availability:", error);
    res.status(500).json({ 
      error: "Failed to fetch availability",
      details: error.message 
    });
  } finally {
    if (connection) {
      try { await connection.close(); } catch (err) { console.error(err); }
    }
  }
});

module.exports = router;