const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static("login"));
app.use(express.static("main"));
app.use(express.static("register"));
app.use(express.static("settings"));
app.use(express.static("settings/profile"));
app.use(express.static("dashboard"));
app.use(express.static("notes"));
app.use(express.static("notification"));
app.use(express.static("calendar"));
app.use(express.static("schedule"));


app.use(express.json());

// GET tasks
app.get("/tasks", (req, res) => {
  try {
    const data = fs.readFileSync("tasks.json", "utf-8");
    res.json(JSON.parse(data));
  } catch (err) {
    console.error("Failed to read tasks.json:", err);
    res.status(500).json({ error: "Could not read tasks file" });
  }
});

// POST tasks
app.post("/tasks", (req, res) => {
  try {
    fs.writeFileSync("tasks.json", JSON.stringify(req.body, null, 2));
    res.status(200).send("Tasks saved");
  } catch (err) {
    console.error("Failed to write tasks.json:", err);
    res.status(500).json({ error: "Could not save tasks" });
  }
});

// Home route serves login page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login", "login.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// GET users.json
app.get("/users.json", (req, res) => {
  try {
    const data = fs.readFileSync("users.json", "utf-8");
    res.json(JSON.parse(data));
  } catch (err) {
    console.error("Failed to read users.json:", err);
    res.status(500).json({ error: "Could not read users file" });
  }
});

// POST to update users.json
app.post("/users", (req, res) => {
  try {
    const users = req.body;
    fs.writeFileSync("users.json", JSON.stringify(users, null, 2));
    res.status(200).send("Users updated successfully.");
  } catch (err) {
    console.error("Failed to write users.json:", err);
    res.status(500).json({ error: "Could not save users" });
  }
});
