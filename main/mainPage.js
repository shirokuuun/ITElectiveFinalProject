window.toggleSidebar = function () {
  document.getElementById("sidebar").classList.toggle("collapsed");
};

if (localStorage.getItem("isAdmin") !== "true") {
  const adminMenu = document.getElementById("adminMenu");
  if (adminMenu) adminMenu.style.display = "none";
}

let tasksData = {};

function loadTasksFromServer() {
  fetch("/tasks")
    .then((res) => res.json())
    .then((data) => {
      tasksData = data;
      renderTasks();
      setupAddButtons();
    })
    .catch((err) => console.error("Failed to load tasks:", err));
}

function saveTasksToServer() {
  fetch("/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tasksData),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to save");
    })
    .catch((err) => console.error("Save error:", err));
}

function createTaskElement(phase, taskObj, index) {
  const taskDiv = document.createElement("div");
  taskDiv.className = "task";

  const title = document.createElement("strong");
  title.textContent = taskObj.title || "No Title";

  const description = document.createElement("p");
  description.textContent = taskObj.description || "";

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "✖";
  deleteBtn.title = "Delete Task";
  deleteBtn.style.marginLeft = "10px";
  deleteBtn.style.cursor = "pointer";
  deleteBtn.style.backgroundColor = "transparent";
  deleteBtn.style.border = "none";
  deleteBtn.style.color = "red";
  deleteBtn.style.fontSize = "16px";

  deleteBtn.addEventListener("click", () => {
    tasksData[phase].splice(index, 1);
    saveTasksToServer();
    renderTasks();
  });

  taskDiv.appendChild(title);
  taskDiv.appendChild(description);
  taskDiv.appendChild(deleteBtn);

  return taskDiv;
}

function renderTasks() {
  document.querySelectorAll(".column").forEach((column) => {
    const phase = column.querySelector("h3").textContent;
    const taskDivs = column.querySelectorAll(".task");
    taskDivs.forEach((div) => div.remove()); // Clear existing

    const tasks = tasksData[phase] || [];
    tasks.forEach((task, index) => {
      const taskElement = createTaskElement(phase, task, index);
      column.appendChild(taskElement);
    });
  });
}

function setupAddButtons() {
  document.querySelectorAll(".column").forEach((column) => {
    const button = column.querySelector(".add-task");
    const phase = column.querySelector("h3").textContent;

    button.addEventListener("click", () => {
      const taskTitle = prompt(`Enter a title for the "${phase}" task:`);
      if (!taskTitle) return;

      const taskDescription = prompt(`Enter a description for "${taskTitle}":`);
      if (!taskDescription) return;

      if (!tasksData[phase]) tasksData[phase] = [];
      tasksData[phase].push({ title: taskTitle, description: taskDescription });
      saveTasksToServer();
      renderTasks();
    });
  });
}

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}

loadTasksFromServer();
