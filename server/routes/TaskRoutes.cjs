const express = require('express');
const router = express.Router();
const { createTask, updateTask, deleteTask, fetchTasks } = require('../controllers/TaskController.cjs');

router.get('/:projectID/tasks', fetchTasks);
router.post('/:projectID/tasks', createTask);
router.put('/:projectID/tasks/:taskId', updateTask);
router.delete('/:projectID/tasks/:taskId', deleteTask);

module.exports = router;