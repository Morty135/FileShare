require("dotenv").config();
const multer = require("multer");
const mongoose = require("mongoose");
const File = require("./models/File");
const path = require("path");
const cron = require("node-cron");
const fs = require("fs/promises");
const express = require("express");
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configure multer with max file size
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.env.UPLOAD_PATH || "uploads");
  },
  filename: function (req, file, cb) {
    // Create a unique filename to avoid conflicts
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 1073741824 // Default 1GB (can be adjusted)
  },
  fileFilter: function (req, file, cb) {
    // Accept all file types
    cb(null, true);
  }
});

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const fileData = {
      path: req.file.path,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    };

    const file = await File.create(fileData);

    // Get the base URL from the request headers
    const baseUrl = req.protocol + '://' + req.get('host');
    
    res.send(
      `<p>File download link: <a id="file-link" href="${baseUrl}/file/${file.id}">${baseUrl}/file/${file.id}</a>
      <button onclick="copyLinkToClipboard()">Clipboard</button>
      </p>`
    );
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).send("Error uploading file.");
  }
});

app.get("/file/:id", async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    
    if (!file) {
      return res.status(404).send("File not found.");
    }

    file.downloadCount = (file.downloadCount || 0) + 1;
    await file.save();
    console.log(`File downloaded: ${file.originalName}, count: ${file.downloadCount}`);

    // Set headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
    res.setHeader('Content-Type', file.mimetype);
    
    res.download(file.path, file.originalName);
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).send("Error downloading file.");
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// Schedule a task to run every 1 minute to delete files older than 4 hours
cron.schedule("0 */1 * * *", async () => {
  try {
    console.log("Running cleanup job...");
    
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
    
    console.log(`Cleanup job completed. Deleted ${filesToDelete.length} files.`);
  } catch (error) {
    console.error("Cron job error:", error);
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Unhandled error:", error);
  res.status(500).send("Internal server error.");
});

// Handle 404
app.use((req, res) => {
  res.status(404).send("Page not found.");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});