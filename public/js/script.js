// ------ Burgermenu - Faith ------
const btn = document.querySelector(".toggle-btn");
const menu = document.querySelector(".nav-pages");

function toggleMenu() {
  menu.classList.toggle("shown");
}

btn.addEventListener("click", toggleMenu);

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
