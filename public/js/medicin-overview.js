// ------ Midlertidig plads til b-menu, ryk til script.js når alt andet spiller ------
const btn = document.querySelector(".toggle-btn");
const menu = document.querySelector(".nav-pages");

function toggleMenu() {
  menu.classList.toggle("shown");
}

btn.addEventListener("click", toggleMenu);

// ------ Database ------
