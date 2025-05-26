const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api', require('./routes/fileRoutes'));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log(' MongoDB connected');
    app.listen(process.env.PORT || 3000, () => {
      console.log('Server running on http://localhost:' + (process.env.PORT || 3000));
    });
  })
  .catch(err => console.error('MongoDB connection failed:', err));
