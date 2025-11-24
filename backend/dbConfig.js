const oracledb = require('oracledb');

async function getConnection() {
  try {
    const connection = await oracledb.getConnection({
      user: "c##Project",
      password: "123",
      connectString: "localhost:1521/ORCLE"
    });
    console.log("✅ Connected to Oracle Database as PROJECT");
    return connection;
  } catch (err) {
    console.error("❌ Database Connection Error:", err);
    throw err;
  }
}

module.exports = getConnection;