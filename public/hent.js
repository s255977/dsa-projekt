const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  const alle = await pool.query("SELECT cpr, navn FROM patients ORDER BY id");
  console.log(alle.rows);

  const max = await pool.query("SELECT navn FROM patients WHERE cpr = $1", [
    "0107729995",
  ]);
  console.log(max.rows);

  await pool.end();
}

main();
