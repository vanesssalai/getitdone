const express = require('express');
const router = express.Router();
const {
    createProject,
    fetchAllProjects,
    fetchProjectById,
    updateProjectById,
    deleteProjectById
} = require('../controllers/ProjectController.cjs');

router.get('/project/:id', fetchProjectById);
router.put('/project/:id', updateProjectById);
router.delete('/project/:id', deleteProjectById);
router.get('/user/:userID', fetchAllProjects);
router.post('/', createProject);

module.exports = router;