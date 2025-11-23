const express = require("express");
const router = express.Router();
const getConnection = require("../dbConfig");

// Get all bills
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

    res.json(result.rows.map(row => ({
      id: `bill-${row.BILL_ID}`,
      billId: row.BILL_ID,
      description: `Consultation - ${row.DOCTOR_NAME}`,
      date: formatDate(row.APPOINTMENT_DATE),
      amount: row.AMOUNT,
      status: row.PAYMENT_STATUS === 'Paid' ? 'Paid' : 'Pending',
      patientName: row.PATIENT_NAME,
      doctorName: row.DOCTOR_NAME,
      specialization: row.SPECIALIZATION,
      generatedDate: row.GENERATED_DATE,
      paidDate: row.PAID_DATE
    })));

  } catch (error) {
    console.error("Error fetching bills:", error);
    res.status(500).json({ error: "Failed to fetch bills" });
  } finally {
    if (connection) {
      try { await connection.close(); } catch (err) { console.error(err); }
    }
  }
});

// Mark bill as paid
router.put("/:id/pay", async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    connection = await getConnection();

    await connection.execute(
      `UPDATE bills 
       SET payment_status = 'Paid', paid_date = CURRENT_TIMESTAMP
       WHERE bill_id = :id`,
      { id: parseInt(id) }
    );

    await connection.commit();
    res.json({ success: true, message: "Payment processed successfully" });

  } catch (error) {
    console.error("Error processing payment:", error);
    if (connection) await connection.rollback();
    res.status(500).json({ success: false, message: "Failed to process payment" });
  } finally {
    if (connection) {
      try { await connection.close(); } catch (err) { console.error(err); }
    }
  }
});

// Get billing summary for patient
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
      totalBills: summary.TOTAL_BILLS,
      pendingBills: summary.PENDING_BILLS,
      totalAmountDue: summary.TOTAL_AMOUNT_DUE || 0,
      totalAmountBilled: summary.TOTAL_AMOUNT_BILLED || 0
    });

  } catch (error) {
    console.error("Error fetching billing summary:", error);
    res.status(500).json({ error: "Failed to fetch billing summary" });
  } finally {
    if (connection) {
      try { await connection.close(); } catch (err) { console.error(err); }
    }
  }
});

function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString(); // Format based on locale
}

module.exports = router;