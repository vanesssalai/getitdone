const Task = require('../models/Task.cjs');
const Project = require('../models/Project.cjs');

exports.createTask = async (req, res) => {
    try {
        const { projectID } = req.params;
        const project = await Project.findById(projectID);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const newTask = new Task({
            ...req.body,
            projectID
        });

        const savedTask = await newTask.save();

        if (!project.tasks) {
            project.tasks = [];
        }
        project.tasks.push(savedTask._id);
        await project.save();

        res.status(201).json(savedTask);
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ message: "Error creating task", error: error.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { completed } = req.body;

        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { completed },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ message: "Error updating task", error: error.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const deletedTask = await Task.findByIdAndDelete(taskId);
        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting task", error: error.message });
    }
};

exports.fetchTasks = async (req, res) => {
    try {
        const { projectID } = req.params;
        const tasks = await Task.find({ projectID: projectID });
        res.status(200).json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: "Error fetching tasks", error: error.message });
    }
};

exports.updateSubtask = async (req, res) => {
    try {
        const { projectID, taskId, subtaskId } = req.params;
        const { completed } = req.body;

        const task = await Task.findOne({ _id: taskId, projectID: projectID });

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        const subtask = task.subTasks.id(subtaskId);

        if (!subtask) {
            return res.status(404).json({ message: "Subtask not found" });
        }

        subtask.completed = completed;
        await task.save();

        res.status(200).json({ message: "Subtask updated successfully", task });
    } catch (error) {
        console.error("Error updating subtask:", error);
        res.status(500).json({ message: "Error updating subtask", error: error.message });
    }
};

exports.fetchAllTasks = async (req, res) => {
    try {
        const { userId } = req.params;
        const userProjects = await Project.find({ userID: userId });
        const projectIds = userProjects.map(project => project._id);

        const tasks = await Task.find({
            projectID: { $in: projectIds },
            $or: [
                { completed: false, subTasks: { $size: 0 } },  
                { completed: false, 'subTasks.completed': false } 
            ]
        });

        res.status(200).json(tasks);
    } catch (error) {
        console.error("Error fetching all tasks:", error);
        res.status(500).json({ message: "Error fetching all tasks", error: error.message });
    }
};