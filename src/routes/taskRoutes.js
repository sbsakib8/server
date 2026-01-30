import express from 'express';
import {
    createTask,
    getTasks,
    submitTask,
    updateTaskStatus
} from '../controllers/taskController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, authorize('problem_solver'), createTask)
    .get(protect, getTasks);

router.post('/:id/submit', protect, authorize('problem_solver'), upload.single('file'), submitTask);
router.put('/:id/status', protect, authorize('buyer', 'admin'), updateTaskStatus);

export default router;
