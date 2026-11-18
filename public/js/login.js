
// --- LOGIN ---
const form = document.getElementById("login-form");
const fejl = document.getElementById("login-fejl");

// Kør kun login-koden, hvis formularen findes
if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Undgå at siden genindlæses

    // Hent brugernavn (CPR) og password fra formularen
    const brugernavn = document.getElementById("brugernavn").value;
    const password = document.getElementById("password").value;

    try {
      // Send loginoplysninger til serveren
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brugernavn, password }),
      });

      // Send brugeren videre, hvis login lykkes
      if (res.ok) {
        location.href = "reminder.html";
      } else {
        fejl.textContent = "Forkert brugernavn eller adgangskode";
      }
    } catch (err) {
      // Fejl ved forbindelse til serveren
      fejl.textContent = "Kunne ikke oprette forbindelse til serveren";
      console.error(err);
    }
  });
}


// --- KONTROLLER LOGIN ---
async function visLogin() {

  // Spørg serveren, om brugeren er logget ind
  const res = await fetch("/api/me");

  // Send til login-siden, hvis brugeren ikke er logget ind
  if (res.status === 401) {
    location.href = "index.html";
    return;
  }

  // Vis patientens navn i topbaren
  if (res.ok) {
    const bruger = await res.json();
    const navn = document.getElementById("brugernavn-visning");

    if (navn) {
      navn.textContent = bruger.navn;
    }
  }
}

// Kontrollér kun login på sider uden loginformular
if (!form) {
  visLogin();
}
