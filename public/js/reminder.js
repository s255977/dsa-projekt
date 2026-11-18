const reminders = document.querySelectorAll(".paamindelser .reminder");
const progressEl = document.getElementById("progress");
const dateEl = document.getElementById("today-date");

if (dateEl) {
  const dateText = new Date().toLocaleDateString("da-DK", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  dateEl.textContent = dateText.charAt(0).toUpperCase() + dateText.slice(1);
}

// ------ Database - Påmindelser ------
const timeline = document.querySelector(".paamindelser .timeline");

// Hent medicin fra databasen
async function hentMedicin() {
  const res = await fetch("/api/medicin");
  const medicin = await res.json();
  timeline.innerHTML = "";

  for (const m of medicin) {
    const reminder = document.createElement("li");
    reminder.className = "reminder";
    reminder.dataset.medicinId = m.id;

    reminder.innerHTML = `
      <span class="dot"></span>
      <div class="reminder-content">
        <p class="tidspunkt">${String(m.tidspunkt).slice(0, 5)}</p>
        <h3>${m.navn}</h3>
        <p>${m.dosis}</p>
        <span class="checkmark" hidden>✓</span>
        <div class="actions">
          <button class="taken-button">Taget</button>
          <button class="not-taken-button">Ikke taget</button>
        </div>
      </div>
    `;

    timeline.appendChild(reminder);

    reminder.querySelector(".taken-button").onclick = () =>
      mark(reminder, true);
    reminder.querySelector(".not-taken-button").onclick = () =>
      mark(reminder, false);
  }

  await hentRegistreringer();
}

// Hent tidligere registreringer
async function hentRegistreringer() {
  const res = await fetch("/api/registrering");
  const registreringer = await res.json();

  for (const r of registreringer) {
    const reminder = document.querySelector(
      `.reminder[data-medicin-id="${r.medicin_id}"]`,
    );

    if (reminder) {
      visStatus(reminder, r.taget);
    }
  }

  refresh();
}

// Gem registrering i databasen
async function mark(reminder, taken) {
  const medicin_id = Number(reminder.dataset.medicinId);

  try {
    const res = await fetch("/api/registrering", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        medicin_id: medicin_id,
        taget: taken,
      }),
    });

    if (!res.ok) {
      alert("Registreringen kunne ikke gemmes");
      return;
    }

    visStatus(reminder, taken);
    refresh();
  } catch (err) {
    alert("Der opstod en fejl");
  }
}

// Vis status på påmindelsen
function visStatus(reminder, taken) {
  reminder.classList.remove("done", "skipped");
  reminder.classList.add(taken ? "done" : "skipped");

  reminder.querySelector(".checkmark").hidden = !taken;

  const actions = reminder.querySelector(".actions");

  if (actions) {
    const status = document.createElement("p");
    status.className = "status";
    status.textContent = taken ? "Taget" : "Ikke taget";
    actions.replaceWith(status);
  }

  const status = reminder.querySelector(".status");
  if (status) {
    status.textContent = taken ? "Taget" : "Ikke taget";
  }
}

// Opdater antal doser
function refresh() {
  const reminders = document.querySelectorAll(".paamindelser .reminder");

  let taken = 0;
  let pending = 0;

  for (const r of reminders) {
    r.classList.remove("current");

    if (r.classList.contains("done")) {
      taken++;
    }

    if (!r.classList.contains("done") && !r.classList.contains("skipped")) {
      pending++;
      if (pending === 1) r.classList.add("current");
    }
  }

  if (progressEl) {
    progressEl.textContent = pending
      ? `${taken} af ${reminders.length} taget`
      : `Alle doser er håndteret (${taken} af ${reminders.length} taget)`;
  }
}

// Start når siden åbnes
hentMedicin();


/* --------- LOG UD KNAP I REMINDER --------- DETTE ER DEN KORREKTE IMPLEMENTATION (Safiya)*/
const logoutButton = document.getElementById("logoutButton");

logoutButton.addEventListener("click", async function () {
  const res = await fetch("/api/logout", {
    method: "POST",
  });

  if (res.ok) {
    window.location.href = "index.html";
  }
});
