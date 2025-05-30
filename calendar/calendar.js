const calendarGrid = document.getElementById("calendarGrid");
const currentMonthEl = document.getElementById("currentMonth");
const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");

const noteModal = document.getElementById("noteModal");
const noteInput = document.getElementById("noteInput");
const saveNoteBtn = document.getElementById("saveNoteBtn");
const cancelNoteBtn = document.getElementById("cancelNoteBtn");

let currentDate = new Date();
let notes = {}; // Object to store date: note
let selectedDateKey = ""; // Format: YYYY-M-D

// Load notes from server
function fetchNotes() {
  fetch("/calendar")
    .then((res) => res.json())
    .then((data) => {
      notes = data || {};
      renderCalendar();
    })
    .catch((err) => {
      console.error("Error fetching notes:", err);
    });
}

// Save notes to server
function saveNotes() {
  fetch("/calendar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(notes),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to save notes");
      return res.text();
    })
    .then((msg) => console.log(msg))
    .catch((err) => console.error("Error saving notes:", err));
}

// Render calendar
function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  currentMonthEl.textContent = currentDate.toLocaleDateString("default", {
    month: "long",
    year: "numeric",
  });

  calendarGrid.innerHTML = "";

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  weekDays.forEach((day) => {
    const dayElem = document.createElement("div");
    dayElem.className = "calendar-day calendar-weekday";
    dayElem.textContent = day;
    calendarGrid.appendChild(dayElem);
  });

  // Empty cells before the first day
  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.className = "calendar-day empty";
    calendarGrid.appendChild(emptyCell);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${year}-${month + 1}-${day}`;
    const dayElem = document.createElement("div");
    dayElem.className = "calendar-day";
    dayElem.textContent = day;

    if (notes[dateKey]) {
      dayElem.classList.add("note");
    }

    dayElem.addEventListener("click", () => openNoteModal(dateKey));
    calendarGrid.appendChild(dayElem);
  }
}

// Open note modal for a day
function openNoteModal(dateKey) {
  selectedDateKey = dateKey;
  noteInput.value = notes[dateKey] || "";
  noteModal.classList.add("active");
}

// Save note
saveNoteBtn.addEventListener("click", () => {
  const noteText = noteInput.value.trim();
  if (noteText) {
    notes[selectedDateKey] = noteText;
  } else {
    delete notes[selectedDateKey];
  }
  saveNotes();
  noteModal.classList.remove("active");
  renderCalendar();
});

// Cancel modal
cancelNoteBtn.addEventListener("click", () => {
  noteModal.classList.remove("active");
});

// Change month
prevMonthBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

nextMonthBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

// Load on page start
fetchNotes();
