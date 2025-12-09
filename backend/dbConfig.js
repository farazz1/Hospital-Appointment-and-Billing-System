const oracledb = require('oracledb');

async function getConnection() {
  try {
    const connection = await oracledb.getConnection({
      user: "PROJECT",
      password: "123",
      connectString: "localhost:1521/ORCL"
    });
    console.log("✅ Connected to Oracle Database as PROJECT");
    return connection;
  } catch (err) {
    console.error("❌ Database Connection Error:", err);
    throw err;
  }
}

module.exports = getConnection;