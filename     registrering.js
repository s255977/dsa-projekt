import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.on("error", (err) => {
  console.error("Databasen lukkede forbindelsen:", err.message);
});

// Opret en ny registrering



  // Her skal vi indsætte SQL-koden,

  // som gemmer registreringen i databasen.




export async function opretRegistrering(medicin_id, taget) {

  const result = await pool.query(

    "INSERT INTO registrering (medicin_id, taget) VALUES ($1, $2) RETURNING *",

    [medicin_id, taget]

  );

  return result.rows[0];

}

