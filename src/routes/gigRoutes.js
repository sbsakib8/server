import express from 'express';
import {
    createGig,
    getGigs,
    getGigById,
    updateGig,
    deleteGig
} from '../controllers/gigController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getGigs)
    .post(protect, authorize('problem_solver', 'admin'), createGig);

router.route('/:id')
    .get(getGigById)
    .put(protect, authorize('problem_solver', 'admin'), updateGig)
    .delete(protect, authorize('problem_solver', 'admin'), deleteGig);

export default router;
