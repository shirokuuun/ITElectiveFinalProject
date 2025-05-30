const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;
const multer = require("multer");

const uploadDir = path.join(__dirname, "public", "uploads");
const dataDir = path.join(__dirname, "data");
const dataFile = path.join(dataDir, "documents.json");

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, "[]");

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "_" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

app.use(express.static("public"));

app.use(express.json());

// Serve static directories
const staticDirs = [
  "login",
  "main",
  "register",
  "settings",
  "settings/profile",
  "dashboard",
  "notes",
  "notification",
  "calendar",
  "schedule",
  "appointment",
  "admin",
  "documents",
  "images",
];

staticDirs.forEach((dir) => app.use(express.static(dir)));

// GET home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login", "login.html"));
});

app.get("/appointment", (req, res) => {
  readJsonFile("appointment.json", res);
});

app.post("/appointment", (req, res) => {
  writeJsonFile("appointment.json", req.body, res, "Tasks saved");
});

// GET notes
app.get("/notes", (req, res) => {
  readJsonFile("notes.json", res);
});

// POST notes
app.post("/notes", (req, res) => {
  const data = req.body;
  if (typeof data !== "object" || !data.notes) {
    return res.status(400).json({ error: "Invalid notes format" });
  }
  writeJsonFile("notes.json", data, res, "Notes saved");
});
// GET calendar notes
app.get("/calendar", (req, res) => {
  readJsonFile("calendar.json", res);
});

// POST calendar notes
app.post("/calendar", (req, res) => {
  const data = req.body;
  if (typeof data !== "object") {
    return res.status(400).json({ error: "Invalid calendar data format" });
  }
  writeJsonFile("calendar.json", data, res, "Calendar notes saved");
});

// GET users
app.get("/users.json", (req, res) => {
  readJsonFile("users.json", res);
});

// POST users
app.post("/users", (req, res) => {
  writeJsonFile("users.json", req.body, res, "Users updated successfully");
});

// GET schedule
app.get("/schedule", (req, res) => {
  readJsonFile("schedule.json", res);
});

// POST schedule
app.post("/schedule", (req, res) => {
  writeJsonFile("schedule.json", req.body, res, "Schedule saved");
});

app.get("/api/documents", (req, res) => {
  const docs = JSON.parse(fs.readFileSync(dataFile));
  res.json(docs);
});

app.post("/api/upload", upload.single("file"), (req, res) => {
  const { originalname, mimetype, size, filename } = req.file;
  const newDoc = {
    name: originalname,
    type: mimetype,
    size,
    storedName: filename,
    uploadedAt: new Date().toISOString(),
  };

  const docs = JSON.parse(fs.readFileSync(dataFile));
  docs.push(newDoc);
  fs.writeFileSync(dataFile, JSON.stringify(docs, null, 2));
  res.status(201).json({ message: "Uploaded", file: newDoc });
});

app.delete("/api/documents/:filename", (req, res) => {
  const { filename } = req.params;
  const docs = JSON.parse(fs.readFileSync(dataFile));
  const updatedDocs = docs.filter((doc) => doc.storedName !== filename);

  const filePath = path.join(uploadDir, filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  fs.writeFileSync(dataFile, JSON.stringify(updatedDocs, null, 2));
  res.json({ message: "Deleted" });
});

// Utility function to read JSON
function readJsonFile(filename, res) {
  try {
    const data = fs.readFileSync(path.join(__dirname, filename), "utf-8");
    res.json(JSON.parse(data));
  } catch (err) {
    console.error(`Failed to read ${filename}:`, err);
    res.status(500).json({ error: `Could not read ${filename}` });
  }
}

// Utility function to write JSON
function writeJsonFile(filename, content, res, successMessage) {
  try {
    fs.writeFileSync(
      path.join(__dirname, filename),
      JSON.stringify(content, null, 2)
    );
    res.status(200).send(successMessage);
  } catch (err) {
    console.error(`Failed to write ${filename}:`, err);
    res.status(500).json({ error: `Could not save ${filename}` });
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
