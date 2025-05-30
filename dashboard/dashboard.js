document.addEventListener("DOMContentLoaded", async () => {
  // Toggle Sidebar
  window.toggleSidebar = function () {
    document.getElementById("sidebar").classList.toggle("collapsed");
  };

  // Hide admin tab if not admin
  if (localStorage.getItem("isAdmin") !== "true") {
    const adminMenu = document.getElementById("adminMenu");
    if (adminMenu) adminMenu.style.display = "none";
  }

  // Logout
  window.logout = function () {
    localStorage.removeItem("loggedInUser");
    window.location.href = "/login/login.html";
  };

  // Fetch data
  let appointments = [];
  let schedules = [];

  try {
    const res = await fetch("/appointment");
    appointments = await res.json();
  } catch (err) {
    console.error("Failed to fetch appointments:", err);
  }

  try {
    const res = await fetch("/schedule");
    schedules = await res.json();
  } catch (err) {
    console.error("Failed to fetch schedules:", err);
  }

  // Initialize charts
  const appointmentsChart = new Chart(
    document.getElementById("appointmentsChart").getContext("2d"),
    generateChartConfig([], "Appointments", "#3498db")
  );

  const scheduleChart = new Chart(
    document.getElementById("scheduleChart").getContext("2d"),
    generateChartConfig([], "Scheduled Tasks", "#f39c12")
  );

  // Expose update functions to buttons
  window.updateAppointmentsChart = (range) => {
    const { labels, data } = processData(appointments, range);
    updateChart(appointmentsChart, labels, data);
  };

  window.updateScheduleChart = (range) => {
    const { labels, data } = processData(schedules, range);
    updateChart(scheduleChart, labels, data);
  };

  // Load default view
  updateAppointmentsChart("weekly");
  updateScheduleChart("weekly");
});

// Helper: Create chart configuration
function generateChartConfig(data, label, color) {
  return {
    type: "bar",
    data: {
      labels: [],
      datasets: [
        {
          label,
          data,
          backgroundColor: color,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0,
          },
        },
      },
    },
  };
}

// Helper: Update chart with new labels/data
function updateChart(chart, labels, data) {
  chart.data.labels = labels;
  chart.data.datasets[0].data = data;
  chart.update();
}

// Helper: Process data per range
function processData(dataList, range) {
  const result = {};
  const now = new Date();

  dataList.forEach((item) => {
    const date = new Date(item.date);

    let key;
    if (range === "weekly") {
      key = date.toLocaleDateString("en-US", { weekday: "short" }); // e.g. Mon
    } else if (range === "monthly") {
      key = String(date.getDate()).padStart(2, "0"); // 01–31
    } else if (range === "yearly") {
      key = date.toLocaleDateString("en-US", { month: "short" }); // Jan–Dec
    }

    result[key] = (result[key] || 0) + 1;
  });

  let labels;
  if (range === "weekly") {
    labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  } else if (range === "monthly") {
    labels = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));
  } else if (range === "yearly") {
    labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  }

  const data = labels.map((label) => result[label] || 0);
  return { labels, data };
}

