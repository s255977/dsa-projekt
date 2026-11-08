/* --------- VARIABLER --------- */

// Knapper og elementer fra HTML
const logoutButton = document.getElementById("logoutButton");
const måned = document.getElementById("måned");
const forrigeMåned = document.getElementById("forrigeMåned");
const næsteMåned = document.getElementById("næsteMåned");
const iDag = document.getElementById("i-dag");
const datoer = document.getElementById("datoer");

// Medicin fra databasen
let medicinListe = [];

// Alle årets måneder
const måneder = [
  "Januar",
  "Februar",
  "Marts",
  "April",
  "Maj",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "December",
];

// Kalenderen starter i september 2026
let valgtMåned = 8;
let valgtÅr = 2026;

/* --------- LOG UD --------- */

logoutButton.addEventListener("click", function () {
  localStorage.removeItem("loggedIn");
  window.location.href = "index.html";
});

/* --------- SKIFT MÅNED --------- */

function opdaterKalender() {
  måned.textContent = måneder[valgtMåned] + " " + valgtÅr;
  visDage();
}

function skiftMåned(retning) {
  valgtMåned += retning;

  if (valgtMåned > 11) {
    valgtMåned = 0;
    valgtÅr++;
  } else if (valgtMåned < 0) {
    valgtMåned = 11;
    valgtÅr--;
  }

  opdaterKalender();
}

næsteMåned.addEventListener("click", () => skiftMåned(1));
forrigeMåned.addEventListener("click", () => skiftMåned(-1));

// Gå tilbage til dags dato
iDag.addEventListener("click", function () {
  const nu = new Date();

  valgtMåned = nu.getMonth();
  valgtÅr = nu.getFullYear();

  opdaterKalender();
});

/* --------- FIND MEDICIN FOR EN DATO --------- */

function findMedicinForDato(dag) {
  const kalenderDato = new Date(valgtÅr, valgtMåned, dag);

  return medicinListe.filter((medicin) => {
    if (!medicin.start_dato || !medicin.interval_dage) {
      return false;
    }

    const startDato = new Date(medicin.start_dato + "T00:00:00");
    const forskel = Math.round(
      (kalenderDato - startDato) / (1000 * 60 * 60 * 24),
    );

    return forskel >= 0 && forskel % Number(medicin.interval_dage) === 0;
  });
}

/* --------- VIS MEDICINBJÆLKE --------- */

function opretMedicinBjaelke(medicin) {
  const bjælke = document.createElement("div");
  bjælke.classList.add("medicin-bjælke");

  const index = medicinListe.indexOf(medicin);

  bjælke.style.backgroundColor = `hsl(${(index * 45) % 360}, 65%, 85%)`;

  bjælke.textContent = medicin.navn;
  bjælke.title = `${medicin.dosis} – ${medicin.tidspunkt}`;

  return bjælke;
}

/* --------- VIS DATOER I KALENDEREN --------- */

function visDage() {
  datoer.innerHTML = "";

  // Bestem hvor mange mediciner der vises direkte
  const bredde = window.innerWidth;

  let antalSynlige;

  if (bredde >= 1200) {
    antalSynlige = Infinity;
  } else if (bredde >= 600) {
    antalSynlige = 3;
  } else {
    antalSynlige = 2;
  }

  const førsteDag = new Date(valgtÅr, valgtMåned, 1).getDay();
  const antalDage = new Date(valgtÅr, valgtMåned + 1, 0).getDate();
  const startDag = (førsteDag + 6) % 7;

  // Tomme felter før månedens første dag
  for (let i = 0; i < startDag; i++) {
    const tomDag = document.createElement("div");
    tomDag.classList.add("tom-dag");
    datoer.appendChild(tomDag);
  }

  // Find det største antal mediciner på én dag
  let flestMedicin = 0;

  for (let dag = 1; dag <= antalDage; dag++) {
    const dagensMedicin = findMedicinForDato(dag);
    flestMedicin = Math.max(flestMedicin, dagensMedicin.length);
  }

  // Gør kalenderfelterne højere, hvis alle mediciner vises
  if (bredde >= 1200) {
    datoer.style.gridAutoRows = `${Math.max(130, 45 + flestMedicin * 22)}px`;
  } else {
    datoer.style.gridAutoRows = "130px";
  }

  // Opret datoerne
  for (let dag = 1; dag <= antalDage; dag++) {
    const datoElement = document.createElement("div");
    datoElement.classList.add("dato");

    // Datoens nummer
    const datoNummer = document.createElement("span");
    datoNummer.classList.add("dato-nummer");
    datoNummer.textContent = dag;

    datoElement.appendChild(datoNummer);

    // Medicin på denne dato
    const dagensMedicin = findMedicinForDato(dag);

    dagensMedicin.slice(0, antalSynlige).forEach((medicin) => {
      datoElement.appendChild(opretMedicinBjaelke(medicin));
    });

    // Vis resterende medicin under +X mere
    const skjultMedicin = dagensMedicin.slice(antalSynlige);

    if (skjultMedicin.length > 0) {
      const flere = document.createElement("details");
      flere.classList.add("medicin-flere");

      const tekst = document.createElement("summary");
      tekst.textContent = `+${skjultMedicin.length} mere`;

      const popup = document.createElement("div");
      popup.classList.add("medicin-popup");

      skjultMedicin.forEach((medicin) => {
        popup.appendChild(opretMedicinBjaelke(medicin));
      });

      flere.appendChild(tekst);
      flere.appendChild(popup);
      datoElement.appendChild(flere);
    }

    // Markér dags dato
    const nu = new Date();

    if (
      dag === nu.getDate() &&
      valgtMåned === nu.getMonth() &&
      valgtÅr === nu.getFullYear()
    ) {
      datoElement.classList.add("i-dag");
    }

    datoer.appendChild(datoElement);
  }
}

/* --------- HENT MEDICIN FRA SERVEREN --------- */

async function hentMedicinTilKalender() {
  try {
    const svar = await fetch("/api/medicin");

    if (!svar.ok) {
      throw new Error("Kunne ikke hente medicin fra serveren");
    }

    medicinListe = await svar.json();

    console.log("Hentet medicin fra databasen:", medicinListe);

    visDage();
  } catch (fejl) {
    console.error("Fejl ved hentning af medicin:", fejl);
  }
}

/* --------- START KALENDEREN --------- */

opdaterKalender();
hentMedicinTilKalender();

// Opdater kalenderen, hvis skærmstørrelsen ændres
window.addEventListener("resize", visDage);
