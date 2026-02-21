import express from 'express';
import { getSeoSettings, updateSeoSettings, syncSeoFromHtml } from '../controllers/seoController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET  /api/seo       — fetch current settings (protected)
router.get('/', protect, getSeoSettings);

// PUT  /api/seo       — save settings + rewrite index.html (protected)
router.put('/', protect, updateSeoSettings);

// POST /api/seo/sync  — re-read index.html and sync DB (protected)
router.post('/sync', protect, syncSeoFromHtml);

export default router;
