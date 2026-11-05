import express from "express";
import { hentPatienter, hentPatient, opretPatient } from "./patients.js";

// --- Opret en Express-app
const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

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

// --- Hvis ingen route passer, send 404
app.use((req, res) => {
  res.status(404).json({ error: "not found" });
});

// --- Start server ---
app.listen(3000);
