// ==========================================================
// File: dbConfig.js
// Description: Oracle Database connection setup
// Created by: Faraz & Ashhal
// ==========================================================

const oracledb = require('oracledb');

// Always use async/await with OracleDB
async function getConnection() {
  try {
    const connection = await oracledb.getConnection({
      user: "DDLUSER",        // <-- Replace with your Oracle username
      password: "123",    // <-- Replace with your Oracle password
      connectString: "localhost:1521/ORCL" // default Oracle connection string
    });
    console.log("✅ Connected to Oracle Database");
    return connection;
  } catch (err) {
    console.error("❌ Database Connection Error:", err);
    throw err;
  }
}

module.exports = getConnection;
