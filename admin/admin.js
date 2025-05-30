if (localStorage.getItem("isAdmin") !== "true") {
  // Not an admin, redirect away
  window.location.href = "../dashboard.html"; // Change path as needed
}
