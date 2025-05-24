document
  .getElementById("registerForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("newUsername").value;
    const password = document.getElementById("newPassword").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.find((user) => user.username === username)) {
      alert("Username already exists!");
      return;
    }

    users.push({ username, password });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Registration successful! Go back to login.");
    window.location.href = "login.html";
  });
