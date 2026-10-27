/* --------- LOG UD KNAP I KALENDEREN --------- */
const logoutButton = document.getElementById("logoutButton");

logoutButton.addEventListener("click", function () {
    localStorage.removeItem("loggedIn");
    window.location.href = "index.html";
});


/* --------- MÅNEDER I KALENDEREN (samt pile/knapper) --------- */
const måned = document.getElementById("måned");
// måned før lighedstegnet er navnet på JavaScript-variabel. "måned" inde i parentesen er ID'et på HTML-element.
 
const forrigeMåned = document.getElementById("forrigeMåned"); // "forrigeMåned" er navnet på JavaScript-variabel. "forrigeMåned" inde i parentesen er ID'et på HTML-element.
const næsteMåned = document.getElementById("næsteMåned"); // "næsteMåned" er navnet på JavaScript-variabel. "næsteMåned" inde i parentesen er ID'et på HTML-element.
const iDag = document.getElementById("i-dag"); // "iDag" er navnet på JavaScript-variabel. "i-dag" inde i parentesen er ID'et på HTML-element.


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

    visDage(); // opdaterer kalenderen med de nye datoer. genberegner og viser datoerne.
});

forrigeMåned.addEventListener("click", function() {
    valgtMåned = valgtMåned - 1;

    if(valgtMåned < 0) { // hvis valgtMåned er mindre end 0 (dvs januar), skal vi gå til december sidste år.
        valgtMåned = 11;
        valgtÅr = valgtÅr - 1; // vi går til forrige år.
    }

    måned.textContent = måneder[valgtMåned] + " " + valgtÅr; // opdaterer overskriften med den nye måned og år.

    visDage (); // opdaterer kalenderen med de nye datoer.
});

// funktio til knappen idag
iDag.addEventListener("click", function () {
    const nu = new Date();

    valgtMåned = nu.getMonth();
    valgtÅr = nu.getFullYear();

    måned.textContent = måneder[valgtMåned] + " " + valgtÅr;

    visDage();
});

/* --------- DATOER/DAGE --------- */

let antalDage = new Date(valgtÅr, valgtMåned + 1, 0).getDate(); // beregner antallet af dage i den valgte måned.


 function visDage() {
    const datoer = document.getElementById("datoer");

    datoer.innerHTML = ""; // rydder kalenderen, så vi kan tilføje de nye dage.

    const førsteDag = new Date(valgtÅr, valgtMåned, 1).getDay(); // finder ud af hvilken ugedag den første dag i måneden er. 0 = søndag, 1 = mandag, osv.
    const antalDage = new Date(valgtÅr, valgtMåned + 1, 0).getDate(); // beregner antallet af dage i den valgte måned.
    const startDag = (førsteDag + 6) % 7; // justerer startdagen, så ugen starter på mandag i stedet for søndag (i javaScript starter den med sødnag).

    for (let i = 0; i < startDag; i++) {
        const tomDag = document.createElement("div");
        tomDag.classList.add("tom-dag");
        datoer.appendChild(tomDag);
    } // tilføjer tomme felter for dagene før den første dag i måneden.

    for (let dag = 1; dag <= antalDage; dag++) {
        const dagElement = document.createElement("div");

        dagElement.classList.add("dag");
        dagElement.textContent = dag;

        // Markér dagens dato med en ring
        const iDag = new Date();
        
        if (
            dag === iDag.getDate() &&
            valgtMåned === iDag.getMonth() &&
            valgtÅr === iDag.getFullYear()
        ) {
    dagElement.classList.add("i-dag");
}

datoer.appendChild(dagElement);
    }
}

visDage(); // kalder funktionen for at vise dagene i den valgte måned.