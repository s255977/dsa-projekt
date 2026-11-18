import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.on("error", (err) => {
  console.error("Databasen lukkede forbindelsen:", err.message);
});

// --- Hent al medicin ---
export async function hentMedicin() {
  const result = await pool.query(
    "SELECT id, patient_id, navn, dosis FROM medicin",
  );
  return result.rows;
}

// --- Opret ny medicin ---

export async function opretMedicin(patient_id, navn, dosis) {
  const result = await pool.query(
    "INSERT INTO medicin (patient_id, navn, dosis) VALUES ($1, $2, $3) RETURNING id, patient_id, navn, dosis",
    [patient_id, navn, dosis],
  );
  return result.rows[0];
}
