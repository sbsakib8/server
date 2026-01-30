import express from 'express';
import { registerUser, authUser, getUserProfile, getUsers } from '../controllers/authController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);
router.get('/users', protect, authorize('admin'), getUsers);

export default router;
