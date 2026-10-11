import express from 'express';
import {
  getBanners,
  getAllBannersAdmin,
  createBanner,
  updateBanner,
  deleteBanner,
} from '../controllers/bannerController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getBanners)
  .post(protect, admin, createBanner);

router.route('/admin')
  .get(protect, admin, getAllBannersAdmin);

router.route('/:id')
  .put(protect, admin, updateBanner)
  .delete(protect, admin, deleteBanner);

export default router;
