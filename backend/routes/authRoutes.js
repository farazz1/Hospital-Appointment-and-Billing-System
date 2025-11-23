const express = require("express");
const router = express.Router();
const getConnection = require("../dbConfig");

// Login endpoint
router.post("/login", async (req, res) => {
  let connection;
  try {
    const { email, password, userType } = req.body;
    
    // DEBUG: Log the login attempt
    console.log("🔍 LOGIN ATTEMPT:", { 
      email: email, 
      password: password, 
      userType: userType 
    });
    
    connection = await getConnection();

    const result = await connection.execute(
      `SELECT u.user_id, u.email, u.user_type, u.password,
              CASE u.user_type 
                WHEN 'doctor' THEN d.name 
                WHEN 'patient' THEN p.name 
                ELSE 'Admin' 
              END as name,
              CASE u.user_type 
                WHEN 'doctor' THEN d.doctor_id 
                WHEN 'patient' THEN p.patient_id 
                ELSE NULL 
              END as profile_id
       FROM users u
       LEFT JOIN doctors d ON u.user_id = d.user_id
       LEFT JOIN patients p ON u.user_id = p.user_id
       WHERE u.email = :email AND u.password = :password AND u.user_type = :userType AND u.is_active = 1`,
      { email, password, userType },
      { outFormat: require('oracledb').OBJECT }
    );

    // DEBUG: Log the query results
    console.log("🔍 QUERY RESULTS:");
    console.log("  - Rows found:", result.rows.length);
    if (result.rows.length > 0) {
      console.log("  - First row:", {
        userId: result.rows[0].USER_ID,
        email: result.rows[0].EMAIL,
        userType: result.rows[0].USER_TYPE,
        name: result.rows[0].NAME,
        profileId: result.rows[0].PROFILE_ID
      });
    }

    if (result.rows.length === 0) {
      // DEBUG: Let's check what's actually in the database
      console.log("❌ LOGIN FAILED: No matching user found");
      
      // Check if user exists with different password
      const userCheck = await connection.execute(
        `SELECT email, user_type FROM users WHERE email = :email`,
        { email },
        { outFormat: require('oracledb').OBJECT }
      );
      
      if (userCheck.rows.length > 0) {
        console.log("🔍 USER EXISTS BUT:", {
          foundUser: userCheck.rows[0],
          expectedPassword: password
        });
      } else {
        console.log("🔍 NO USER FOUND WITH EMAIL:", email);
      }
      
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials or user type" 
      });
    }

    const user = result.rows[0];
    console.log("✅ LOGIN SUCCESS:", {
      id: user.USER_ID,
      email: user.EMAIL,
      userType: user.USER_TYPE,
      name: user.NAME,
      profileId: user.PROFILE_ID
    });
    
    res.json({
      success: true,
      user: {
        id: user.USER_ID,
        email: user.EMAIL,
        userType: user.USER_TYPE,
        name: user.NAME,
        profileId: user.PROFILE_ID
      }
    });

  } catch (error) {
    console.error("❌ LOGIN ERROR:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error during login",
      error: error.message 
    });
  } finally {
    if (connection) {
      try { await connection.close(); } catch (err) { console.error(err); }
    }
  }
});

// Debug endpoint to check all users
router.get("/debug/users", async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    
    const result = await connection.execute(
      `SELECT u.user_id, u.email, u.password, u.user_type, 
              d.name as doctor_name, p.name as patient_name
       FROM users u
       LEFT JOIN doctors d ON u.user_id = d.user_id
       LEFT JOIN patients p ON u.user_id = p.user_id
       ORDER BY u.user_id`,
      {},
      { outFormat: require('oracledb').OBJECT }
    );
    
    res.json({
      success: true,
      users: result.rows.map(row => ({
        userId: row.USER_ID,
        email: row.EMAIL,
        password: row.PASSWORD,
        userType: row.USER_TYPE,
        doctorName: row.DOCTOR_NAME,
        patientName: row.PATIENT_NAME
      }))
    });
    
  } catch (error) {
    console.error("Debug users error:", error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    if (connection) {
      try { await connection.close(); } catch (err) { console.error(err); }
    }
  }
});

// Signup endpoint
router.post("/signup", async (req, res) => {
  let connection;
  try {
    const { name, email, password, phone, age, gender, userType } = req.body;
    connection = await getConnection();

    await connection.execute(
      `BEGIN 
         INSERT INTO users (user_id, email, password, user_type) 
         VALUES (seq_users.NEXTVAL, :email, :password, :userType);
       END;`,
      { email, password, userType }
    );

    if (userType === 'doctor') {
      await connection.execute(
        `BEGIN 
           INSERT INTO doctors (doctor_id, user_id, department_id, name, specialization, license_number, phone, consultation_fee)
           VALUES (seq_doctors.NEXTVAL, seq_users.CURRVAL, 1, :name, 'General', :license, :phone, 150.00);
         END;`,
        { name, license: `LIC${Date.now()}`, phone }
      );
    } else if (userType === 'patient') {
      const dateOfBirth = new Date();
      dateOfBirth.setFullYear(dateOfBirth.getFullYear() - parseInt(age));
      
      await connection.execute(
        `BEGIN 
           INSERT INTO patients (patient_id, user_id, name, date_of_birth, gender, phone)
           VALUES (seq_patients.NEXTVAL, seq_users.CURRVAL, :name, :dob, :gender, :phone);
         END;`,
        { name, dob: dateOfBirth, gender, phone }
      );
    }

    await connection.commit();
    res.json({ success: true, message: "User registered successfully" });

  } catch (error) {
    console.error("Signup error:", error);
    if (connection) await connection.rollback();
    res.status(500).json({ success: false, message: "Registration failed" });
  } finally {
    if (connection) {
      try { await connection.close(); } catch (err) { console.error(err); }
    }
  }
});

module.exports = router;