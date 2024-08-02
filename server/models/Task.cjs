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
    projectID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Projects',
        required: true
    },
    priority: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        required: true,
    },
}, {
    timestamps: {
        createdAt: true, 
        updatedAt: true 
    }
});

const task = mongoose.model('tasks', taskSchema);
module.exports = task;