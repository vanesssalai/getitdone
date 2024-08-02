const Project = require("../models/Project.cjs");

exports.createProject = async (req, res) => {
    try {
        const { title, description, dueDate, tags, userID } = req.body;

        const project = new Project({
            title,
            description,
            dueDate,
            tags: Array.isArray(tags) ? tags : [],
            userID
        });

        await project.save();
        res.status(201).json(project);
    } catch (error) {
        console.error('Error creating project:', error.message);
        res.status(500).json({ message: 'Error creating project', error: error.message });
    }
};

exports.fetchAllProjects = async (req, res) => {
    console.log("Received request for userID:", req.params.userID);
    try {
      const projects = await Project.find({ userID: req.params.userID });
      console.log("Found projects:", projects);
      res.status(200).json(projects);
    } catch (error) {
      console.error('Error fetching projects:', error.message);
      res.status(500).json({ message: 'Error fetching projects', error: error.message });
    }
};

exports.fetchProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project || project.userID.toString() !== req.params.userID) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json(project);
    } catch (error) {
        console.error('Error fetching project:', error.message);
        res.status(500).json({ message: 'Error fetching project', error: error.message });
    }
};

exports.updateProjectById = async (req, res) => {
    try {
        const { title, description, dueDate, tags, userID } = req.body;
        const project = await Project.findOneAndUpdate(
            { _id: req.params.id, userID },
            { title, description, dueDate, tags: Array.isArray(tags) ? tags : [] },
            { new: true, runValidators: true }
        );

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json(project);
    } catch (error) {
        console.error('Error updating project:', error.message);
        res.status(500).json({ message: 'Error updating project', error: error.message });
    }
};

exports.deleteProjectById = async (req, res) => {
    try {
        const project = await Project.findOneAndDelete({ _id: req.params.id, userID: req.params.userID });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json({ message: 'Project deleted' });
    } catch (error) {
        console.error('Error deleting project:', error.message);
        res.status(500).json({ message: 'Error deleting project', error: error.message });
    }
};
