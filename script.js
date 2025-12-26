/* ===== ELEMENTS ===== */
const calendar = document.getElementById("calendar");
const monthTitle = document.getElementById("monthYear");
const wrapper = document.getElementById("calendar-wrapper");

const eventBar = document.getElementById("event-bar");
const eventText = document.getElementById("event-date-text");
const overlay = document.getElementById("event-overlay");

const addEventBtn = document.getElementById("addEventBtn");
const saveEventBtn = document.getElementById("saveEventBtn");
const deleteEventBtn = document.getElementById("deleteEventBtn");

const reminderToggle = document.getElementById("reminderToggle");
const reminderSettings = document.getElementById("reminderSettings");

/* ===== DATA ===== */
let events = JSON.parse(localStorage.getItem("events")) || {};

const WEEK_DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTH_NAMES = ["January","February","March","April","May","June",
                     "July","August","September","October","November","December"];

let currentYear = 2026;
let currentMonth = 0;

/* ===== UTIL ===== */
function resetEventForm() {
  document.getElementById("eventTitle").value = "";
  document.getElementById("eventDesc").value = "";
  reminderToggle.checked = false;
  reminderSettings.classList.add("hidden");
}

function closeEvent() {
  overlay.classList.add("hidden");
  eventBar.classList.add("hidden");
  wrapper.classList.remove("blur-background");
}

/* ===== RENDER WEEK HEADERS ===== */
function renderWeekHeaders() {
  calendar.innerHTML = "";
  WEEK_DAYS.forEach(day => {
    const div = document.createElement("div");
    div.textContent = day;
    div.classList.add("day-name");
    calendar.appendChild(div);
  });
}

/* ===== RENDER CALENDAR ===== */
function renderCalendar(year, month) {
  renderWeekHeaders();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  monthTitle.textContent = `${MONTH_NAMES[month]} ${year}`;

  for (let i = 0; i < firstDayIndex; i++) {
    const empty = document.createElement("div");
    empty.classList.add("day", "empty");
    calendar.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayCell = document.createElement("div");
    dayCell.classList.add("day");
    dayCell.textContent = day;

    const dateKey = `${year}-${String(month + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;

    if (events[dateKey]) {
      const dot = document.createElement("span");
      dot.classList.add("event-dot");
      dayCell.appendChild(dot);
    }

    calendar.appendChild(dayCell);
  }
}

/* ===== MONTH NAV ===== */
function goToNextMonth() {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar(currentYear, currentMonth);
}

function goToPrevMonth() {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar(currentYear, currentMonth);
}

document.getElementById("nextBtn").addEventListener("click", goToNextMonth);
document.getElementById("prevBtn").addEventListener("click", goToPrevMonth);

/* ===== SWIPE ===== */
let startX = 0;
wrapper.addEventListener("touchstart", e => startX = e.touches[0].clientX);
wrapper.addEventListener("touchend", e => {
  const diff = startX - e.changedTouches[0].clientX;
  if (diff > 50) goToNextMonth();
  else if (diff < -50) goToPrevMonth();
});

/* ===== REMINDER TOGGLE ===== */
reminderToggle.addEventListener("change", () => {
  reminderSettings.classList.toggle("hidden", !reminderToggle.checked);
});

/* ===== DATE CLICK ===== */
calendar.addEventListener("click", (e) => {
  if (!e.target.classList.contains("day") || e.target.classList.contains("empty")) return;

  document.querySelectorAll(".day").forEach(d => d.classList.remove("selected"));
  e.target.classList.add("selected");

  const day = e.target.textContent.padStart(2, "0");
  eventText.textContent = `${MONTH_NAMES[currentMonth]} ${day}, ${currentYear}`;

  const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2,"0")}-${day}`;

  resetEventForm();

  if (events[dateKey]) {
    const ev = events[dateKey];
    document.getElementById("eventTitle").value = ev.title;
    document.getElementById("eventDesc").value = ev.description;

    reminderToggle.checked = ev.reminder;
    reminderSettings.classList.toggle("hidden", !ev.reminder);

    if (ev.reminder) {
      document.getElementById("reminderDays").value = ev.daysBefore;
      document.getElementById("reminderTime").value = ev.time;
    }
  }

  overlay.classList.remove("hidden");
  eventBar.classList.remove("hidden");
  wrapper.classList.add("blur-background");
});

/* ===== SAVE EVENT ===== */
saveEventBtn.addEventListener("click", () => {
  const title = document.getElementById("eventTitle").value.trim();
  if (!title) {
    alert("Please enter a project name");
    return;
  }

  const description = document.getElementById("eventDesc").value.trim();
  const reminderOn = reminderToggle.checked;

  const selectedDay = document.querySelector(".day.selected");
  if (!selectedDay) return;

  const day = selectedDay.textContent.padStart(2,"0");
  const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2,"0")}-${day}`;

  events[dateKey] = {
    title,
    description,
    reminder: reminderOn,
    daysBefore: reminderOn ? document.getElementById("reminderDays").value : null,
    time: reminderOn ? document.getElementById("reminderTime").value : null
  };

  localStorage.setItem("events", JSON.stringify(events));

  renderCalendar(currentYear, currentMonth);
  resetEventForm();
  closeEvent();
});

/* ===== DELETE EVENT ===== */
deleteEventBtn.addEventListener("click", () => {
  const selectedDay = document.querySelector(".day.selected");
  if (!selectedDay) return;

  const day = selectedDay.textContent.padStart(2,"0");
  const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2,"0")}-${day}`;

  delete events[dateKey];
  localStorage.setItem("events", JSON.stringify(events));

  renderCalendar(currentYear, currentMonth);
  resetEventForm();
  closeEvent();
});

/* ===== CLOSE ===== */
overlay.addEventListener("click", closeEvent);
addEventBtn.addEventListener("click", closeEvent);
document.addEventListener("keydown", e => e.key === "Escape" && closeEvent());

/* ===== INIT ===== */
renderCalendar(currentYear, currentMonth);
