const form = document.getElementById("login-form");
const fejl = document.getElementById("fejl");


form.addEventListener("submit", async (event) => {
 event.preventDefault();
 const res = await fetch("https://it3e26.vercel.app/api/login", {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({
     cpr: document.getElementById("cpr").value,
     password: document.getElementById("password").value,
   }),
 });


 if (res.ok) {
   window.location.href = "reminder.html";
 } else {
   fejl.hidden = false;
 }
});
