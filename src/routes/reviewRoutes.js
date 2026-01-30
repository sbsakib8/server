import express from 'express';
import {
    createReview,
    getGigReviews,
    getSellerReviews
} from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('buyer'), createReview);
router.get('/gig/:gigId', getGigReviews);
router.get('/seller/:sellerId', getSellerReviews);

export default router;
