import Review from '../models/Review.js';
import Order from '../models/Order.js';
import Gig from '../models/Gig.js';

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private (Buyer only)
export const createReview = async (req, res) => {
    try {
        const { orderId, rating, comment } = req.body;
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.buyer.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        if (order.status !== 'completed') {
            return res.status(400).json({ message: 'Order must be completed before reviewing' });
        }

        const reviewExists = await Review.findOne({ order: orderId });
        if (reviewExists) {
            return res.status(400).json({ message: 'Order already reviewed' });
        }

        const review = await Review.create({
            order: orderId,
            gig: order.gig,
            reviewer: req.user._id,
            reviewee: order.seller,
            rating,
            comment
        });

        // Update Gig rating
        const gig = await Gig.findById(order.gig);
        const reviews = await Review.find({ gig: order.gig });

        gig.numReviews = reviews.length;
        gig.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

        await gig.save();

        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get reviews for a gig
// @route   GET /api/reviews/gig/:gigId
// @access  Public
export const getGigReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ gig: req.params.gigId })
            .populate('reviewer', 'name profile');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get reviews for a seller
// @route   GET /api/reviews/seller/:sellerId
// @access  Public
export const getSellerReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ reviewee: req.params.sellerId })
            .populate('reviewer', 'name profile');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
