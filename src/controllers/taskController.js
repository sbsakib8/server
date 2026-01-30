import Task from '../models/Task.js';
import Project from '../models/Project.js';

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private (Solver)
const createTask = async (req, res) => {
    const { projectId, title, description, deadline } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
        return res.status(404).json({ message: 'Project not found' });
    }

    // specific strict check: only assigned solver can create tasks
    if (project.assignedTo.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to create tasks for this project' });
    }

    const task = await Task.create({
        project: projectId,
        solver: req.user._id,
        title,
        description,
        deadline
    });

    // Update project status to in_progress if not already
    if (project.status === 'assigned') {
        project.status = 'in_progress';
        await project.save();
    }

    res.status(201).json(task);
};

// @desc    Get tasks for a project
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
    const { projectId } = req.query;

    if (!projectId) {
        return res.status(400).json({ message: 'Project ID required' });
    }

    // Verify access? (Buyer, Solver, Admin)
    // For simplicity, let involved parties see.
    const tasks = await Task.find({ project: projectId });
    res.json(tasks);
};

// @desc    Submit work for a task
// @route   POST /api/tasks/:id/submit
// @access  Private (Solver)
const submitTask = async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }

    if (task.solver.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
    }

    if (!req.file) {
        return res.status(400).json({ message: 'Please upload a file' });
    }

    task.submission = {
        fileUrl: `/${req.file.path.replace(/\\/g, "/")}`, // basic path normalization
        submittedAt: Date.now(),
        fileName: req.file.filename
    };
    task.status = 'submitted';

    await task.save();

    // Check if checks/project status needs update? 
    // Usually Buyer reviews then accepts.

    res.json(task);
};

// @desc    Update task status (e.g. Accept/Reject)
// @route   PUT /api/tasks/:id/status
// @access  Private (Buyer)
const updateTaskStatus = async (req, res) => {
    const { status } = req.body; // 'completed' or 'pending' (reject)
    const task = await Task.findById(req.params.id).populate('project');

    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }

    if (task.project.buyer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized' });
    }

    if (status) {
        task.status = status;
        await task.save();
    }

    // Check if Project should be completed?
    // If all tasks completed
    if (status === 'completed') {
        const allTasks = await Task.find({ project: task.project._id });
        const allCompleted = allTasks.every(t => t.status === 'completed');

        if (allCompleted) {
            const project = await Project.findById(task.project._id);
            project.status = 'completed';
            await project.save();
        }
    }

    res.json(task);
};

export { createTask, getTasks, submitTask, updateTaskStatus };
