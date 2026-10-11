import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import collectionRoutes from './routes/collectionRoutes.js';
import bannerRoutes from './routes/bannerRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connect (serverless-safe: har request par check, already connected ho to skip)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Mirha_fashion';
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGO_URI);
};
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    res.status(500).json({ message: 'Database connection failed' });
  }
});

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => res.json({ status: 'ok', message: 'Mirha Fashion API running' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', store: 'Mirha Fashion API', time: new Date() });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Local par server chalao; Vercel par sirf app export hoti hai
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Mirha Fashion Server running on port ${PORT}`);
  });
}

export default app;
