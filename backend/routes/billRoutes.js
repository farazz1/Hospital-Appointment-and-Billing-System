const express = require("express");
const router = express.Router();
const getConnection = require("../dbConfig");

// Get all bills - UPDATED FOR FRONTEND COMPATIBILITY
router.get("/", async (req, res) => {
  let connection;
  try {
    const { patientId } = req.query;
    connection = await getConnection();

    let query = `
      SELECT b.bill_id, b.amount, b.payment_status, b.generated_date, b.paid_date,
             a.appointment_date, a.appointment_time,
             pat.name as patient_name, pat.patient_id,
             doc.name as doctor_name, doc.specialization
      FROM bills b
      JOIN appointments a ON b.appointment_id = a.appointment_id
      JOIN patients pat ON a.patient_id = pat.patient_id
      JOIN doctors doc ON a.doctor_id = doc.doctor_id
    `;

    const binds = {};
    
    if (patientId) {
      query += ` WHERE pat.patient_id = :patientId`;
      binds.patientId = parseInt(patientId);
    }

    query += ` ORDER BY b.generated_date DESC`;

    const result = await connection.execute(query, binds, { outFormat: require('oracledb').OBJECT });

    console.log("Bills query result:", result.rows);

    // RETURN PROPER STRUCTURE FOR FRONTEND
    const bills = result.rows.map(row => ({
      id: row.BILL_ID, // Use actual bill_id as id
      billId: row.BILL_ID,
      description: `Consultation - ${row.DOCTOR_NAME} (${row.SPECIALIZATION})`,
      date: formatDate(row.GENERATED_DATE || row.APPOINTMENT_DATE), // Use generated_date as primary date
      amount: parseFloat(row.AMOUNT) || 0,
      status: row.PAYMENT_STATUS === 'Paid' ? 'Paid' : 'Pending', // Map to frontend expected values
      patientName: row.PATIENT_NAME,
      doctorName: row.DOCTOR_NAME,
      specialization: row.SPECIALIZATION,
      generatedDate: row.GENERATED_DATE,
      paidDate: row.PAID_DATE,
      appointmentDate: row.APPOINTMENT_DATE
    }));

    res.json(bills); // Return direct array

  } catch (error) {
    console.error("Error fetching bills:", error);
    res.status(500).json({ 
      error: "Failed to fetch bills", 
      details: error.message 
    });
  } finally {
    if (connection) {
      try { await connection.close(); } catch (err) { console.error(err); }
    }
  }
});

// Mark bill as paid - UPDATED FOR FRONTEND COMPATIBILITY
router.put("/:id/pay", async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    
    console.log("🟡 Paying bill:", id);
    
    connection = await getConnection();

    // First check if bill exists
    const checkResult = await connection.execute(
      `SELECT bill_id FROM bills WHERE bill_id = :id`,
      { id: parseInt(id) },
      { outFormat: require('oracledb').OBJECT }
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Bill not found" 
      });
    }

    // Update bill status
    const result = await connection.execute(
      `UPDATE bills 
       SET payment_status = 'Paid', paid_date = CURRENT_TIMESTAMP
       WHERE bill_id = :id`,
      { id: parseInt(id) }
    );

    await connection.commit();
    console.log("✅ Bill paid successfully");
    
    res.json({ 
      success: true, 
      message: "Payment processed successfully" 
    });

  } catch (error) {
    console.error("❌ Error processing payment:", error);
    if (connection) await connection.rollback();
    res.status(500).json({ 
      success: false, 
      message: "Failed to process payment",
      error: error.message 
    });
  } finally {
    if (connection) {
      try { await connection.close(); } catch (err) { console.error(err); }
    }
  }
});

// Get billing summary for patient - OPTIONAL (if frontend uses it)
router.get("/patient/:patientId/summary", async (req, res) => {
  let connection;
  try {
    const { patientId } = req.params;
    connection = await getConnection();

    const result = await connection.execute(
      `SELECT 
         COUNT(*) as total_bills,
         SUM(CASE WHEN payment_status = 'Pending' THEN 1 ELSE 0 END) as pending_bills,
         SUM(CASE WHEN payment_status = 'Pending' THEN amount ELSE 0 END) as total_amount_due,
         SUM(amount) as total_amount_billed
       FROM bills b
       JOIN appointments a ON b.appointment_id = a.appointment_id
       WHERE a.patient_id = :patientId`,
      { patientId: parseInt(patientId) },
      { outFormat: require('oracledb').OBJECT }
    );

    if (result.rows.length === 0) {
      return res.json({
        totalBills: 0,
        pendingBills: 0,
        totalAmountDue: 0,
        totalAmountBilled: 0
      });
    }

    const summary = result.rows[0];
    res.json({
      totalBills: summary.TOTAL_BILLS || 0,
      pendingBills: summary.PENDING_BILLS || 0,
      totalAmountDue: summary.TOTAL_AMOUNT_DUE || 0,
      totalAmountBilled: summary.TOTAL_AMOUNT_BILLED || 0
    });

  } catch (error) {
    console.error("Error fetching billing summary:", error);
    res.status(500).json({ 
      error: "Failed to fetch billing summary",
      details: error.message 
    });
  } finally {
    if (connection) {
      try { await connection.close(); } catch (err) { console.error(err); }
    }
  }
});

function formatDate(date) {
  if (!date) return '';
  // Return in YYYY-MM-DD format for frontend consistency
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

module.exports = router;