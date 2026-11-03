const dateEl = document.getElementById("today-date");
if (dateEl) {
  const dateText = new Date().toLocaleDateString("da-DK", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  dateEl.textContent = dateText.charAt(0).toUpperCase() + dateText.slice(1);
}
 
const reminders = document.querySelectorAll(".paamindelser .reminder");
const progressEl = document.getElementById("progress");
 
// Markér den første dosis, der ikke er håndteret, som "current"
// og opdater teksten "x af y taget"
function refresh() {
  const pending = [...reminders].filter(
    (r) => !r.classList.contains("done") && !r.classList.contains("skipped")
  );
  reminders.forEach((r) => r.classList.remove("current"));
  if (pending.length) pending[0].classList.add("current");
 
  const taken = document.querySelectorAll(".paamindelser .reminder.done").length;
  if (progressEl) {
    progressEl.textContent = pending.length
      ? `${taken} af ${reminders.length} taget i dag`
      : `Alle doser er håndteret i dag (${taken} af ${reminders.length} taget)`;
  }
}
 
// Kaldes når man trykker "Taget" eller "Ikke taget"
function mark(reminder, taken) {
  const time = new Date().toLocaleTimeString("da-DK", {
    hour: "2-digit",
    minute: "2-digit",
  });
 
  reminder.classList.add(taken ? "done" : "skipped");
  reminder.querySelector(".dot").textContent = taken ? "✓" : "×";
 
  const status = document.createElement("p");
  status.className = "status";
  status.textContent = taken ? `Taget kl. ${time}` : "Ikke taget";
  reminder.querySelector(".actions").replaceWith(status);
 
  refresh();
}
 
reminders.forEach((reminder) => {
  reminder.querySelector(".taken-button")
    .addEventListener("click", () => mark(reminder, true));
  reminder.querySelector(".not-taken-button")
    .addEventListener("click", () => mark(reminder, false));
});
 
refresh();