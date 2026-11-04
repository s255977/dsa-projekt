import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.on("error", (err) => {
  console.error("Databasen lukkede forbindelsen:", err.message);
});

export async function hentPatienter() {
  const result = await pool.query(
    "SELECT id, cpr, navn FROM patients ORDER BY id",
  );
  return result.rows;
}

export async function hentPatient(cpr) {
  const result = await pool.query("SELECT navn FROM patients WHERE cpr = $1", [
    cpr,
  ]);
  if (result.rows.length === 0) {
    return null;
  }
  if (result.rows.length > 1) {
    throw new Error(`Flere patienter med cpr ${cpr}`);
  }
  return result.rows[0];
}
