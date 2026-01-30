import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    solver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    deadline: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'submitted', 'completed'],
        default: 'pending',
    },
    submission: {
        fileUrl: String,
        submittedAt: Date,
        fileName: String
    }
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);
export default Task;
