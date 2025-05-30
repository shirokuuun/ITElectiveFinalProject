let tasksData = {};

function loadTasksFromServer() {
  fetch("/notes")
    .then((res) => res.json())
    .then((data) => {
      tasksData = data || { notes: [] };
      renderTasks();
      setupAddButtons();
    })
    .catch((err) => console.error("Failed to load tasks:", err));
}

function createTaskElement(phase, taskObj, index) {
  const taskDiv = document.createElement("div");
  taskDiv.className = "note";

  const span = document.createElement("span");
  span.textContent = taskObj.description;

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

  taskDiv.appendChild(span);
  taskDiv.appendChild(deleteBtn);
  return taskDiv;
}

function renderTasks() {
  const column = document.querySelector(".notes");
  const phase = "notes";
  const taskDivs = column.querySelectorAll(".note");
  taskDivs.forEach((div) => div.remove()); // Clear existing

  const tasks = tasksData[phase] || [];
  tasks.forEach((task, index) => {
    const taskElement = createTaskElement(phase, task, index);
    column.appendChild(taskElement);
  });
}

function setupAddButtons() {
  const column = document.querySelector(".notes");
  const button = column.querySelector(".add-notes");
  const phase = "notes";

  button.addEventListener("click", () => {
    const taskDescription = prompt(`Enter a new note:`);
    if (taskDescription) {
      if (!tasksData[phase]) tasksData[phase] = [];
      tasksData[phase].push({ description: taskDescription });
      saveTasksToServer();
      renderTasks();
    }
  });
}

function saveTasksToServer() {
  fetch("/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tasksData),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to save");
    })
    .catch((err) => console.error("Save error:", err));
}

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}

loadTasksFromServer();