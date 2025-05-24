document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    alert("Login successful!");
    window.location.href = "mainPage.html";
  } else {
    alert("Invalid username or password.");
  }
});
