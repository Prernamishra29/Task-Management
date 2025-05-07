const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'completed'],
      default: 'todo',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    notifications: [
      {
        message: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
        read: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

// Index for searching by title and description
taskSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Task', taskSchema);