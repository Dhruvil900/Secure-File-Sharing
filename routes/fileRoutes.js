const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware').protect;
const fileController = require('../controllers/fileController');

// Debug imports
console.log('Middleware and controllers verified:', {
  protect: typeof protect,
  getUserFiles: typeof fileController.getUserFiles,
  uploadFiles: typeof fileController.uploadFiles,
  downloadFile: typeof fileController.downloadFile,
  deleteFile: typeof fileController.deleteFile
});

// Routes
router.get('/', protect, fileController.getUserFiles);
router.post('/upload', protect, fileController.uploadFiles);
router.get('/download/:token', protect, fileController.downloadFile);
router.delete('/:id', protect, fileController.deleteFile);

module.exports = router;