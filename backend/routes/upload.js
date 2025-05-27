const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const path = require('path');

// Cloudinary konfiqurasiyası
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET_KEY
});

// Şəkil yükləmə endpointi
router.post('/:category', async (req, res) => {
  try {
    const category = req.params.category;
    
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: 'Heç bir şəkil yüklənmədi' });
    }

    const files = req.files.images;
    if (!files) {
      return res.status(400).json({ message: 'Şəkillər "images" adı ilə göndərilməlidir' });
    }

    const fileArray = Array.isArray(files) ? files : [files];

    // Şəkilləri Cloudinary-yə yükləyirik
    const uploadPromises = fileArray.map(file => {
      return new Promise((resolve, reject) => {
        if (!file.tempFilePath) {
          reject(new Error('Fayl yüklənmədi'));
          return;
        }

        // Fayl adını təmizləyirik
        const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
        const timestamp = Date.now();
        const finalFileName = `${timestamp}_${cleanFileName}`;

        cloudinary.uploader.upload(file.tempFilePath, {
          folder: `cars-track/${category}`,
          resource_type: 'auto',
          allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
          transformation: [
            { quality: 'auto' },
            { fetch_format: 'auto' }
          ],
          public_id: finalFileName
        }, (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        });
      });
    });

    // Bütün şəkillərin yüklənməsini gözləyirik
    const urls = await Promise.all(uploadPromises);

    res.json({ urls });
  } catch (error) {
    console.error('Şəkil yükləmə xətası:', error);
    res.status(500).json({ 
      message: 'Şəkil yükləmə zamanı xəta baş verdi',
      error: error.message 
    });
  }
});

module.exports = router; 