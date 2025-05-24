const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.use(express.static("login"));
app.use(express.static("main"));
app.use(express.static("register"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login", "login.html"));
});
