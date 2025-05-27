const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const fileUpload = require('express-fileupload');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const customerRoutes = require('./routes/customers');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS with specific origin
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Express-fileupload middleware
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  abortOnLimit: true,
  responseOnLimit: 'Fayl ölçüsü 5MB-dan çox ola bilməz',
  createParentPath: true,
  debug: false,
  safeFileNames: true,
  preserveExtension: true,
  parseNested: true,
  uriDecodeFileNames: true,
  useTempFiles: true,
  tempFileDir: path.join(__dirname, 'tmp')
}));

// Set static folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/upload', require('./routes/upload'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
}); 