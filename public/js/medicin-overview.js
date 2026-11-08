// ------ Database - Opret medicin ------
const form = document.getElementById("opret-medicin");
const patientSelect = document.getElementById("patient");
const tabel = document.getElementById("medicin-liste");
const fejl = document.getElementById("fejl");
const ok = document.getElementById("ok");
const intervalTekst = {
  1: "Hver dag",
  2: "Hver anden dag",
  7: "Én gang om ugen",
};

async function hentPatienter() {
  const res = await fetch("/api/patients");
  const patienter = await res.json();
  patientSelect.innerHTML = "";
  for (const p of patienter) {
    const option = document.createElement("option");
    option.value = p.id;
    option.textContent = p.navn;
    patientSelect.appendChild(option);
  }
}

async function hentMedicin() {
  const res = await fetch("/api/medicin");
  const medicin = await res.json();
  tabel.innerHTML = "";
  for (const m of medicin) {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${m.patient_id}</td><td>${m.navn}</td><td>${m.dosis}</td><td>${m.tidspunkt}</td><td>${intervalTekst[m.interval_dage]}</td>`;
    tabel.appendChild(row);
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  fejl.hidden = true;
  ok.hidden = true;
  try {
    const res = await fetch("/api/medicin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patient_id: Number(patientSelect.value),
        navn: document.getElementById("navn").value,
        dosis: document.getElementById("dosis").value,
        tidspunkt: document.getElementById("tidspunkt").value,
        interval_dage: Number(document.getElementById("interval").value),
      }),
    });
    if (!res.ok) {
      fejl.hidden = false;
      return;
    }
    ok.hidden = false;
    form.reset();
    hentMedicin();
  } catch (err) {
    fejl.hidden = false;
  }
});

hentPatienter();
hentMedicin();
