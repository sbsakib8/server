import express from 'express';
import {
    createOrder,
    getMyOrders,
    getMySales,
    updateOrderStatus,
    submitWork
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, authorize('buyer'), createOrder);

router.get('/my-orders', protect, authorize('buyer', 'admin'), getMyOrders);
router.get('/my-sales', protect, authorize('problem_solver', 'admin'), getMySales);

router.put('/:id/status', protect, authorize('buyer', 'problem_solver', 'admin'), updateOrderStatus);
router.put('/:id/submit', protect, authorize('problem_solver', 'admin'), submitWork);

export default router;
