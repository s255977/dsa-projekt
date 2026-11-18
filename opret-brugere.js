
import "dotenv/config";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

try {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS brugere (
      id SERIAL PRIMARY KEY,
      brugernavn TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    )
  `);

  await pool.query(`
  ALTER TABLE brugere
  ADD COLUMN IF NOT EXISTS patient_id INTEGER REFERENCES patients(id)
`);

await pool.query(`
  UPDATE brugere
  SET brugernavn = '2512489996',
      patient_id = (
        SELECT id FROM patients WHERE cpr = '2512489996'
      )
  WHERE brugernavn = 'nancy'
`);

  console.log("Tabellen brugere er klar!");
} catch (err) {
  console.error("Fejl ved oprettelse:", err.message);
} finally {
  await pool.end();
}
