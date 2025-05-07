const express = require('express');
const userController = require('../controllers/user.controller');

const router = express.Router();

// Get all users
router.get('/', userController.getUsers);

// Get a specific user
router.get('/:id', userController.getUser);

// Update user profile
router.put('/:id', userController.updateUser);

module.exports = router;