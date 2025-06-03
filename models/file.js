const mongoose = require('mongoose');
const fileSchema = new mongoose.Schema({
  filename: String,
}, { timestamps: true });
module.exports = mongoose.model('File', fileSchema);
