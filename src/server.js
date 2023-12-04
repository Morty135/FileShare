require("dotenv").config();
const multer = require("multer");
const mongoose = require("mongoose");
const File = require("./models/File");
const path = require("path")

const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));

const upload = multer({ dest: "uploads" });

mongoose.connect(process.env.DATABASE_URL);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/html/index.html");
});

app.post("/upload", upload.single("file"), async (req, res) => {
  const fileData = {
    path: req.file.path,
    originalName: req.file.originalname,
  };

  const file = await File.create(fileData);

  res.send(
    `<p>Your file is uploaded. Download it <a href="${req.headers.origin}/file/${file.id}">here</a>.</p>`
  );
});

app.get("/file/:id", async (req, res) => {
  const file = await File.findById(req.params.id);

  file.downloadCount++;
  await file.save();
  console.log(file.downloadCount);

  res.download(file.path, file.originalName);
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});