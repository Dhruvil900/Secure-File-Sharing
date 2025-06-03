const File = require('../models/file');
const jwt = require('jsonwebtoken');

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
