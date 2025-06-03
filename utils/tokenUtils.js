const jwt = require('jsonwebtoken');

const generateDownloadToken = (fileId) => {
  return jwt.sign(
    { fileId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.TOKEN_EXPIRES_IN || '24h' }
  );
};

const verifyDownloadToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = { generateDownloadToken, verifyDownloadToken };