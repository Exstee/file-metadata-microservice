var express = require('express');
var cors = require('cors');
var fs = require('fs');
var path = require('path');
require('dotenv').config();
var multer = require('multer');

var app = express();

app.use(cors());
app.use(express.json());
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/uploads', express.static(process.cwd() + '/uploads'));

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Multer config with file size limit (10MB) and validation
var upload = multer({ 
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  },
  fileFilter: (req, file, cb) => {
    // Dangerous file extensions to block
    const dangerousExtensions = [
      '.exe', '.bat', '.cmd', '.com', '.msi', '.scr', '.vbs', '.ps1',
      '.sh', '.bash', '.app', '.dmg', '.apk', '.jar', '.deb', '.rpm',
      '.php', '.asp', '.aspx', '.jsp', '.cgi', '.pl', '.py', '.rb',
      '.html', '.htm', '.hta', '.lnk', '.pif', '.reg', '.dll', '.sys'
    ];

    // Dangerous MIME types to block
    const dangerousMimeTypes = [
      'application/x-msdownload',
      'application/x-executable',
      'application/x-sh',
      'application/x-bat',
      'application/x-msdos-program',
      'text/html',
      'text/javascript',
      'application/javascript',
      'application/x-httpd-php'
    ];

    // Get file extension
    const fileExt = '.' + file.originalname.split('.').pop().toLowerCase();

    // Check if file extension is dangerous
    if (dangerousExtensions.includes(fileExt)) {
      return cb(new Error(`File type not allowed: ${fileExt} files are blocked for security reasons`), false);
    }

    // Check if MIME type is dangerous
    if (dangerousMimeTypes.includes(file.mimetype)) {
      return cb(new Error(`File type not allowed: ${file.mimetype} is blocked for security reasons`), false);
    }

    // Allow the file
    cb(null, true);
  }
});

// Store uploaded metadata in memory (for demo only)
let metadataHistory = [];

// POST: upload file
app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const sizeInMB = (req.file.size / (1024 * 1024)).toFixed(2);

  const fileData = {
    name: req.file.originalname,
    type: req.file.mimetype,
    size: `${req.file.size} bytes (${sizeInMB} MB)`,
    filename: req.file.filename, // Internal use only
    uploadedAt: new Date().toISOString(), // Internal use only
    path: `/uploads/${req.file.filename}` // Path to access the file
  };

  metadataHistory.unshift(fileData);

  // Keep only last 50 files in history
  if (metadataHistory.length > 50) {
    const removed = metadataHistory.pop();
    // Optionally delete old files from disk
    const oldFilePath = path.join(process.cwd(), 'uploads', removed.filename);
    fs.unlink(oldFilePath, (err) => {
      if (err) console.error('Error deleting old file:', err);
    });
  }

  // Return only user-facing metadata
  res.json({
    name: fileData.name,
    type: fileData.type,
    size: fileData.size
  });
});

// Handle file size limit errors and file filter errors
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
    return res.status(400).json({ error: err.message });
  }

  // Handle custom file filter errors
  if (err.message && err.message.includes('File type not allowed')) {
    return res.status(400).json({ error: err.message });
  }

  next(err);
});

// GET: list of previous metadata
app.get('/api/history', (req, res) => {
  res.json(metadataHistory);
});

// DELETE: delete uploaded file by internal filename
app.delete('/api/delete/:filename', (req, res) => {
  const filename = req.params.filename;

  // Security: prevent path traversal
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return res.status(400).json({ error: 'Invalid filename' });
  }

  const filePath = path.join(process.cwd(), 'uploads', filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Delete error:', err);
      return res.status(404).json({ error: 'File not found or already deleted' });
    }

    // Remove from metadataHistory
    metadataHistory = metadataHistory.filter((item) => item.filename !== filename);

    res.json({ success: true, deleted: filename });
  });
});

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Your app is listening on port ' + port);
});