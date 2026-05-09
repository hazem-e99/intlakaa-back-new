import express from 'express';
import { getInfoPage, updateInfoPage, resetInfoPage } from '../controllers/infoPageController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getInfoPage);
router.put('/', protect, updateInfoPage);
router.post('/reset', protect, resetInfoPage);

export default router;
