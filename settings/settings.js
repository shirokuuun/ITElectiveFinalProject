window.toggleSidebar = function () {
  document.getElementById("sidebar").classList.toggle("collapsed");
};

if (localStorage.getItem("isAdmin") !== "true") {
  const adminMenu = document.getElementById("adminMenu");
  if (adminMenu) adminMenu.style.display = "none";
}

function showTab(tabId) {
  const tabs = document.querySelectorAll('.tab');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => tab.classList.remove('active'));
  contents.forEach(content => content.classList.remove('active'));

  document.querySelector(`.tab[onclick="showTab('${tabId}')"]`).classList.add('active');
  document.getElementById(tabId).classList.add('active');
}


function setTheme(theme) {
  document.body.dataset.theme = theme;
  localStorage.setItem("theme", theme);

  document
    .querySelectorAll(".theme-option")
    .forEach((el) => el.classList.remove("selected"));
  document.getElementById(`theme-${theme}`).classList.add("selected");
}

function applyStoredTheme() {
  const theme = localStorage.getItem("theme") || "system";
  document.body.dataset.theme = theme;
  const active = document.getElementById(`theme-${theme}`);
  if (active) active.classList.add("selected");
}

applyStoredTheme();

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}