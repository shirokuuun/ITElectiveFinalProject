window.toggleSidebar = function () {
  document.getElementById("sidebar").classList.toggle("collapsed");
};

if (localStorage.getItem("isAdmin") !== "true") {
  const adminMenu = document.getElementById("adminMenu");
  if (adminMenu) adminMenu.style.display = "none";
}

function showTab(tabId) {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.remove("active");
  });
  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.remove("active");
  });
  document
    .querySelector(`.tab[onclick="showTab('${tabId}')"]`)
    .classList.add("active");
  document.getElementById(tabId).classList.add("active");
}

function setTheme(theme) {
  console.log("Setting theme to:", theme);
  localStorage.setItem("theme", theme);
  applyStoredTheme();
}

function applyStoredTheme() {
  const theme = localStorage.getItem("theme") || "system";
  console.log("Applying theme:", theme);

  document.body.classList.remove("theme-dark", "theme-light", "theme-system");
  document.body.classList.add(`theme-${theme}`);

  document.querySelectorAll(".theme-option").forEach((el) => {
    el.classList.remove("selected");
  });

  const active = document.getElementById(`theme-${theme}`);
  if (active) active.classList.add("selected");
}

applyStoredTheme();

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}
