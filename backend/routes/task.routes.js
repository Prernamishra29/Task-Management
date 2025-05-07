const express = require('express');
const { body } = require('express-validator');
const taskController = require('../controllers/task.controller');

const router = express.Router();

// Get all tasks
router.get('/', taskController.getTasks);

// Create a task
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('dueDate').isISO8601().withMessage('Invalid date format'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Priority must be low, medium, or high'),
    body('status')
      .optional()
      .isIn(['todo', 'in-progress', 'completed'])
      .withMessage('Status must be todo, in-progress, or completed'),
  ],
  taskController.createTask
);

// Get a specific task
router.get('/:id', taskController.getTask);

// Update a task
router.put(
  '/:id',
  [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty'),
    body('dueDate').optional().isISO8601().withMessage('Invalid date format'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Priority must be low, medium, or high'),
    body('status')
      .optional()
      .isIn(['todo', 'in-progress', 'completed'])
      .withMessage('Status must be todo, in-progress, or completed'),
  ],
  taskController.updateTask
);

// Delete a task
router.delete('/:id', taskController.deleteTask);

// Mark notification as read
router.patch('/:taskId/notifications/:notificationId/read', taskController.markNotificationRead);

module.exports = router;