import express from 'express';
import {
  getCollections,
  createCollection,
  deleteCollection,
} from '../controllers/collectionController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getCollections)
  .post(protect, admin, createCollection);

router.route('/:id')
  .delete(protect, admin, deleteCollection);

export default router;
