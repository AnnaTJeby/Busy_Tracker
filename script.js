const calendar = document.getElementById("calendar");
const monthTitle = document.getElementById("monthYear");
const wrapper = document.getElementById("calendar-wrapper");
const eventBar = document.getElementById("event-bar");
const eventText = document.getElementById("event-date-text");
const overlay = document.getElementById("event-overlay");
const addEventBtn = document.getElementById("addEventBtn");

const WEEK_DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

let currentYear = 2026;
let currentMonth = 0;

// Render week headers
function renderWeekHeaders() {
  calendar.innerHTML = "";
  WEEK_DAYS.forEach(day => {
    const div = document.createElement("div");
    div.textContent = day;
    div.classList.add("day-name");
    calendar.appendChild(div);
  });
}

// Render calendar days
function renderCalendar(year, month) {
  renderWeekHeaders();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  monthTitle.textContent = `${MONTH_NAMES[month]} ${year}`;

  // Empty slots
  for(let i=0;i<firstDayIndex;i++){
    const empty = document.createElement("div");
    empty.classList.add("day","empty");
    calendar.appendChild(empty);
  }

  const today = new Date();
  for(let day=1; day<=daysInMonth; day++){
    const dayCell = document.createElement("div");
    dayCell.classList.add("day");
    dayCell.textContent = day;
    if(day===today.getDate() && month===today.getMonth() && year===today.getFullYear()){
      dayCell.classList.add("selected");
    }
    calendar.appendChild(dayCell);
  }
}

// Navigation
function goToNextMonth(){
  currentMonth++;
  if(currentMonth>11){ currentMonth=0; currentYear++; }
  renderCalendar(currentYear,currentMonth);
}
function goToPrevMonth(){
  currentMonth--;
  if(currentMonth<0){ currentMonth=11; currentYear--; }
  renderCalendar(currentYear,currentMonth);
}

document.getElementById("nextBtn").addEventListener("click", goToNextMonth);
document.getElementById("prevBtn").addEventListener("click", goToPrevMonth);

renderCalendar(currentYear,currentMonth);

/* ===== SWIPE ===== */
let startX=0, endX=0;
wrapper.addEventListener("touchstart", e => startX=e.touches[0].clientX);
wrapper.addEventListener("touchend", e=>{
  endX = e.changedTouches[0].clientX;
  const diff = startX-endX;
  if(diff>50) goToNextMonth();
  else if(diff<-50) goToPrevMonth();
});

/* ===== DATE CLICK + EVENT BAR ===== */
calendar.addEventListener("click",(e)=>{
  if(!e.target.classList.contains("day") || e.target.classList.contains("empty")) return;

  // Highlight selected day
  document.querySelectorAll(".day").forEach(d=>d.classList.remove("selected"));
  e.target.classList.add("selected");

  // Set event text
  const day = e.target.textContent;
  eventText.textContent = `${MONTH_NAMES[currentMonth]} ${day}, ${currentYear}`;

  // Show overlay & event bar
  overlay.classList.remove("hidden");
  eventBar.classList.remove("hidden");

  // Blur calendar
  wrapper.classList.add("blur-background");
});

/* ===== CLOSE EVENT BAR ===== */
function closeEvent(){
  overlay.classList.add("hidden");
  eventBar.classList.add("hidden");
  wrapper.classList.remove("blur-background");
}

overlay.addEventListener("click", closeEvent);
addEventBtn.addEventListener("click", closeEvent);

// Optional: ESC key
document.addEventListener("keydown",(e)=>{
  if(e.key==="Escape") closeEvent();
});

const saveEventBtn = document.getElementById("saveEventBtn");

saveEventBtn.addEventListener("click", () => {
  const title = document.getElementById("eventTitle").value.trim();
  if (!title) {
    alert("Please enter a title");
    return;
  }

  const description = document.getElementById("eventDesc").value.trim();
  const reminderOn = reminderToggle.checked;
  
  const eventData = {
    title,
    description,
    reminder: reminderOn,
    daysBefore: reminderOn ? document.getElementById("reminderDays").value : null,
    time: reminderOn ? document.getElementById("reminderTime").value : null
  };

  const dateKey = eventText.textContent; // e.g. "January 5, 2026"
  localStorage.setItem(dateKey, JSON.stringify(eventData));

  closeEvent(); // reuse your existing function
});

document.addEventListener("DOMContentLoaded", () => {
  const reminderToggle = document.getElementById("reminderToggle");
  const reminderSettings = document.getElementById("reminderSettings");

  if (!reminderToggle || !reminderSettings) return;

  reminderToggle.addEventListener("change", () => {
    reminderSettings.classList.toggle("hidden", !reminderToggle.checked);
  });
});
