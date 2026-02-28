import express from 'express';
import {
  getPages,
  getPageBySlug,
  getPageById,
  createPage,
  updatePage,
  deletePage,
} from '../controllers/pageController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public - get published page by slug (for frontend rendering)
router.get('/slug/:slug', getPageBySlug);

// Admin protected routes
router.use(protect);
router.get('/', getPages);
router.get('/id/:id', getPageById);
router.post('/', createPage);
router.put('/:id', updatePage);
router.delete('/:id', deletePage);

export default router;
