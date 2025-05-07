const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const router = express.Router();

// Register a new user
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
  ],
  authController.register
);

// Login user
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  authController.login
);

// Get current user
router.get('/me', verifyToken, authController.getCurrentUser);

module.exports = router;