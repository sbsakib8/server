import Gig from '../models/Gig.js';

// @desc    Create a new gig
// @route   POST /api/gigs
// @access  Private (Seller only)
export const createGig = async (req, res) => {
    try {
        const { title, description, price, category, deliveryTime, images } = req.body;

        const gig = await Gig.create({
            title,
            description,
            price,
            category,
            deliveryTime,
            images,
            seller: req.user._id
        });

        res.status(201).json(gig);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all gigs
// @route   GET /api/gigs
// @access  Public
export const getGigs = async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = {};

        if (category) {
            query.category = category;
        }

        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        const gigs = await Gig.find(query).populate('seller', 'name email profile');
        res.json(gigs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single gig
// @route   GET /api/gigs/:id
// @access  Public
export const getGigById = async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.id).populate('seller', 'name email profile');

        if (gig) {
            res.json(gig);
        } else {
            res.status(404).json({ message: 'Gig not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a gig
// @route   PUT /api/gigs/:id
// @access  Private (Owner only)
export const updateGig = async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.id);

        if (gig) {
            if (gig.seller.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'User not authorized' });
            }

            const { title, description, price, category, deliveryTime, images } = req.body;

            gig.title = title || gig.title;
            gig.description = description || gig.description;
            gig.price = price || gig.price;
            gig.category = category || gig.category;
            gig.deliveryTime = deliveryTime || gig.deliveryTime;
            gig.images = images || gig.images;

            const updatedGig = await gig.save();
            res.json(updatedGig);
        } else {
            res.status(404).json({ message: 'Gig not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a gig
// @route   DELETE /api/gigs/:id
// @access  Private (Owner only)
export const deleteGig = async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.id);

        if (gig) {
            if (gig.seller.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'User not authorized' });
            }

            await gig.deleteOne();
            res.json({ message: 'Gig removed' });
        } else {
            res.status(404).json({ message: 'Gig not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
