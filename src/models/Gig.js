import mongoose from 'mongoose';

const gigSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    deliveryTime: {
        type: Number, // in days
        required: true,
    },
    images: [{
        type: String,
    }],
    rating: {
        type: Number,
        default: 0,
    },
    numReviews: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

const Gig = mongoose.model('Gig', gigSchema);
export default Gig;
