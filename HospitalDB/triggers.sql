-- ===============================================================
-- File: triggers.sql
-- Project: Hospital Appointment & Billing Management System
-- Description: All database triggers for automation and validation
-- Created by: Faraz & Ashhal
-- ===============================================================

-- IMPORTANT NOTE:
-- These triggers make your database respond automatically to changes.
-- Make sure to execute this file AFTER create_tables.sql and insert_sample_data.sql
-- ===============================================================


-- ===============================================================
-- 1️⃣ TRIGGER: set_default_appointment_status
-- ===============================================================
-- Purpose: Automatically set the status to 'Pending' if no status is given.
-- Trigger Type: BEFORE INSERT
-- Table: Appointment
-- Reason: Ensures data consistency and avoids null or empty statuses.
-- ===============================================================

CREATE OR REPLACE TRIGGER set_default_appointment_status
BEFORE INSERT ON Appointment
FOR EACH ROW
BEGIN
    IF :NEW.status IS NULL THEN
        :NEW.status := 'Pending';
    END IF;
END;
/
-- Test idea:
-- Try inserting a new appointment without giving 'status'
-- It should automatically be stored as 'Pending'.


-- ===============================================================
-- 2️⃣ TRIGGER: prevent_double_booking
-- ===============================================================
-- Purpose: Prevent a doctor from being double-booked for the same date and time.
-- Trigger Type: BEFORE INSERT
-- Table: Appointment
-- Reason: Maintains scheduling integrity and prevents conflicts.
-- ===============================================================

CREATE OR REPLACE TRIGGER prevent_double_booking
BEFORE INSERT ON Appointment
FOR EACH ROW
DECLARE
    v_count NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_count
    FROM Appointment
    WHERE doctor_id = :NEW.doctor_id
      AND appointment_date = :NEW.appointment_date
      AND appointment_time = :NEW.appointment_time;

    IF v_count > 0 THEN
        RAISE_APPLICATION_ERROR(-20001, 'Error: Doctor already has an appointment at this time.');
    END IF;
END;
/
-- Test idea:
-- Try booking two appointments with the same doctor, date, and time.
-- It should raise the error message.


-- ===============================================================
-- 3️⃣ TRIGGER: auto_generate_bill
-- ===============================================================
-- Purpose: Automatically generate a bill when an appointment is completed.
-- Trigger Type: AFTER UPDATE
-- Table: Appointment
-- Reason: Eliminates manual bill creation and automates workflow.
-- ===============================================================

CREATE OR REPLACE TRIGGER auto_generate_bill
AFTER UPDATE OF status ON Appointment
FOR EACH ROW
DECLARE
    v_fee NUMBER;
BEGIN
    -- Only generate bill when appointment status changes to 'Completed'
    IF :NEW.status = 'Completed' AND :OLD.status <> 'Completed' THEN
        -- Get doctor's consultation fee
        SELECT consultation_fee INTO v_fee
        FROM Doctor
        WHERE doctor_id = :NEW.doctor_id;

        -- Insert the new bill record
        INSERT INTO Bill (appointment_id, total_amount, payment_status, payment_date)
        VALUES (:NEW.appointment_id, v_fee, 'Unpaid', NULL);
    END IF;
END;
/
-- Test idea:
-- Update any appointment’s status to ‘Completed’
-- A new bill should automatically appear in the Bill table.


-- ===============================================================
-- 4️⃣ TRIGGER: update_bill_status
-- ===============================================================
-- Purpose: When a bill is marked as 'Paid', update the related appointment’s status.
-- Trigger Type: AFTER UPDATE
-- Table: Bill
-- Reason: Keeps data synchronized between appointments and billing.
-- ===============================================================

CREATE OR REPLACE TRIGGER update_bill_status
AFTER UPDATE OF payment_status ON Bill
FOR EACH ROW
BEGIN
    IF :NEW.payment_status = 'Paid' THEN
        UPDATE Appointment
        SET status = 'Payment Received'
        WHERE appointment_id = :NEW.appointment_id;
    END IF;
END;
/
-- Test idea:
-- Update a bill’s status to ‘Paid’.
-- Appointment table should automatically change to ‘Payment Received’.


-- ===============================================================
-- 5️⃣ TRIGGER: auto_create_prescription
-- ===============================================================
-- Purpose: Automatically create a blank prescription after appointment is completed.
-- Trigger Type: AFTER UPDATE
-- Table: Appointment
-- Reason: Streamlines the process — prescription ready as soon as doctor finishes appointment.
-- ===============================================================

CREATE OR REPLACE TRIGGER auto_create_prescription
AFTER UPDATE OF status ON Appointment
FOR EACH ROW
BEGIN
    IF :NEW.status = 'Completed' AND :OLD.status <> 'Completed' THEN
        INSERT INTO Prescription (appointment_id, doctor_id, patient_id, medicines, remarks)
        VALUES (:NEW.appointment_id, :NEW.doctor_id, :NEW.patient_id, NULL, 'Prescription to be added by doctor.');
    END IF;
END;
/
-- Test idea:
-- When an appointment changes to ‘Completed’, a blank prescription should appear automatically.


-- ===============================================================
-- 6️⃣ (BONUS) TRIGGER: appointment_audit_log
-- ===============================================================
-- Purpose: Maintain a log of all appointment status changes (for record keeping).
-- Trigger Type: AFTER UPDATE
-- Table: Appointment
-- Reason: Demonstrates audit functionality (advanced concept).
-- ===============================================================

-- First, create a small log table to store audit entries
CREATE TABLE Appointment_Log (
    log_id NUMBER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    appointment_id NUMBER,
    old_status VARCHAR2(20),
    new_status VARCHAR2(20),
    change_date DATE DEFAULT SYSDATE,
    changed_by VARCHAR2(50)
);

CREATE OR REPLACE TRIGGER appointment_audit_log
AFTER UPDATE OF status ON Appointment
FOR EACH ROW
BEGIN
    INSERT INTO Appointment_Log (appointment_id, old_status, new_status, changed_by)
    VALUES (:NEW.appointment_id, :OLD.status, :NEW.status, USER);
END;
/
-- Test idea:
-- Change any appointment’s status and check the Appointment_Log table.
-- You’ll see a new row recorded automatically.


-- ===============================================================
-- END OF FILE
-- ===============================================================
-- ✅ This file adds automation, validation, and intelligence to your database.
-- Next Step: Create SQL views in views.sql for reports and dashboards.
