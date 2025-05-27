const express = require('express');
const router = express.Router();
const multer = require('multer');
const { authenticateToken } = require('../middleware/authMiddleware');
const fileController = require('../controllers/fileController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.post('/upload', authenticateToken, upload.single('file'), fileController.uploadFile);

router.get('/my-files', authenticateToken, fileController.getUserFiles);

router.get('/download/:token', fileController.downloadFile);

router.delete('/:id', authenticateToken, fileController.deleteFile);

module.exports = router;
