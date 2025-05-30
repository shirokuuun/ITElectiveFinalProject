window.toggleSidebar = function () {
  document.getElementById("sidebar").classList.toggle("collapsed");
};

if (localStorage.getItem("isAdmin") !== "true") {
  const adminMenu = document.getElementById("adminMenu");
  if (adminMenu) adminMenu.style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  const appointmentForm = document.getElementById("appointment-form");
  const appointmentList = document.getElementById("appointment-list");
  const titleInput = document.getElementById("title");
  const dateInput = document.getElementById("date");
  const timeInput = document.getElementById("time");

  let schedules = [];

  // Load schedules from server
  fetch("/appointment")
    .then((res) => res.json())
    .then((data) => {
      schedules = data;
      renderAppointments();
    })
    .catch((err) => console.error("Failed to load appointments:", err));

  // Add new schedule
  appointmentForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = titleInput.value.trim();
    const date = dateInput.value;
    const time = timeInput.value;

    if (!title || !date || !time) {
      alert("Please fill all fields.");
      return;
    }

    schedules.push({ title, date, time });
    saveAppointments();
    renderAppointments();
    appointmentForm.reset();
  });

  // Render all schedule entries
  function renderAppointments() {
    appointmentList.innerHTML = "";
    schedules.forEach((appointment, index) => {
      const item = document.createElement("div");
      item.classList.add("appointment-item");

      item.innerHTML = `
        <div>
          <strong>${appointment.title}</strong><br>
          ${appointment.date} at ${appointment.time}
        </div>
        <div>
          <button class="edit-btn" data-index="${index}">✏️</button>
          <button class="delete-btn" data-index="${index}">🗑️</button>
        </div>
      `;

      appointmentList.appendChild(item);
    });

    // Delete button
    document.querySelectorAll(".delete-btn").forEach((btn) =>
      btn.addEventListener("click", () => {
        const index = btn.getAttribute("data-index");
        schedules.splice(index, 1);
        saveAppointments();
        renderAppointments();
      })
    );

    // Edit button
    document.querySelectorAll(".edit-btn").forEach((btn) =>
      btn.addEventListener("click", () => {
        const index = btn.getAttribute("data-index");
        const appt = schedules[index];

        // Pre-fill form
        titleInput.value = appt.title;
        dateInput.value = appt.date;
        timeInput.value = appt.time;

        // Remove old entry
        schedules.splice(index, 1);
        saveAppointments();
        renderAppointments();
      })
    );
  }

  // Save to server
  function saveAppointments() {
    fetch("/appointment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(schedules),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save appointments");
      })
      .catch((err) => console.error("Save error:", err));
  }
});

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}