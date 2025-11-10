const getConnection = require("./dbConfig");

async function test() {
  try {
    const conn = await getConnection();            // Connect to Oracle DB
    const result = await conn.execute("SELECT * FROM Doctor"); // Replace with your table
    console.log(result.rows);                      // Print results
    await conn.close();                            // Close connection
    console.log("✅ Database test complete!");
  } catch (err) {
    console.error("❌ Database test failed:", err);
  }
}

test();
