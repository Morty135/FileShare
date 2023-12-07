require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/html/index.html");
});

app.listen(process.env.SITE_PORT, () => {
  console.log(`Frontend server is running on port ${process.env.SITE_PORT}`);
});