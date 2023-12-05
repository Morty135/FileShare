require("dotenv").config();
const multer = require("multer");
const mongoose = require("mongoose");
const File = require("./models/File");
const path = require("path");
const cron = require("node-cron");
const fs = require("fs/promises");

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
    `<p>File download link: <a id="file-link">${req.headers.origin}/file/${file.id}</a>
    <button onclick="copyLinkToClipboard()">Clipboard</button>
    </p>`
  );
});

app.get("/file/:id", async (req, res) => {
  const file = await File.findById(req.params.id);

  file.downloadCount++;
  await file.save();
  console.log(file.downloadCount);

  res.download(file.path, file.originalName);
});

// Schedule a task to run every 1 minute to delete files older than 4 hours
cron.schedule("0 */1 * * *", async () => {
  const filesToDelete = await File.find({
    createdAt: { $lt: new Date(Date.now() - 4 * 60 * 60 * 1000) },
  });

  // Delete files and remove records from the database
  for (const fileToDelete of filesToDelete) {
    try {
      await fs.unlink(fileToDelete.path);
      await File.findByIdAndRemove(fileToDelete._id);
      console.log(`File deleted: ${fileToDelete.originalName}`);
    } catch (error) {
      console.error(`Error deleting file: ${fileToDelete.originalName}`, error);
    }
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});