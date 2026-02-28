import express from 'express';
import {
  getPosts,
  getPostBySlug,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/postController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public
router.get('/', getPosts);
router.get('/slug/:slug', getPostBySlug);

// Admin protected
router.use(protect);
router.get('/id/:id', getPostById);
router.post('/', createPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

export default router;
