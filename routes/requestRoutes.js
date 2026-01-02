import express from 'express';
import {
  getRequests,
  getRequest,
  createRequest,
  deleteRequest,
  exportRequests
} from '../controllers/requestController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public route for creating requests (from the form)
router.post('/', createRequest);

// Protected routes (require authentication)
router.get('/', protect, getRequests);
router.get('/export', protect, exportRequests);
router.get('/:id', protect, getRequest);
router.delete('/:id', protect, deleteRequest);

export default router;
