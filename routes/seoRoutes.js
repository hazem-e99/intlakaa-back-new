import express from 'express';
import { getSeoSettings, updateSeoSettings } from '../controllers/seoController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET  /api/seo  — fetch current settings (protected)
router.get('/', protect, getSeoSettings);

// PUT  /api/seo  — save settings + rewrite index.html (protected)
router.put('/', protect, updateSeoSettings);

export default router;
