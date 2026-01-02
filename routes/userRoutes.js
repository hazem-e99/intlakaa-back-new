import express from 'express';
import {
  getAllUsers,
  inviteUser,
  updateUserRole,
  deleteUser
} from '../controllers/userController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication and owner role
router.use(protect);
router.use(restrictTo('owner'));

router.get('/', getAllUsers);
router.post('/invite', inviteUser);
router.put('/:id/role', updateUserRole);
router.delete('/:id', deleteUser);

export default router;
