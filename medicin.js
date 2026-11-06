import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.on("error", (err) => {
  console.error("Databasen lukkede forbindelsen:", err.message);
});

// --- Hent al medicin ---
export async function hentMedicin() {
  const result = await pool.query(
    "SELECT id, patient_id, navn, dosis, tidspunkt, interval_dage, start_dato::text AS start_dato FROM medicin ORDER BY id",
  );
  return result.rows;
}

// --- Opret ny medicin ---

export async function opretMedicin(
  patient_id,
  navn,
  dosis,
  tidspunkt,
  interval_dage,
) {
  const result = await pool.query(
    "INSERT INTO medicin (patient_id, navn, dosis, tidspunkt, interval_dage) VALUES ($1, $2, $3, $4, $5) RETURNING id, patient_id, navn, dosis, tidspunkt, interval_dage, start_dato::text AS start_dato",
    [patient_id, navn, dosis, tidspunkt, interval_dage],
  );
  return result.rows[0];
}
