/* --------- LOG UD KNAP I KALENDEREN --------- */
const logoutButton = document.getElementById("logoutButton");

logoutButton.addEventListener("click", function () {
    localStorage.removeItem("loggedIn");
    window.location.href = "index.html";
});


/* --------- MÅNEDER I KALENDEREN --------- */
const måned = document.getElementById("måned");
// måned før lighedstegnet er navnet på JavaScript-variabel. "måned" inde i parentesen er ID'et på HTML-element.
 
const forrigeMåned = document.getElementById("forrigeMåned");
const næsteMåned = document.getElementById("næsteMåned");

const måneder = [
    "Januar", "Februar", "Marts", "April",
    "Maj", "Juni", "Juli", "August",
    "September", "Oktober", "November", "December"
]; // array med alle månederne, som bruges til at vise den valgte måned i overskriften.

let valgtMåned = 8; //valgtMåned bruges til at holde styr på den valgte måned (0-baseret, så 8 repræsenterer september). dvs kalender starter på september 2026. 12 vil repræsentere januar 2027.
let valgtÅr = 2026; //valgtÅr bruges til at holde styr på det valgte år. Vi starter i 2026.

næsteMåned.addEventListener("click", function() {
    valgtMåned = valgtMåned + 1;

    if(valgtMåned > 11) { // hvis valgtMåned er større end 11 (dvs december), skal vi gå til januar næste år.
        valgtMåned = 0;
        valgtÅr = valgtÅr + 1; // vi går til næste år.
    }

    måned.textContent = måneder[valgtMåned] + " " + valgtÅr; // opdaterer overskriften med den nye måned og år.
});

/* næsteMåned.addEventListener ("click, ...) fortæller JavaScript, at når man klikker på knappen med ID'et "næsteMåned", skal teksten i elementet med ID'et "måned" ændres til "Oktober 2026".
valgtMåned = valgtMåned + 1; lægger 1 til den måned, der er gemt
måned.textContent = valgtMåned; viser værdien/måneden i overskriften.*/

/* måneder er listen med månedsnavne.
[valgtMåned] fortæller JavaScript, hvilket element i listen det skal hente.
+ " 2026" tilføjer året efter månedsnavnet.*/

forrigeMåned.addEventListener("click", function() {
    valgtMåned = valgtMåned - 1;

    if(valgtMåned < 0) { // hvis valgtMåned er mindre end 0 (dvs januar), skal vi gå til december sidste år.
        valgtMåned = 11;
        valgtÅr = valgtÅr - 1; // vi går til forrige år.
    }

    måned.textContent = måneder[valgtMåned] + " " + valgtÅr; // opdaterer overskriften med den nye måned og år.
});


/* --------- DATOER I MÅNEDEN --------- */

let antalDage = new Date(valgtÅr, valgtMåned + 1, 0).getDate(); // beregner antallet af dage i den valgte måned.

/* new Date(...) opretter en dato.
valgtÅr er det år, du har valgt.
valgtMåned + 1 går til den følgende måned.
0 betyder dagen før den første dag i den måned.
.getDate() henter datoens dagnummer. */

 