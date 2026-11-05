export async function createMedicine(id, patient_id, navn, dosis) {
  const result = await pool.query(
    "INSERT INTO medicines (id, patient_id, navn, dosis, tidspunkt) VALUES ($1, $2, $3, $4, $5) RETURNING id, patient_id, navn, dosis",
    [id, patient_id, navn, dosis, new Date()],
  );
  return result.rows[0];
}
