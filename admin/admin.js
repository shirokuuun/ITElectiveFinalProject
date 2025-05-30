if (localStorage.getItem("isAdmin") !== "true") {
  // Not an admin, redirect away
  window.location.href = "../dashboard.html"; // Adjust if needed
}

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("collapsed");
}

function logout() {
  alert("Logging out...");
  // Add logout logic here
}

function getAllUsers() {
  fetch("/users.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      return response.json();
    })
    .then((users) => {
      const container = document.getElementById("usersContainer");
      container.innerHTML = ""; // Clear previous results

      // Loop through each key in the users object
      Object.keys(users).forEach((username) => {
        const user = users[username];
        const userDiv = document.createElement("div");
        userDiv.className = "user-card";
        userDiv.innerHTML = `
          <strong>${user.firstName}</strong><br />
          Email: ${user.email}<br />
          Username: ${user.username}<br />
        `;
        container.appendChild(userDiv);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
      document.getElementById("usersContainer").innerText =
        "Failed to load users.";
    });
}
