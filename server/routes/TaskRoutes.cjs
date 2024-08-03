const express = require('express');
const router = express.Router();
const { createTask, updateTask, deleteTask, fetchTasks, updateSubtask, fetchAllTasks } = require('../controllers/TaskController.cjs');

router.get('/user/:userId/tasks', fetchAllTasks);
router.get('/:projectID/tasks', fetchTasks);
router.post('/:projectID/tasks', createTask);
router.put('/:projectID/tasks/:taskId', updateTask);
router.put('/:projectID/tasks/:taskId/subtasks/:subtaskId', updateSubtask);
router.delete('/:projectID/tasks/:taskId', deleteTask);

module.exports = router;