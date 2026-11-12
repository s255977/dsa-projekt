import path from "node:path";
import cors from "cors";
import express from "express";
import session from "express-session";
import bcrypt from "bcryptjs";
import { findBruger } from "./brugere.js";
import { hentPatienter, hentPatient, opretPatient } from "./patients.js";
import { hentMedicin, opretMedicin } from "./medicin.js";
import { hentRegistreringer, opretRegistrering } from "./registrering.js";

// --- Opret en Express-app
const app = express();
app.use(cors());
app.use(express.json());

// --- SESSION ---
app.use(session({
  // Hemmelig nøgle fra .env, som beskytter session-cookien
  secret: process.env.SESSION_SECRET,

  // Gem ikke sessionen igen, hvis den ikke er ændret
  resave: false,

  // Opret ikke en session, før der gemmes noget i den
  saveUninitialized: false
}));

if (!process.env.VERCEL) {
  app.use(express.static("public"));
}

app.get("/", (req, res) => {
  res.sendFile(path.join(import.meta.dirname, "public", "index.html"));
});

 // --- LOGIN ---
app.post("/api/login", async (req, res) => {
  const { brugernavn, password } = req.body ?? {};

  // Tjek om begge felter er udfyldt
  if (!brugernavn || !password) {
    return res.sendStatus(400);
  }

  try {
    // Find brugeren i Neon-databasen
    const bruger = await findBruger(brugernavn);

    // Kontroller om brugeren findes og passwordet er korrekt
    if (!bruger || !(await bcrypt.compare(password, bruger.password_hash))) {
      return res.sendStatus(401);
    }

    // Hent patientens navn fra databasen
    const patient = await hentPatient(brugernavn);

    // Afvis login, hvis patienten ikke findes
    if (!patient) {
      return res.sendStatus(401);
    }

    // Gem brugeren og patientens navn i sessionen
    req.session.brugernavn = bruger.brugernavn;
    req.session.navn = patient.navn;

    // Login lykkedes
    res.sendStatus(200);

  } catch (err) {
    // Fejl på serveren
    console.error(err);
    res.sendStatus(500);
  }
});


// --- HENT LOGGET IND BRUGER ---
app.get("/api/me", (req, res) => {

  // Tjek om brugeren er logget ind
  if (!req.session.brugernavn) {
    return res.sendStatus(401);
  }

  // Send brugernavn og patientens navn til hjemmesiden
  res.json({
    brugernavn: req.session.brugernavn,
    navn: req.session.navn
  });
});

// --- LOG UD ---
app.post("/api/logout", (req, res) => {

  // Slet brugerens session
  req.session.destroy((err) => {

    // Hvis der opstår en serverfejl
    if (err) return res.sendStatus(500);

    // Brugeren er logget ud
    res.sendStatus(204);
  });
});


// --- KRÆV LOGIN ---
function kraevLogin(req, res, next) {

  // Afvis brugeren, hvis personen ikke er logget ind
  if (!req.session.brugernavn) {
    return res.sendStatus(401);
  }

  // Fortsæt til den ønskede API-route
  next();
}


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
app.post("/api/medicin", kraevLogin, async (req, res) => {
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
app.get("/api/registrering", kraevLogin,async (req, res) => {
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

// --- Hvis ingen route passer, send 404
app.use((req, res) => {
  res.status(404).json({ error: "not found" });
});

// --- Start server ---
app.listen(3000);
