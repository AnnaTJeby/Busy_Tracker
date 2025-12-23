const calendar = document.getElementById("calendar");
const monthTitle = document.getElementById("monthYear");


const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December"
];

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

// Render calendar
function renderCalendar(year, month) {
  renderWeekHeaders();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  monthTitle.textContent = `${MONTH_NAMES[month]} ${year}`;

  // Empty slots
  for (let i = 0; i < firstDayIndex; i++) {
    const empty = document.createElement("div");
    empty.classList.add("day", "empty");
    calendar.appendChild(empty);
  }

  const today = new Date();

  for (let day = 1; day <= daysInMonth; day++) {
    const dayCell = document.createElement("div");
    dayCell.classList.add("day");
    dayCell.textContent = day;

    if (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      dayCell.classList.add("selected");
    }

    calendar.appendChild(dayCell);
  }
}

// Navigation
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

// Buttons (MATCH IDs)
document.getElementById("nextBtn").addEventListener("click", goToNextMonth);
document.getElementById("prevBtn").addEventListener("click", goToPrevMonth);

// Initial render
renderCalendar(currentYear, currentMonth);

/* ===== SWIPE LOGIC ===== */
const wrapper = document.getElementById("calendar-wrapper");

let startX = 0;
let endX = 0;

wrapper.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
});

wrapper.addEventListener("touchend", e => {
  endX = e.changedTouches[0].clientX;
  handleSwipe();
});

function handleSwipe() {
  const diff = startX - endX;

  if (diff > 50) {
    goToNextMonth();
  } else if (diff < -50) {
    goToPrevMonth();
  }
}
