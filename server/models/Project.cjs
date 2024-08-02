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
    backgroundColor: {
        type: String,
        default: "grey"
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
}, {
    timestamps: {
        createdAt: true, 
        updatedAt: true 
    }
});

const Project = mongoose.model('Projects', projectSchema);
module.exports = Project;