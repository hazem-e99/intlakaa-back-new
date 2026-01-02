import express from 'express';
import { login, getMe, changePassword, acceptInvite } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/accept-invite', acceptInvite);
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePassword);

export default router;
