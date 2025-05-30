if (localStorage.getItem("isAdmin") !== "true") {
  // Not an admin, redirect away
  window.location.href = "../dashboard.html"; // Change path as needed
}

function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("collapsed");
}

function logout() {
  window.location.href = "/login/login.html";
}
fetch("/users.json")
  .then(response => response.json())
  .then(data => {
    const userList = document.getElementById("userList");
    if (data.length === 0) {
      userList.innerHTML = "<p>No users found.</p>";
    } else {
      const html = data.map(user => `<p>${user.username} - ${user.email}</p>`).join("");
      userList.innerHTML = html;
    }
  })
  .catch(err => console.error("Error loading users:", err));

// Fetch and display users
async function fetchUsers() {
  try {
    const response = await fetch("/users.json");
    if (!response.ok) throw new Error("Failed to load users.");
    const usersObj = await response.json();
    
    // Convert object to array
    const users = Object.values(usersObj);
    
    displayUsers(users);
  } catch (error) {
    console.error(error);
    document.getElementById("userList").innerHTML = "<p>Error loading users.</p>";
  }
}


function displayUsers(users) {
  if (!Array.isArray(users)) {
    document.getElementById("userList").innerHTML = "<p>No users found.</p>";
    return;
  }

  const table = document.createElement("table");
  table.innerHTML = `
    <thead>
      <tr>
        
        <th>Username</th>
        <th>Email</th>
        
      </tr>
    </thead>
    <tbody>
      ${users.map(user => `
        <tr>
         
          <td>${user.username || "-"}</td>
          <td>${user.email || "-"}</td>
          
        </tr>
      `).join("")}
    </tbody>
  `;
  document.getElementById("userList").innerHTML = ""; // Clear existing content
  document.getElementById("userList").appendChild(table);
}


// Load users on page load
fetchUsers();


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
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}
