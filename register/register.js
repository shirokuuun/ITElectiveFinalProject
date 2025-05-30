document
  .getElementById("registerForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const email = document.getElementById("email").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!firstName || !email || !username || !password) {
      alert("All fields are required.");
      return;
    }

    fetch("/users.json")
      .then((response) => response.json())
      .then((users) => {
        // Check for existing username
        if (users[username]) {
          alert("Username already exists.");
          throw new Error("Duplicate username");
        }

        // Add new user
        users[username] = {
          firstName,
          email,
          username,
          password,
          profileImage: "",
          isAdmin: false,
        };

        // Send updated users back to server
        return fetch("/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(users),
        });
      })
      .then((res) => {
        if (res.ok) {
          alert("Registration successful!");
          window.location.href = "login.html";
        } else {
          throw new Error("Failed to save user");
        }
      })
      .catch((error) => {
        console.error("Registration error:", error.message);
        if (error.message !== "Duplicate username") {
          alert("Something went wrong. Please try again.");
        }
      });
  });
