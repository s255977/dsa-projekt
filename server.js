/*
// const express = require("express");

// const app = express();

// const patients = [
//   { cpr: "2512489996", navn: "Nancy Ann Test Berggren" },
//   { cpr: "0107729995", navn: "Max Test Berggren" },
// ];

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   next();
// });

// app.use(express.json());

// app.get("/", (req, res) => {
//   res.redirect("/index.html");
// });

// app.get("/api/patients", (req, res) => {
//   res.json(patients);
// });

// app.get("/api/patients/:cpr", (req, res) => {
//   const patient = patients.find((p) => p.cpr === req.params.cpr);
//   if (!patient) {
//     return res.status(404).json({ error: "not found" });
//   }
//   res.json(patient);
// });

// app.post("/api/patients", (req, res) => {
//   const { cpr, navn } = req.body ?? {};
//   if (!cpr || !navn) {
//     return res.status(400).json({ error: "cpr og navn skal med" });
//   }
//   patients.push({ cpr, navn });
//   res.status(201).json({ cpr, navn });
// });

// app.listen(3000);

// ----- Lektion 13 -----

// Skift require ud med import
// const express = require("express");

import express from "express";
import { hentPatienter } from "./patients.js";

const app = express();

// gør GET /api/patients async, kald hentPatienter(), og svar 500 med { error: "serverfejl" } i catch

app.get("/api/patients", async (req, res) => {
  try {
    const patients = await hentPatienter();
    res.json(patients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "serverfejl" });
  }
});

// Slet arrayet patients
// const patients = [
//   { cpr: "2512489996", navn: "Nancy Ann Test Berggren" },
//   { cpr: "0107729995", navn: "Max Test Berggren" },
// ];

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.use(express.json());

app.get("/api/patients", (req, res) => {
  res.json(patients);
});

app.get("/api/patients/:cpr", (req, res) => {
  const patient = patients.find((p) => p.cpr === req.params.cpr);
  if (!patient) {
    return res.status(404).json({ error: "not found" });
  }
  res.json(patient);
});

// Slet den gamle POST-route med patients.push
// app.post("/api/patients", (req, res) => {
//   const { cpr, navn } = req.body ?? {};
//   if (!cpr || !navn) {
//     return res.status(400).json({ error: "cpr og navn skal med" });
//   }
//   patients.push({ cpr, navn });
//   res.status(201).json({ cpr, navn });
// });

app.use((req, res) => {
  res.status(404).json({ error: "not found" });
});

app.listen(3000);

*/

// ----- Lektion 13 -----

// Skift require ud med import
// const express = require("express");

import express from "express";
import { hentPatienter } from "./patients.js";

const app = express();

// gør GET /api/patients async, kald hentPatienter(), og svar 500 med { error: "serverfejl" } i catch

app.get("/api/patients", async (req, res) => {
  try {
    const patients = await hentPatienter();
    res.json(patients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "serverfejl" });
  }
});

// Slet arrayet patients
// const patients = [
//   { cpr: "2512489996", navn: "Nancy Ann Test Berggren" },
//   { cpr: "0107729995", navn: "Max Test Berggren" },
// ];

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.use(express.json());

app.get("/api/patients", (req, res) => {
  res.json(patients);
});

app.get("/api/patients/:cpr", (req, res) => {
  const patient = patients.find((p) => p.cpr === req.params.cpr);
  if (!patient) {
    return res.status(404).json({ error: "not found" });
  }
  res.json(patient);
});

// Slet den gamle POST-route med patients.push
// app.post("/api/patients", (req, res) => {
//   const { cpr, navn } = req.body ?? {};
//   if (!cpr || !navn) {
//     return res.status(400).json({ error: "cpr og navn skal med" });
//   }
//   patients.push({ cpr, navn });
//   res.status(201).json({ cpr, navn });
// });

app.use((req, res) => {
  res.status(404).json({ error: "not found" });
});

app.listen(3000);
