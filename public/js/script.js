// ------ Burgermenu - Faith ------
const btn = document.querySelector(".toggle-btn");
const menu = document.querySelector(".nav-pages");

function toggleMenu() {
  menu.classList.toggle("shown");
}

btn.addEventListener("click", toggleMenu);
