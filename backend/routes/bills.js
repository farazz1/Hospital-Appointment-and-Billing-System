// ==============================================
// bills.js
// Handles all billing-related routes
// ==============================================

const express = require("express");
const router = express.Router();
const getConnection = require("../dbConfig");

// GET all bills
router.get("/", async (req, res) => {
  try {
    const conn = await getConnection();
    const result = await conn.execute(
      `SELECT b.bill_id, a.appointment_id, p.patient_name, 
              b.total_amount, b.payment_status, b.payment_date
       FROM Bill b
       JOIN Appointment a ON b.appointment_id = a.appointment_id
       JOIN Patient p ON a.patient_id = p.patient_id`
    );
    await conn.close();
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching bills:", err);
    res.status(500).json({ error: "Error fetching bills" });
  }
});

// POST (add new bill)
router.post("/", async (req, res) => {
  const { bill_id, appointment_id, total_amount, payment_status, payment_date } = req.body;
  try {
    const conn = await getConnection();
    await conn.execute(
      `INSERT INTO Bill (bill_id, appointment_id, total_amount, payment_status, payment_date)
       VALUES (:id, :appid, :amount, :status, TO_DATE(:pdate, 'YYYY-MM-DD'))`,
      { id: bill_id, appid: appointment_id, amount: total_amount, status: payment_status, pdate: payment_date },
      { autoCommit: true }
    );
    await conn.close();
    res.json({ message: "Bill added successfully!" });
  } catch (err) {
    console.error("Error adding bill:", err);
    res.status(500).json({ error: "Error adding bill" });
  }
});

module.exports = router;
