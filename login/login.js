// Load users.json into localStorage
fetch("/users.json")
  .then((response) => response.json())
  .then((data) => {
    localStorage.setItem("users", JSON.stringify(data));
    console.log("Users loaded into localStorage.");
  })
  .catch((error) => {
    console.error("Error loading users.json:", error);
  });

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const users = JSON.parse(localStorage.getItem("users")) || {};
  const user = users[username];

  if (user && user.password === password) {
    alert("Login successful!");
    localStorage.setItem("loggedInUser", username);
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid username or password.");
  }
});
