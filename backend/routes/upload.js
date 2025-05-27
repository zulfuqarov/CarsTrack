const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Şəkillərin saxlanılacağı qovluqları yaradırıq
const uploadDirs = [
  'auction',
  'americanDepot',
  'containerLoading',
  'containerUnloading',
  'bakuRoad',
  'bakuCustoms'
];

uploadDirs.forEach(dir => {
  const dirPath = path.join(__dirname, '../uploads', dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Multer konfiqurasiyası
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const category = req.params.category;
    const uploadPath = path.join(__dirname, '../uploads', category);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Yalnız şəkil fayllarını qəbul edirik
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Yalnız şəkil faylları yükləyə bilərsiniz!'), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Şəkil yükləmə endpointi
router.post('/:category', upload.array('images', 10), (req, res) => {
  try {
    const category = req.params.category;
    const files = req.files;
    
    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'Heç bir şəkil yüklənmədi' });
    }

    // Şəkillərin URL-lərini yaradırıq
    const urls = files.map(file => {
      return `/uploads/${category}/${file.filename}`;
    });

    res.json({ urls });
  } catch (error) {
    console.error('Şəkil yükləmə xətası:', error);
    res.status(500).json({ message: 'Şəkil yükləmə zamanı xəta baş verdi' });
  }
});

module.exports = router; 