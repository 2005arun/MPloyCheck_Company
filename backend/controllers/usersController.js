const User = require('../models/User');

const getUsers = async (req, res) => {
  try {
    // Configurable delay via query parameter (e.g., ?delay=3000)
    const delay = parseInt(req.query.delay) || 0;
    if (delay > 0 && delay <= 10000) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    const requestingUser = req.user;

    // Role-based data: admin sees all, regular user sees only own record
    let users;
    if (requestingUser.role === 'admin') {
      users = await User.find().select('-password');
    } else {
      users = await User.find({ _id: requestingUser.id }).select('-password');
    }

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const delay = parseInt(req.query.delay) || 0;
    if (delay > 0 && delay <= 10000) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { username, password, role, department, accessLevel } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ username, password, role, department, accessLevel });
    await user.save();

    const delay = parseInt(req.query.delay) || 0;
    if (delay > 0 && delay <= 10000) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    res.status(201).json({
      message: 'User created successfully',
      user: { id: user._id, username: user.username, role: user.role, department: user.department, accessLevel: user.accessLevel }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, role, department, accessLevel } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { username, role, department, accessLevel },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const delay = parseInt(req.query.delay) || 0;
    if (delay > 0 && delay <= 10000) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const delay = parseInt(req.query.delay) || 0;
    if (delay > 0 && delay <= 10000) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const delay = parseInt(req.query.delay) || 0;
    if (delay > 0 && delay <= 10000) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    const totalUsers = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });
    const userCount = await User.countDocuments({ role: 'user' });
    const departments = await User.distinct('department');

    res.json({
      totalUsers,
      adminCount,
      userCount,
      departmentCount: departments.filter(d => d).length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getUsers, getProfile, createUser, updateUser, deleteUser, getDashboardStats };
