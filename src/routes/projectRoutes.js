import express from 'express';
import {
    createProject,
    getProjects,
    getMyProjects,
    getProjectById,
    requestProject,
    assignProject
} from '../controllers/projectController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getProjects)
    .post(protect, authorize('buyer'), createProject);

router.get('/my', protect, getMyProjects);

router.route('/:id')
    .get(protect, getProjectById);

router.post('/:id/request', protect, authorize('problem_solver'), requestProject);
router.put('/:id/assign', protect, authorize('buyer', 'admin'), assignProject);

export default router;
