const express = require("express");

const app = express();

const patients = [
  { cpr: "2512489996", navn: "Nancy Ann Test Berggren" },
  { cpr: "0107729995", navn: "Max Test Berggren" },
];

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

app.post("/api/patients", (req, res) => {
  const { cpr, navn } = req.body ?? {};
  if (!cpr || !navn) {
    return res.status(400).json({ error: "cpr og navn skal med" });
  }
  patients.push({ cpr, navn });
  res.status(201).json({ cpr, navn });
});

// app.use((req, res) => {
//   res.status(404).json({ error: "not found" });
// });

app.listen(3000);

// test
