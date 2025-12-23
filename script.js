const calendar = document.getElementById("calendar");
const monthTitle = document.getElementById("monthTitle");

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December"
];

let currentYear = 2026;
let currentMonth = 0; // January

// Render week headers
function renderWeekHeaders() {
  calendar.innerHTML = "";
  WEEK_DAYS.forEach(day => {
    const div = document.createElement("div");
    div.textContent = day;
    div.classList.add("day", "header");
    calendar.appendChild(div);
  });
}

// Render calendar days
function renderCalendar(year, month) {
  renderWeekHeaders();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  monthTitle.textContent = `${MONTH_NAMES[month]} ${year}`;

  // Empty cells before Day 1
  for (let i = 0; i < firstDayIndex; i++) {
    const empty = document.createElement("div");
    empty.classList.add("day");
    calendar.appendChild(empty);
  }

  // Actual days
  const today = new Date();
  for (let day = 1; day <= daysInMonth; day++) {
    const dayCell = document.createElement("div");
    dayCell.classList.add("day");
    dayCell.textContent = day;
    dayCell.dataset.date = `${year}-${month + 1}-${day}`;

    // Highlight today
    if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
      dayCell.style.backgroundColor = "#FFD700"; // gold
    }

    calendar.appendChild(dayCell);
  }
}

// Navigation functions
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

// Button listeners
document.getElementById("nextMonth").addEventListener("click", goToNextMonth);
document.getElementById("prevMonth").addEventListener("click", goToPrevMonth);

// Initial render
renderCalendar(currentYear, currentMonth);
