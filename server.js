import path from "node:path";
import cors from "cors";
import express from "express";
import { hentPatienter, hentPatient, opretPatient } from "./patients.js";
import { hentMedicin, opretMedicin } from "./medicin.js";
import { hentRegistreringer, opretRegistrering } from "./registrering.js";
import connectPgSimple from "connect-pg-simple"; // ny

const PgSession = connectPgSimple(session); // ny

// --- Opret en Express-app
const app = express();
app.use(cors());
app.use(express.json());

if (!process.env.VERCEL) {
  app.use(express.static("public"));
}

app.get("/", (req, res) => {
  res.sendFile(path.join(import.meta.dirname, "public", "index.html"));
});

// --- GET: Hent alle patienter fra databasen
app.get("/api/patients", kraevLogin, async (req, res) => {
  try {
    const patients = await hentPatienter();
    res.json(patients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "serverfejl" });
  }
});

// --- POST: Opret en ny patient i databasen
app.post("/api/patients", kraevLogin, async (req, res) => {
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
app.get("/api/medicin", kraevLogin, async (req, res) => {
  try {
    const medicin = await hentMedicin();
    res.json(medicin);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "serverfejl" });
  }
});

// --- POST: Opret en ny medicin i databasen
app.post("/api/medicin", kraevLogin, async (req, res) => {
  const { patient_id, navn, dosis } = req.body ?? {};
  if (!patient_id || !navn || !dosis) {
    return res.status(400).json({
      error: "patient_id, navn og dosis skal med",
    });
  }
  try {
    const medicin = await opretMedicin(patient_id, navn, dosis);
    res.status(201).json(medicin);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "serverfejl" });
  }
});

// --- GET: Hent alle registreringer fra databasen
app.get("/api/registrering", kraevLogin, async (req, res) => {
  try {
    const registreringer = await hentRegistreringer();
    res.json(registreringer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "serverfejl" });
  }
});

// --- POST: Opret en ny registrering i databasen
app.post("/api/registrering", kraevLogin, async (req, res) => {
  const { medicin_id, taget } = req.body ?? {};

  if (
    !Number.isInteger(medicin_id) ||
    medicin_id <= 0 ||
    typeof taget !== "boolean"
  ) {
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

app.use(
  session({
    store: new PgSession({ conString: process.env.DATABASE_URL }), // ny
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 1000 },
  }),
);

// --- Hvis ingen route passer, send 404
app.use((req, res) => {
  res.status(404).json({ error: "not found" });
});

// --- Start server ---
app.listen(3000);
