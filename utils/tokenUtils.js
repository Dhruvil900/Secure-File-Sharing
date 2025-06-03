const jwt = require('jsonwebtoken');

const generateDownloadToken = (fileId) => {
  return jwt.sign(
    { fileId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.TOKEN_EXPIRES_IN || '24h' }
  );
};


module.exports = { generateDownloadToken, verifyDownloadToken };