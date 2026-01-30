import Order from '../models/Order.js';
import Gig from '../models/Gig.js';

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private (Buyer only)
export const createOrder = async (req, res) => {
    try {
        const { gigId } = req.body;
        const gig = await Gig.findById(gigId);

        if (!gig) {
            return res.status(404).json({ message: 'Gig not found' });
        }

        const order = await Order.create({
            gig: gigId,
            buyer: req.user._id,
            seller: gig.seller,
            price: gig.price,
            status: 'pending'
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get buyer orders
// @route   GET /api/orders/my-orders
// @access  Private (Buyer)
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ buyer: req.user._id })
            .populate('gig', 'title images')
            .populate('seller', 'name email');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get seller orders
// @route   GET /api/orders/my-sales
// @access  Private (Seller)
export const getMySales = async (req, res) => {
    try {
        const orders = await Order.find({ seller: req.user._id })
            .populate('gig', 'title images')
            .populate('buyer', 'name email');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Seller/Buyer)
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Only seller can mark as in_progress or delivered
        if (['in_progress', 'delivered'].includes(status)) {
            if (order.seller.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized' });
            }
        }

        // Only buyer can mark as completed
        if (status === 'completed') {
            if (order.buyer.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized' });
            }
        }

        order.status = status;
        if (status === 'delivered') {
            order.deliveryDate = Date.now();
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Submit work (seller)
// @route   PUT /api/orders/:id/submit
// @access  Private (Seller)
export const submitWork = async (req, res) => {
    try {
        const { fileUrl, message } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.seller.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        order.submission = {
            fileUrl,
            message,
            submittedAt: Date.now()
        };
        order.status = 'delivered';

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
