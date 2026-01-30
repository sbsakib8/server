import Project from '../models/Project.js';

// @desc    Create a project
// @route   POST /api/projects
// @access  Private (Buyer)
const createProject = async (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    const project = await Project.create({
        title,
        description,
        buyer: req.user._id,
    });

    res.status(201).json(project);
};

// @desc    Get all projects (for marketplace)
// @route   GET /api/projects
// @access  Private (Solver/Admin)
const getProjects = async (req, res) => {
    // Solvers see unassigned projects usually, or all.
    // Admin sees all.
    const keyword = req.query.keyword
        ? {
            title: {
                $regex: req.query.keyword,
                $options: 'i',
            },
        }
        : {};

    let query = { ...keyword };
    // If solver, maybe only show 'unassigned'? 
    // Requirement says "Browse available projects".
    if (req.user.role === 'problem_solver') {
        query.status = 'unassigned';
    }

    const projects = await Project.find(query).populate('buyer', 'name email');
    res.json(projects);
};

// @desc    Get my projects (Buyer or Solver active ones)
// @route   GET /api/projects/my
// @access  Private
const getMyProjects = async (req, res) => {
    let projects;
    if (req.user.role === 'buyer') {
        projects = await Project.find({ buyer: req.user._id }).populate('assignedTo', 'name email');
    } else if (req.user.role === 'problem_solver') {
        projects = await Project.find({ assignedTo: req.user._id }).populate('buyer', 'name email');
    } else {
        projects = await Project.find({}); // Admin likely
    }
    res.json(projects);
}

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res) => {
    const project = await Project.findById(req.params.id)
        .populate('buyer', 'name email')
        .populate('assignedTo', 'name email')
        .populate('requests.solver', 'name email profile');

    if (project) {
        res.json(project);
    } else {
        res.status(404).json({ message: 'Project not found' });
    }
};

// @desc    Request to work on a project
// @route   POST /api/projects/:id/request
// @access  Private (Solver)
const requestProject = async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        return res.status(404).json({ message: 'Project not found' });
    }

    if (project.status !== 'unassigned') {
        return res.status(400).json({ message: 'Project is already assigned' });
    }

    // Check if already requested
    const alreadyRequested = project.requests.find(
        (r) => r.solver.toString() === req.user._id.toString()
    );

    if (alreadyRequested) {
        return res.status(400).json({ message: 'You have already requested this project' });
    }

    project.requests.push({ solver: req.user._id, message: req.body.message });
    await project.save();

    res.status(200).json({ message: 'Request sent successfully' });
};

// @desc    Assign project to solver
// @route   PUT /api/projects/:id/assign
// @access  Private (Buyer)
const assignProject = async (req, res) => {
    const project = await Project.findById(req.params.id);
    const { solverId } = req.body;

    if (!project) {
        return res.status(404).json({ message: 'Project not found' });
    }

    if (project.buyer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(401).json({ message: 'Not authorized' });
    }

    if (project.status !== 'unassigned') {
        return res.status(400).json({ message: 'Project already assigned' });
    }

    project.assignedTo = solverId;
    project.status = 'assigned';

    // Update request status
    const reqIndex = project.requests.findIndex(r => r.solver.toString() === solverId);
    if (reqIndex !== -1) {
        project.requests[reqIndex].status = 'accepted';
    }

    await project.save();
    res.json(project);
};

export { createProject, getProjects, getMyProjects, getProjectById, requestProject, assignProject };
