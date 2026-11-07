import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.on("error", (err) => {
  console.error("Databasen lukkede forbindelsen:", err.message);
});

// --- GET: Hent alle registreringer fra databasen
export async function hentRegistreringer() {
  const result = await pool.query(
    "SELECT * FROM registrering ORDER BY id"
  );

  return result.rows;
}

// --- POST: Opret en ny registrering i databasen
export async function opretRegistrering(medicin_id, taget) {
  const result = await pool.query(
    "INSERT INTO registrering (medicin_id, taget) VALUES ($1, $2) RETURNING *",
    [medicin_id, taget]
  );

  return result.rows[0];
}