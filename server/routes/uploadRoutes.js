import express from 'express';
import multer from 'multer';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Cloudinary config (Vercel Environment Variables se aata hai)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Vercel par disk read-only hai, isliye file memory me rakh kar seedha Cloudinary bhejte hain
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB (Vercel body limit ~4.5MB hoti hai)
  fileFilter(req, file, cb) {
    const ok =
      /jpg|jpeg|png|webp/.test(path.extname(file.originalname).toLowerCase()) &&
      /jpg|jpeg|png|webp/.test(file.mimetype);
    ok ? cb(null, true) : cb(new Error('Images only (jpg, jpeg, png, webp)'));
  },
});

const uploadToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: process.env.CLOUDINARY_FOLDER || 'mirha-fashion', resource_type: 'image' },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });

// Sirf logged-in admin upload kar sakta hai
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return res.status(500).json({ message: 'Cloudinary env variables set nahi hain' });
  }
  try {
    const result = await uploadToCloudinary(req.file.buffer);
    res.json({ url: result.secure_url, publicId: result.public_id });
  } catch (err) {
    console.error('Cloudinary upload error:', err.message);
    res.status(500).json({ message: err.message || 'Image upload failed' });
  }
});

export default router;
