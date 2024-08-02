const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    dueDate: {
        type: String,
        required: true,
    },
    subTasks: [{
        title: String,
        completed: {
            type: Boolean,
            default: false
        }
    }],
    priority: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    projectID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
}, {
    timestamps: true
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;