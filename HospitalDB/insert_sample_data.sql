-- ===============================================================
-- File: insert_sample_data.sql
-- Project: Hospital Appointment & Billing Management System
-- Description: Inserts sample records into all major tables
-- Created by: Faraz & Ashhal
-- ===============================================================

-- NOTE:
-- Make sure all tables are already created using create_tables.sql
-- before running this script.

-- ===============================================================
-- 1. INSERTING DEPARTMENTS
-- ===============================================================

INSERT INTO Department (dept_name, location) VALUES ('Cardiology', 'Block A');
INSERT INTO Department (dept_name, location) VALUES ('Neurology', 'Block B');
INSERT INTO Department (dept_name, location) VALUES ('ENT', 'Block C');
INSERT INTO Department (dept_name, location) VALUES ('Orthopedics', 'Block D');
INSERT INTO Department (dept_name, location) VALUES ('Dermatology', 'Block E');

-- Just a few departments to work with for now.
-- Each department can have multiple doctors.

-- ===============================================================
-- 2. INSERTING DOCTORS
-- ===============================================================

INSERT INTO Doctor (doctor_name, specialization, phone_no, email, dept_id, consultation_fee)
VALUES ('Dr. Ahmed Khan', 'Cardiologist', '03001234567', 'ahmed.khan@hospital.com', 1, 2500);

INSERT INTO Doctor (doctor_name, specialization, phone_no, email, dept_id, consultation_fee)
VALUES ('Dr. Sara Malik', 'Neurologist', '03019876543', 'sara.malik@hospital.com', 2, 3000);

INSERT INTO Doctor (doctor_name, specialization, phone_no, email, dept_id, consultation_fee)
VALUES ('Dr. Bilal Tariq', 'ENT Specialist', '03005551234', 'bilal.tariq@hospital.com', 3, 2000);

INSERT INTO Doctor (doctor_name, specialization, phone_no, email, dept_id, consultation_fee)
VALUES ('Dr. Nadia Rehman', 'Orthopedic Surgeon', '03017778899', 'nadia.rehman@hospital.com', 4, 2800);

INSERT INTO Doctor (doctor_name, specialization, phone_no, email, dept_id, consultation_fee)
VALUES ('Dr. Hina Farooq', 'Dermatologist', '03016669988', 'hina.farooq@hospital.com', 5, 2200);

-- 5 doctors linked to their respective departments.

-- ===============================================================
-- 3. INSERTING PATIENTS
-- ===============================================================

INSERT INTO Patient (patient_name, gender, age, phone_no, email, address)
VALUES ('Ali Raza', 'Male', 30, '03111222333', 'ali.raza@gmail.com', 'Gulshan, Karachi');

INSERT INTO Patient (patient_name, gender, age, phone_no, email, address)
VALUES ('Fatima Noor', 'Female', 25, '03214567890', 'fatima.noor@gmail.com', 'Johar, Karachi');

INSERT INTO Patient (patient_name, gender, age, phone_no, email, address)
VALUES ('Usman Khalid', 'Male', 40, '03007776655', 'usman.khalid@gmail.com', 'DHA, Karachi');

INSERT INTO Patient (patient_name, gender, age, phone_no, email, address)
VALUES ('Ayesha Tariq', 'Female', 35, '03334445566', 'ayesha.tariq@gmail.com', 'Clifton, Karachi');

INSERT INTO Patient (patient_name, gender, age, phone_no, email, address)
VALUES ('Hamza Ali', 'Male', 28, '03019998877', 'hamza.ali@gmail.com', 'Nazimabad, Karachi');

-- 5 patients registered in the system.

-- ===============================================================
-- 4. INSERTING APPOINTMENTS
-- ===============================================================

INSERT INTO Appointment (appointment_date, appointment_time, status, doctor_id, patient_id, remarks)
VALUES (TO_DATE('2025-10-22', 'YYYY-MM-DD'), '10:00 AM', 'Completed', 1, 1, 'Follow-up in 1 month');

INSERT INTO Appointment (appointment_date, appointment_time, status, doctor_id, patient_id, remarks)
VALUES (TO_DATE('2025-10-22', 'YYYY-MM-DD'), '11:00 AM', 'Pending', 2, 2, 'Initial consultation');

INSERT INTO Appointment (appointment_date, appointment_time, status, doctor_id, patient_id, remarks)
VALUES (TO_DATE('2025-10-23', 'YYYY-MM-DD'), '12:00 PM', 'Completed', 3, 3, 'Ear pain checkup');

INSERT INTO Appointment (appointment_date, appointment_time, status, doctor_id, patient_id, remarks)
VALUES (TO_DATE('2025-10-23', 'YYYY-MM-DD'), '02:00 PM', 'Completed', 4, 4, 'Back pain treatment');

INSERT INTO Appointment (appointment_date, appointment_time, status, doctor_id, patient_id, remarks)
VALUES (TO_DATE('2025-10-24', 'YYYY-MM-DD'), '03:00 PM', 'Pending', 5, 5, 'Skin allergy review');

-- 5 appointments covering various dates, doctors, and statuses.

-- ===============================================================
-- 5. INSERTING BILLS
-- ===============================================================

INSERT INTO Bill (appointment_id, total_amount, payment_status, payment_date)
VALUES (1, 2500, 'Paid', TO_DATE('2025-10-22', 'YYYY-MM-DD'));

INSERT INTO Bill (appointment_id, total_amount, payment_status, payment_date)
VALUES (3, 2000, 'Paid', TO_DATE('2025-10-23', 'YYYY-MM-DD'));

INSERT INTO Bill (appointment_id, total_amount, payment_status, payment_date)
VALUES (4, 2800, 'Paid', TO_DATE('2025-10-23', 'YYYY-MM-DD'));

INSERT INTO Bill (appointment_id, total_amount, payment_status, payment_date)
VALUES (2, 3000, 'Unpaid', NULL);

INSERT INTO Bill (appointment_id, total_amount, payment_status, payment_date)
VALUES (5, 2200, 'Unpaid', NULL);

-- A mix of paid and unpaid bills for variety in reports.

-- ===============================================================
-- 6. INSERTING PRESCRIPTIONS
-- ===============================================================

INSERT INTO Prescription (appointment_id, doctor_id, patient_id, medicines, remarks)
VALUES (1, 1, 1, 'Aspirin, Lipitor', 'Avoid oily food.');

INSERT INTO Prescription (appointment_id, doctor_id, patient_id, medicines, remarks)
VALUES (3, 3, 3, 'Ear drops, Paracetamol', 'Use for 5 days.');

INSERT INTO Prescription (appointment_id, doctor_id, patient_id, medicines, remarks)
VALUES (4, 4, 4, 'Painkillers', 'Physiotherapy recommended.');

-- Completed appointments have prescriptions; pending ones don’t.

-- ===============================================================
-- END OF FILE
-- ===============================================================
-- All sample data successfully inserted.
-- Next: Create triggers in triggers.sql to automate logic.
