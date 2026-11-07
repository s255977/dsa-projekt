import cors from "cors"; // øverst i filen
import express from "express";
import { hentPatienter, hentPatient, opretPatient } from "./patients.js";
import { hentMedicin, opretMedicin } from "./medicin.js";
import { hentRegistreringer, opretRegistrering } from "./registrering.js";

// --- Opret en Express-app
const app = express();
app.use(cors());
app.use(express.json());

// --- GET: Hent alle patienter fra databasen
app.get("/api/patients", async (req, res) => {
  try {
    const patients = await hentPatienter();
    res.json(patients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "serverfejl" });
  }
});

// --- POST: Opret en ny patient i databasen
app.post("/api/patients", async (req, res) => {
  const { cpr, navn } = req.body ?? {};
  if (!cpr || !navn) {
    return res.status(400).json({ error: "cpr og navn skal med" });
  }
  try {
    const patient = await opretPatient(cpr, navn);
    res.status(201).json(patient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "serverfejl" });
  }
});

// --- GET: Hent al medicin fra databasen
app.get("/api/medicin", async (req, res) => {
  try {
    const medicin = await hentMedicin();
    res.json(medicin);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "serverfejl" });
  }
});

// --- POST: Opret en ny medicin i databasen
app.post("/api/medicin", async (req, res) => {
  const { patient_id, navn, dosis, tidspunkt, interval_dage } = req.body ?? {};
  if (!patient_id || !navn || !dosis || !tidspunkt || !interval_dage) {
    return res.status(400).json({
      error: "patient_id, navn, dosis, tidspunkt og interval_dage skal med",
    });
  }
  try {
    const medicin = await opretMedicin(
      patient_id,
      navn,
      dosis,
      tidspunkt,
      interval_dage,
    );
    res.status(201).json(medicin);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "serverfejl" });
  }
});


// --- GET: Hent alle registreringer fra databasen
app.get("/api/registrering", async (req, res) => {
  try {
    const registreringer = await hentRegistreringer();
    res.json(registreringer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "serverfejl" });
  }
});

// --- POST: Opret en ny registrering i databasen
app.post("/api/registrering", async (req, res) => {
  const { medicin_id, taget } = req.body ?? {};

  if (!Number.isInteger(medicin_id) || medicin_id <= 0 || typeof taget !== "boolean") {
    return res.status(400).json({
      error: "medicin_id og taget skal med",
    });
  }

  try {
    const registrering = await opretRegistrering(medicin_id, taget);
    res.status(201).json(registrering);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "serverfejl" });
  }
});

// --- Hvis ingen route passer, send 404
app.use((req, res) => {
  res.status(404).json({ error: "not found" });
});

// --- Start server ---
app.listen(3000);
