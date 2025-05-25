const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static("login"));
app.use(express.static("main"));
app.use(express.static("register"));
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
