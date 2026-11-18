import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.on("error", (err) => {
  console.error("Databasen lukkede forbindelsen:", err.message);
});

export async function findBruger(brugernavn) {
  const result = await pool.query(
    "SELECT id, brugernavn, password_hash FROM brugere WHERE brugernavn = $1",
    [brugernavn]
  );
  return result.rows[0];
}