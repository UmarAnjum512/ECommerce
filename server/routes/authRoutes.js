import express from 'express';
import {
  loginUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
} from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/users').get(protect, admin, getAllUsers);

export default router;
