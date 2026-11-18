// ------ Database - Opret medicin ------
const medicinForm = document.getElementById("opret-medicin");
const tabel = document.getElementById("medicin-liste");
const medicinFejl = document.getElementById("fejl");
const ok = document.getElementById("ok");
const intervalTekst = {
  1: "Hver dag",
  2: "Hver anden dag",
  7: "Én gang om ugen",
};

async function hentMedicin() {
  const res = await fetch("/api/medicin");
  const medicin = await res.json();
  tabel.innerHTML = "";
  for (const m of medicin) {
    const row = document.createElement("tr");
    // Vis kun timer og minutter (fx 07:45 i stedet for 07:45:00)
    row.innerHTML = `<td>${m.navn}</td><td>${m.dosis}</td><td>${m.tidspunkt?.slice(0, 5) ?? ""}</td><td>${intervalTekst[m.interval_dage]}</td>`;
    tabel.appendChild(row);
  }
}

medicinForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  medicinFejl.hidden = true;
  ok.hidden = true;
  try {
    const res = await fetch("/api/medicin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        navn: document.getElementById("medicin").value,
        dosis: document.getElementById("dosis").value,
        tidspunkt: document.getElementById("tidspunkt").value,
        interval_dage: Number(document.getElementById("interval").value),
      }),
    });
    if (!res.ok) {
      medicinFejl.hidden = false;
      return;
    }
    ok.hidden = false;
    medicinForm.reset();
    hentMedicin();
  } catch (err) {
    medicinFejl.hidden = false;
  }
});

hentMedicin();
