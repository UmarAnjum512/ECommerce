import express from 'express';
import {
  createOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getAdminDashboardStats,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(createOrder)
  .get(protect, admin, getAllOrders);

router.route('/admin/stats').get(protect, admin, getAdminDashboardStats);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:identifier').get(getOrderById);
router.route('/:id/status').put(protect, admin, updateOrderStatus);

export default router;
