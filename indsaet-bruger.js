
import "dotenv/config";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const brugernavn = "nancy";
const hash = "$2b$10$yt8.9u8q/JcWVBeTq1ZpsutV6PVgVc1udTU4W.cpE3CWLWL8kGbca";

try {
  await pool.query(
    `INSERT INTO brugere (brugernavn, password_hash)
     VALUES ($1, $2)
     ON CONFLICT (brugernavn)
     DO UPDATE SET password_hash = EXCLUDED.password_hash`,
    [brugernavn, hash]
  );

  console.log("Testbrugeren er gemt i Neon!");
} catch (err) {
  console.error("Fejl:", err.message);
} finally {
  await pool.end();
}
