const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const customersRouter = require('./routes/customers');
const uploadRouter = require('./routes/upload');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Statik faylları xidmət etmək üçün
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/customers', customersRouter);
app.use('/api/upload', uploadRouter);

// MongoDB bağlantısı
mongoose.connect('mongodb://localhost:27017/car_track')
  .then(() => console.log('MongoDB-ə qoşuldu'))
  .catch(err => console.error('MongoDB qoşulma xətası:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda işləyir`);
}); 