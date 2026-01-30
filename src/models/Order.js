import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    gig: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gig',
        required: true,
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'delivered', 'completed', 'cancelled'],
        default: 'pending',
    },
    deliveryDate: {
        type: Date,
    },
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'paid'],
        default: 'unpaid',
    },
    submission: {
        fileUrl: String,
        message: String,
        submittedAt: Date,
    }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;
