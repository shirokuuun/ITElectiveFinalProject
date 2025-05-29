document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("loggedInUser");
  if (!username) {
    alert("No user logged in!");
    window.location.href = "login.html";
    return;
  }

  fetch("/users.json")
    .then((res) => res.json())
    .then((users) => {
      const userData = users[username];

      const firstNameInput = document.getElementById("firstName");
      const emailInput = document.getElementById("email");
      const usernameInput = document.getElementById("username");
      const profileForm = document.getElementById("profile-form");
      const mainPic = document.getElementById("main-pic");
      const previewPic = document.getElementById("preview");

      // Load user data into form
      if (userData) {
        firstNameInput.value = userData.firstName || "";
        emailInput.value = userData.email || "";
        usernameInput.value = userData.username || "";

        document.getElementById("display-name").textContent =
          userData.firstName || "";
        document.getElementById("display-email").textContent =
          userData.email || "";

        if (userData.profileImage) {
          mainPic.src = userData.profileImage;
          previewPic.src = userData.profileImage;
        }
      }

      // Handle form submission
      profileForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const firstName = firstNameInput.value.trim();
        const email = emailInput.value.trim();
        const newUsername = usernameInput.value.trim();

        // Update user data
        const updatedUser = {
          ...userData,
          firstName,
          email,
          username: newUsername,
          profileImage: userData.profileImage || "",
        };

        // Update the users object
        if (newUsername !== username) {
          delete users[username];
        }
        users[newUsername] = updatedUser;

        // Save new username to localStorage
        localStorage.setItem("loggedInUser", newUsername);

        // Send updated users.json to server
        fetch("/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(users),
        })
          .then((res) => {
            if (!res.ok) throw new Error("Failed to save user to server.");
            alert("Profile updated successfully!");
            window.location.reload(); // Optional: refresh UI
          })
          .catch((err) => {
            console.error("Error saving users:", err);
            alert("Error saving profile.");
          });
      });

      // Handle profile image upload
      document
        .getElementById("image-upload")
        .addEventListener("change", function () {
          const file = this.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = function () {
              const dataURL = reader.result;
              mainPic.src = dataURL;
              previewPic.src = dataURL;

              userData.profileImage = dataURL;

              // Update and POST users
              users[username].profileImage = dataURL;
              fetch("/users", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(users),
              })
                .then((res) => {
                  if (!res.ok) throw new Error("Failed to save profile image.");
                  console.log("Profile image updated.");
                })
                .catch((err) => {
                  console.error("Error uploading image:", err);
                });
            };
            reader.readAsDataURL(file);
          }
        });
    })
    .catch((error) => {
      console.error("Failed to load users.json:", error);
      alert("Unable to load user data.");
    });
});
