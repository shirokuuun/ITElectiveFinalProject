function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("collapsed");
}

function logout() {
  window.location.href = "/login/login.html";
}

document.addEventListener("DOMContentLoaded", () => {
  // Chart 1: Appointments This Week
  const appointmentsCtx = document.getElementById("appointmentsChart").getContext("2d");
  new Chart(appointmentsCtx, {
    type: "bar",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [{
        label: "Appointments",
        data: [2, 3, 4, 1, 5, 0, 1],
        backgroundColor: "#3498db"
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });

  // Chart 2: Notes Created Over Time
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
      plugins: {
        legend: { display: true }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
});
