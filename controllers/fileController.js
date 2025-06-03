const File = require('../models/file');
const jwt = require('jsonwebtoken');

exports.uploadFile = async (req, res) => {
  try {
    const expiresIn = req.body.expiresIn || '7d'; 
    const token = jwt.sign(
      { file: req.file.filename },
      process.env.JWT_SECRET,
      { expiresIn }
    );
    const file = await File.create({
      filename: req.file.originalname,
      storedName: req.file.filename,
      user: req.user.id,
      token
    });

    res.status(200).json({ message: 'Uploaded', token });
  } catch (err) {
    console.error("Upload error:", err.message);
    res.status(500).json({ message: 'Upload failed' });
  }
};

exports.getUserFiles = async (req, res) => {
  const files = await File.find({ user: req.user.id });
  res.json(files.map(f => ({
    _id: f._id,
    filename: f.filename,
    uploadedAt: f.createdAt,
    token: f.token
  })));
};


exports.deleteFile = async (req, res) => {
  try {
    await File.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
};
