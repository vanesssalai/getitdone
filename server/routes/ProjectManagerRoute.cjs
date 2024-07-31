const express = require('express');
const router = express.Router();
const {
    createProject,
    fetchAllProjects,
    fetchProjectById,
    updateProjectById,
    deleteProjectById
} = require('../controllers/ProjectController.cjs');

router.get('/:userID', fetchAllProjects);
router.post('/:userID', createProject);
router.get('/:userID/:id', fetchProjectById);
router.put('/:userID/:id', updateProjectById);
router.delete('/:userID/:id', deleteProjectById);

module.exports = router;