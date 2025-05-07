const Task = require('../models/task.model');
const { validationResult } = require('express-validator');

// Get all tasks for the authenticated user
exports.getTasks = async (req, res) => {
  try {
    const filter = {};
    const { status, priority, search, dueDate, assignedTo, createdBy } = req.query;

    // Filter by status
    if (status) {
      filter.status = status;
    }

    // Filter by priority
    if (priority) {
      filter.priority = priority;
    }

    // Filter by due date
    if (dueDate) {
      // Find tasks due before the specified date
      filter.dueDate = { $lte: new Date(dueDate) };
    }

    // Filter by assigned user
    if (assignedTo === 'me') {
      filter.assignedTo = req.user.id;
    } else if (assignedTo) {
      filter.assignedTo = assignedTo;
    }

    // Filter by created user
    if (createdBy === 'me') {
      filter.createdBy = req.user.id;
    } else if (createdBy) {
      filter.createdBy = createdBy;
    }

    // Search by title or description
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Get tasks that are either created by or assigned to the current user
    const userTasks = await Task.find({
      $or: [
        { assignedTo: req.user.id },
        { createdBy: req.user.id },
      ],
      ...filter,
    })
      .populate('assignedTo', 'name email profilePicture')
      .populate('createdBy', 'name email profilePicture')
      .sort({ createdAt: -1 });

    res.json(userTasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error retrieving tasks' });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, dueDate, priority, status, assignedTo } = req.body;

  try {
    const newTask = new Task({
      title,
      description,
      dueDate,
      priority,
      status,
      assignedTo: assignedTo || req.user.id,
      createdBy: req.user.id,
      notifications: [
        {
          message: `Task "${title}" has been created and assigned`,
          createdAt: Date.now(),
          read: false,
        },
      ],
    });

    const task = await newTask.save();

    // Populate user details
    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email profilePicture')
      .populate('createdBy', 'name email profilePicture');

    res.status(201).json(populatedTask);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error creating task' });
  }
};

// Get a specific task
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email profilePicture')
      .populate('createdBy', 'name email profilePicture');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has permission to view the task
    if (
      task.assignedTo._id.toString() !== req.user.id &&
      task.createdBy._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Not authorized to view this task' });
    }

    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: 'Server error retrieving task' });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, dueDate, priority, status, assignedTo } = req.body;

  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has permission to update the task
    if (task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    // Check if assignment has changed
    const assignmentChanged = assignedTo && task.assignedTo.toString() !== assignedTo;

    // Update task fields
    const updateData = {
      title: title || task.title,
      description: description || task.description,
      dueDate: dueDate || task.dueDate,
      priority: priority || task.priority,
      status: status || task.status,
      assignedTo: assignedTo || task.assignedTo,
    };

    // Add notification if assignment changed
    if (assignmentChanged) {
      updateData.$push = {
        notifications: {
          message: `Task "${title || task.title}" has been reassigned`,
          createdAt: Date.now(),
          read: false,
        },
      };
    }

    // Update the task
    task = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )
      .populate('assignedTo', 'name email profilePicture')
      .populate('createdBy', 'name email profilePicture');

    res.json(task);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error updating task' });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has permission to delete the task
    if (task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await task.deleteOne();

    res.json({ message: 'Task removed' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error deleting task' });
  }
};

// Mark notification as read
exports.markNotificationRead = async (req, res) => {
  try {
    const { taskId, notificationId } = req.params;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has permission 
    if (
      task.assignedTo.toString() !== req.user.id &&
      task.createdBy.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Not authorized to update this notification' });
    }

    // Find and update the notification
    const notification = task.notifications.id(notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.read = true;
    await task.save();

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark notification error:', error);
    res.status(500).json({ message: 'Server error updating notification' });
  }
};