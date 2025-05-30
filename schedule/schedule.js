window.toggleSidebar = function () {
  document.getElementById("sidebar").classList.toggle("collapsed");
};

if (localStorage.getItem("isAdmin") !== "true") {
  const adminMenu = document.getElementById("adminMenu");
  if (adminMenu) adminMenu.style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  const scheduleForm = document.getElementById("schedule-form");
  const scheduleList = document.getElementById("schedule-list");
  const titleInput = document.getElementById("title");
  const dateInput = document.getElementById("date");
  const timeInput = document.getElementById("time");

  let schedules = [];

  // Load schedules from server
  fetch("/schedule")
    .then((res) => res.json())
    .then((data) => {
      schedules = data;
      renderSchedules();
    })
    .catch((err) => console.error("Failed to load schedule:", err));

  // Add new schedule
  scheduleForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = titleInput.value.trim();
    const date = dateInput.value;
    const time = timeInput.value;

    if (!title || !date || !time) return alert("Please fill all fields.");

    schedules.push({ title, date, time });
    saveSchedules();
    renderSchedules();
    scheduleForm.reset();
  });

  // Render all schedule entries
  function renderSchedules() {
    scheduleList.innerHTML = "";
    schedules.forEach((schedule, index) => {
      const item = document.createElement("div");
      item.classList.add("schedule-item");

      item.innerHTML = `
        <div>
          <strong>${schedule.title}</strong><br>
          ${schedule.date} at ${schedule.time}
        </div>
        <div>
          <button class="edit-btn" data-index="${index}">✏️</button>
          <button class="delete-btn" data-index="${index}">🗑️</button>
        </div>
      `;

      scheduleList.appendChild(item);
    });

    // Attach event listeners
    document.querySelectorAll(".delete-btn").forEach((btn) =>
      btn.addEventListener("click", () => {
        const index = btn.getAttribute("data-index");
        schedules.splice(index, 1);
        saveSchedules();
        renderSchedules();
      })
    );

    document.querySelectorAll(".edit-btn").forEach((btn) =>
      btn.addEventListener("click", () => {
        const index = btn.getAttribute("data-index");
        const schedule = schedules[index];

        // Pre-fill form
        titleInput.value = schedule.title;
        dateInput.value = schedule.date;
        timeInput.value = schedule.time;

        // Remove old entry
        schedules.splice(index, 1);
        saveSchedules();
        renderSchedules();
      })
    );
  }

  // Save to server
  function saveSchedules() {
    fetch("/schedule", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(schedules),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save schedules");
      })
      .catch((err) => console.error("Save error:", err));
  }
});

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}