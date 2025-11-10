-- ===============================================================
-- File: views.sql
-- Project: Hospital Appointment & Billing Management System
-- Description: Contains all SQL VIEWS for reports and dashboards
-- Created by: Faraz & Ashhal
-- ===============================================================

-- NOTE:
-- Run this after you have already inserted data and created triggers.
-- These views are read-only, used for dashboards and summaries.
-- ===============================================================


-- ===============================================================
-- 1️⃣ VIEW: daily_appointments_view
-- ===============================================================
-- Purpose: Shows all appointments scheduled for the current day
-- including doctor and patient names, time, and status.
-- Used in: Doctor Dashboard, Admin Dashboard
-- ===============================================================

CREATE OR REPLACE VIEW daily_appointments_view AS
SELECT 
    a.appointment_id,
    a.appointment_date,
    a.appointment_time,
    d.doctor_name,
    p.patient_name,
    a.status,
    a.remarks
FROM Appointment a
JOIN Doctor d ON a.doctor_id = d.doctor_id
JOIN Patient p ON a.patient_id = p.patient_id
WHERE TRUNC(a.appointment_date) = TRUNC(SYSDATE);
/
-- Test idea:
-- SELECT * FROM daily_appointments_view;
-- Should show only today's appointments with details.


-- ===============================================================
-- 2️⃣ VIEW: pending_bills_view
-- ===============================================================
-- Purpose: Lists all bills that are still unpaid with related patient info.
-- Used in: Admin Billing Section & Patient Dashboard
-- ===============================================================

CREATE OR REPLACE VIEW pending_bills_view AS
SELECT 
    b.bill_id,
    p.patient_name,
    d.doctor_name,
    b.total_amount,
    b.payment_status,
    a.appointment_date
FROM Bill b
JOIN Appointment a ON b.appointment_id = a.appointment_id
JOIN Patient p ON a.patient_id = p.patient_id
JOIN Doctor d ON a.doctor_id = d.doctor_id
WHERE b.payment_status = 'Unpaid';
/
-- Test idea:
-- SELECT * FROM pending_bills_view;
-- Should display all unpaid bills along with patient and doctor names.


-- ===============================================================
-- 3️⃣ VIEW: doctor_summary_view
-- ===============================================================
-- Purpose: Shows summary for each doctor (appointments count and total earnings)
-- Used in: Admin Reports Page
-- ===============================================================

CREATE OR REPLACE VIEW doctor_summary_view AS
SELECT 
    d.doctor_id,
    d.doctor_name,
    d.specialization,
    COUNT(a.appointment_id) AS total_appointments,
    SUM(b.total_amount) AS total_earnings
FROM Doctor d
LEFT JOIN Appointment a ON d.doctor_id = a.doctor_id
LEFT JOIN Bill b ON a.appointment_id = b.appointment_id
GROUP BY d.doctor_id, d.doctor_name, d.specialization;
/
-- Test idea:
-- SELECT * FROM doctor_summary_view;
-- Should show each doctor’s total appointments and earnings.


-- ===============================================================
-- 4️⃣ VIEW: patient_history_view
-- ===============================================================
-- Purpose: Displays full appointment and billing history for each patient.
-- Used in: Patient Dashboard (“My Appointments” section)
-- ===============================================================

CREATE OR REPLACE VIEW patient_history_view AS
SELECT 
    p.patient_id,
    p.patient_name,
    d.doctor_name,
    a.appointment_date,
    a.status,
    NVL(b.total_amount, 0) AS total_amount,
    NVL(b.payment_status, 'Not Generated') AS payment_status
FROM Patient p
LEFT JOIN Appointment a ON p.patient_id = a.patient_id
LEFT JOIN Doctor d ON a.doctor_id = d.doctor_id
LEFT JOIN Bill b ON a.appointment_id = b.appointment_id;
/
-- Test idea:
-- SELECT * FROM patient_history_view WHERE patient_name='Ali Raza';
-- Should show Ali Raza’s appointment & billing history.


-- ===============================================================
-- 5️⃣ VIEW: department_doctors_view
-- ===============================================================
-- Purpose: Lists doctors grouped by department.
-- Used in: Appointment Booking Page (to filter doctors by department)
-- ===============================================================

CREATE OR REPLACE VIEW department_doctors_view AS
SELECT 
    dept.dept_name,
    d.doctor_name,
    d.specialization,
    d.consultation_fee
FROM Doctor d
JOIN Department dept ON d.dept_id = dept.dept_id
ORDER BY dept.dept_name;
/
-- Test idea:
-- SELECT * FROM department_doctors_view;
-- Should list all doctors under their department names.


-- ===============================================================
-- 6️⃣ (OPTIONAL BONUS) VIEW: prescription_summary_view
-- ===============================================================
-- Purpose: Combines prescriptions with patient and doctor info for reports.
-- Used in: Admin Reports or Doctor Dashboard
-- ===============================================================

CREATE OR REPLACE VIEW prescription_summary_view AS
SELECT 
    p.prescription_id,
    pt.patient_name,
    d.doctor_name,
    p.prescription_date,
    p.medicines,
    p.remarks
FROM Prescription p
JOIN Patient pt ON p.patient_id = pt.patient_id
JOIN Doctor d ON p.doctor_id = d.doctor_id;
/
-- Test idea:
-- SELECT * FROM prescription_summary_view;
-- Should show all prescriptions with doctor and patient names.


-- ===============================================================
-- END OF FILE
-- ===============================================================
-- ✅ These views simplify data for dashboards and reports.
-- Next: test_queries.sql will include SELECT statements from each view
-- for demonstration and validation.
