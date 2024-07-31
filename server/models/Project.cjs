const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
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
    tags: {
        type: [String], 
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    }
});

const Project = mongoose.model('Projects', projectSchema);
module.exports = Project;