import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    status: {
        type: String,
        enum: ['unassigned', 'assigned', 'in_progress', 'submitted', 'completed'],
        default: 'unassigned',
    },
    requests: [{
        solver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        message: String,
        status: {
            type: String,
            enum: ['pending', 'rejected', 'accepted'],
            default: 'pending'
        }
    }]
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);
export default Project;
