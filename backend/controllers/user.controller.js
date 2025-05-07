const User = require('../models/user.model');

// Get all users (for task assignment)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('name email profilePicture');
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error retrieving users' });
  }
};

// Get a specific user
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error retrieving user' });
  }
};

// Update user profile
exports.updateUser = async (req, res) => {
  const { name, profilePicture } = req.body;

  try {
    // Only allow updating the current user
    if (req.params.id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this user' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, profilePicture },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error updating user' });
  }
};