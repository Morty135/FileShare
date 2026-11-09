// Simple Node.js test script for FileShare without Docker
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3030;

// Configure multer with max file size - 1GB
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 1073741824 // 1GB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept all file types
    cb(null, true);
  }
});

// Serve static files
app.use(express.static('src/public'));

// Middleware to handle JSON body parsing
app.use(express.json());

// Basic routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/public/index.html'));
});

// Upload route
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  // Generate a download link for the uploaded file
  const downloadLink = `${req.protocol}://${req.get('host')}/download/${req.file.filename}`;
  res.json({ 
    message: 'File uploaded successfully',
    filename: req.file.filename,
    originalname: req.file.originalname,
    size: req.file.size,
    downloadLink: downloadLink
  });
});

// Download route
app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join('uploads', filename);
  
  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send('File not found.');
    }
    
    // Serve the file
    res.download(filePath);
  });
});

// File listing route
app.get('/files', (req, res) => {
  fs.readdir('uploads', (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to list files' });
    }
    res.json({ files });
  });
});

// Create uploads directory if it doesn't exist
try {
  if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
  }
} catch (err) {
  console.error('Error creating uploads directory:', err);
}

// Start server
app.listen(port, () => {
  console.log(`FileShare server running at http://localhost:${port}`);
  console.log(`1GB file sharing support enabled`);
  console.log(`Y2K Chaotic Aesthetic Design Active`);
});

// Export for testing
module.exports = app;