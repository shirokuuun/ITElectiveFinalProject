document.addEventListener("DOMContentLoaded", async () => {
  // Sidebar toggle
  window.toggleSidebar = function () {
    document.getElementById("sidebar").classList.toggle("collapsed");
  };

  // Logout
  window.logout = function () {
    window.location.href = "/login/login.html";
  };

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // ==== Fetch Appointments ====
  let appointments = [];
  try {
    const res = await fetch("/appointment");
    appointments = await res.json();
  } catch (err) {
    console.error("Failed to fetch appointments:", err);
  }

  const appointmentsPerDay = {};
  appointments.forEach(item => {
    const day = new Date(item.date).toLocaleDateString("en-US", { weekday: "short" });
    appointmentsPerDay[day] = (appointmentsPerDay[day] || 0) + 1;
  });

  const appointmentsData = weekdays.map(day => appointmentsPerDay[day] || 0);

  const appointmentsCtx = document.getElementById("appointmentsChart").getContext("2d");
  new Chart(appointmentsCtx, {
    type: "bar",
    data: {
      labels: weekdays,
      datasets: [{
        label: "Appointments",
        data: appointmentsData,
        backgroundColor: "#3498db"
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } }
    }
  });

  // ==== Fetch Schedule ====
  let scheduleData = [];
  try {
    const res = await fetch("/schedule");
    scheduleData = await res.json();
  } catch (err) {
    console.error("Failed to fetch schedule:", err);
  }

  const schedulePerDay = {};
  scheduleData.forEach(item => {
    const day = new Date(item.date).toLocaleDateString("en-US", { weekday: "short" });
    schedulePerDay[day] = (schedulePerDay[day] || 0) + 1;
  });

  const scheduleChartData = weekdays.map(day => schedulePerDay[day] || 0);

  const scheduleCtx = document.getElementById("scheduleChart").getContext("2d");
  new Chart(scheduleCtx, {
    type: "bar",
    data: {
      labels: weekdays,
      datasets: [{
        label: "Scheduled Tasks",
        data: scheduleChartData,
        backgroundColor: "#f39c12"
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } }
    }
  });

  // ==== Notes Overview Chart (Example) ====
  const notesCtx = document.getElementById("notesChart").getContext("2d");
  new Chart(notesCtx, {
    type: "line",
    data: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      datasets: [{
        label: "Notes",
        data: [5, 8, 6, 10],
        fill: true,
        borderColor: "#2ecc71",
        backgroundColor: "rgba(46, 204, 113, 0.2)",
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: true } },
      scales: { y: { beginAtZero: true } }
    }
  });
});
