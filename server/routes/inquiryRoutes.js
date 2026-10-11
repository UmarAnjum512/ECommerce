import express from 'express';
import { submitInquiry, getInquiries } from '../controllers/inquiryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(submitInquiry)
  .get(protect, admin, getInquiries);

export default router;
