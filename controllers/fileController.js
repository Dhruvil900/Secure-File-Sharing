const multer = require('multer');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const File = require('../models/file');
const { encryptFile } = require('../utils/encrypt'); // Make sure this exists

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure uploads directory exists
    const uploadPath = 'uploads/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Initialize multer
const upload = multer({ 
  storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
}).array('files');

// Get user's files
exports.getUserFiles = async (req, res) => {
  try {
    const files = await File.find({
      userId: req.user.id,
      tokenExpires: { $gt: Date.now() },
    }).sort({ createdAt: -1 });

    res.status(200).json({ files });
  } catch (error) {
    res.status(500).json({ message: "Error fetching files" });
  }
};

// Upload files
exports.uploadFiles = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ 
          success: false,
          message: err.code === 'LIMIT_FILE_SIZE' 
            ? 'File too large (max 100MB)' 
            : 'Upload failed: ' + err.message
        });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ 
          success: false,
          message: 'No files selected' 
        });
      }

      try {
        const savedFiles = await Promise.all(
          req.files.map(async (file) => {
            // 1. Encrypt the file
            const { encryptedData, iv } = await encryptFile(file.path);
            
            // 2. Overwrite with encrypted data
            fs.writeFileSync(file.path, encryptedData);
            
            // 3. Create database record
            const newFile = new File({
              userId: req.user.id,
              filename: file.originalname,
              path: file.path,
              size: file.size,
              mimetype: file.mimetype,
              downloadToken: crypto.randomBytes(20).toString('hex'),
              tokenExpires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
              iv: iv.toString('hex')
            });

            return await newFile.save();
          })
        );

        res.status(200).json({
          success: true,
          message: `${req.files.length} file(s) uploaded successfully`,
          files: savedFiles.map(f => ({
            id: f._id,
            name: f.filename,
            size: f.size,
            downloadLink: `/download/${f.downloadToken}`,
            expires: f.tokenExpires
          }))
        });

      } catch (error) {
        console.error('File processing error:', error);
        
        // Cleanup: Delete any partially uploaded files
        if (req.files) {
          req.files.forEach(file => {
            try { fs.unlinkSync(file.path); } catch (e) {}
          });
        }

        res.status(500).json({
          success: false,
          message: 'Error processing files: ' + error.message
        });
      }
    });
  } catch (error) {
    console.error('Upload handler error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};
// Download file
exports.downloadFile = async (req, res) => {
  try {
    const file = await File.findOne({
      downloadToken: req.params.token,
      tokenExpires: { $gt: Date.now() },
    });

    if (!file) {
      return res
        .status(404)
        .json({ message: "File not found or link expired" });
    }

    // Verify ownership
    if (file.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Unauthorized access" });
    }
    const encryptedData = fs.readFileSync(file.path);
    const decryptedData = decryptFile(encryptedData, file.iv);
    res.send(decryptedData);

    // Send file for download
    res.download(file.path, file.filename, (err) => {
      if (err) {
        console.error("Download error:", err);
        res.status(500).json({ message: "Error downloading file" });
      }
    });
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ message: "Server error during download" });
  }
};

// Delete file (optional)
exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Delete the actual file (optional)
    const fs = require("fs");
    fs.unlink(file.path, () => {}); // Silent fail if file doesn't exist

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting file" });
  }
};

module.exports = {
  getUserFiles: exports.getUserFiles,
  uploadFiles: exports.uploadFiles,
  downloadFile: exports.downloadFile,
  deleteFile: exports.deleteFile,
};
